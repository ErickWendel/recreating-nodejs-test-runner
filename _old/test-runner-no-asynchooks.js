import { EventEmitter } from 'events';
import { AsyncLocalStorage } from 'async_hooks';
const asyncLocalStorage = new AsyncLocalStorage();
const buildDependencyTree = (suiteStack, message) => {
    let formattedPath = '';
    for (let i = 0; i < suiteStack.length; i++) {
        if (['before', 'beforeEach', 'it'].find(item => item === suiteStack[i].type)) {
            formattedPath += ' '.repeat(i * 4) + `${suiteStack[i].name}:\n`;
        } else {
            formattedPath += ' '.repeat(i * 4) + suiteStack[i].name + '\n';
        }
    }

    let indentedMessage = ' '.repeat(suiteStack.length * 4)
    if (message)
        indentedMessage = indentedMessage.concat(`Log: ${message.trimStart()}\n`);

    return formattedPath.concat(indentedMessage).trimEnd()
}

class Logger {
    static log(...args) {
        const context = asyncLocalStorage.getStore() || {};
        const suiteStack = context.suiteStack || [];
        console.log(
            '\n',
            buildDependencyTree(suiteStack, args.join(' ')),
            '\n'
        );
    }
    static count(...args) {
        const context = asyncLocalStorage.getStore() || {};
        const suiteStack = context.suiteStack || [];
        console.count(
            buildDependencyTree(suiteStack, args.join(' ')),
        );
    }
}

class TestSuite {
    constructor(name) {
        this.name = name;
        this.beforeHooks = [];
        this.beforeEachHooks = [];
        this.tests = [];
    }
}

let store = {};
class TestRunner extends EventEmitter {
    constructor() {
        super();
    }

    describe(name, fn) {
        const suite = new TestSuite(name);
        let currentStack;
        this.emit('suiteStart', suite);

        // Fetch the current stack and append the new suite to it
        const context = store
        if (context.suiteStack) {
            currentStack = [...context.suiteStack, suite];
        } else {
            currentStack = [suite];
        }

        store.suiteStack = currentStack;
        // asyncLocalStorage.run({
        //     suiteStack: currentStack
        // }, async () => {
        fn(store);
        this.#runSuite(suite, currentStack);
        this.emit('suiteEnd', suite);
        // });
    }

    it(description, testFn) {
        const suite = this.#getCurrentSuite();
        suite.tests.push(this.#wrapTest({ name: description, type: 'it' }, testFn));
    }

    before(hookFn) {
        const suite = this.#getCurrentSuite();
        suite.beforeHooks.push(this.#wrapTest({ name: 'before', type: 'before' }, hookFn));
    }

    beforeEach(hookFn) {
        const suite = this.#getCurrentSuite();
        suite.beforeEachHooks.push(this.#wrapTest({ name: 'beforeEach', type: 'beforeEach' }, hookFn));
    }

    #getCurrentSuite() {
        const context = store;
        const suiteStack = context.suiteStack;
        const currentSuite = suiteStack[suiteStack.length - 1];
        currentSuite.beforeEachHooks ??= [];
        currentSuite.beforeHooks ??= [];

        return currentSuite
    }

    async #runSuite(suite) {
        for (const hook of suite.beforeHooks) {
            await hook();
        }

        for (const test of suite.tests) {
            for (const hook of suite.beforeEachHooks) {
                await hook();
            }
            await test();
        }
    }

    #wrapTest(data, testFn) {
        return async () => {
            const startedAt = process.hrtime.bigint();

            const currentContext = store;
            const info = {
                ...data,
                tree: buildDependencyTree(currentContext.suiteStack)
            }
            this.emit('testStart', info);

            // Extend the current suite stack with the new test info
            const mergedContext = {
                suiteStack: [...currentContext.suiteStack, info]
            };

            await asyncLocalStorage.run(mergedContext, async () => {
                await testFn(info);
                const endedAt = process.hrtime.bigint();
                const elapsedTimeMs = (
                    Number(endedAt - startedAt) / 1_000_000
                ).toFixed(2);
                this.emit('testEnd', { ...info, elapsedTimeMs });
            });
        }
    }


}

const runner = new TestRunner();

// runner.describe('Test Suite 01', (currentStack) => {
//     console.log('Test01', currentStack)
//     runner.describe('Test Suite 02', (currentStack) => {
//         console.log('Test02', currentStack)
//         runner.describe('Test Suite 03', (currentStack) => {
//             console.log('Test03', currentStack)
//         })
//     })
// })

global.describe = runner.describe.bind(runner);
global.it = runner.it.bind(runner);
global.before = runner.before.bind(runner);
global.beforeEach = runner.beforeEach.bind(runner);

export {
    runner,
    Logger,
};
