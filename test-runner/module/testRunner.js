import { styleText } from 'node:util';
import { EventEmitter } from 'events';
import { AsyncLocalStorage } from 'async_hooks';
import TestSuite from './testSuite.js';
import { events } from './../shared/vars.js';
const green = msg => styleText('green', msg);

const asyncLocalStorage = new AsyncLocalStorage();

class TestRunner extends EventEmitter {
    constructor() {
        super();
        // todo: fix output
        // console.log(green('running executing: ' + this.#getFileOriginName()))
    }
    describe(name, fn) {
        const suite = new TestSuite(name);
        const context = asyncLocalStorage.getStore() || {};
        const currentStack = context.suiteStack ? [...context.suiteStack, suite] : [suite];

        this.#emit(events.suiteStart, suite);

        asyncLocalStorage.run({ suiteStack: currentStack }, async () => {
            await fn();
            await this.#runSuite(suite);
            this.#emit(events.suiteEnd, suite);
        });
    }

    it(description, testFn) {
        const suite = this.#getCurrentSuite();
        suite.tests.push(this.#wrapTest({ name: description, type: 'it' }, testFn));
    }

    before(hookFn) {
        const suite = this.#getCurrentSuite();
        suite.beforeHooks.push(this.#wrapTest({ name: 'before', type: 'before' }, hookFn));
    }

    #emit(event, data) {
        super.emit(event, data);
        process.send?.({ event, data });
    }

    beforeEach(hookFn) {
        const suite = this.#getCurrentSuite();
        suite.beforeEachHooks.push(this.#wrapTest({ name: 'beforeEach', type: 'beforeEach' }, hookFn));
    }
    after(hookFn) {
        const suite = this.#getCurrentSuite();
        suite.afterHooks.push(this.#wrapTest({ name: 'after', type: 'after' }, hookFn));
    }

    afterEach(hookFn) {
        const suite = this.#getCurrentSuite();
        suite.afterEachHooks.push(this.#wrapTest({ name: 'afterEach', type: 'afterEach' }, hookFn));
    }

    #getCurrentSuite() {
        const context = asyncLocalStorage.getStore() || {};
        const suiteStack = context.suiteStack;
        const currentSuite = suiteStack[suiteStack.length - 1];
        return currentSuite;
    }

    async #runSuite(suite) {
        for (const before of suite.beforeHooks) {
            await before();
        }

        for (const test of suite.tests) {
            for (const beforeEach of suite.beforeEachHooks) {
                await beforeEach();
            }

            await test();

            for (const afterEach of suite.afterEachHooks) {
                await afterEach();
            }
        }

        for (const after of suite.afterHooks) {
            await after();
        }
    }

    #wrapTest(data, testFn) {
        const that = this;
        const logger = (info) => ({
            log(message) {
                that.emit(events.log, { ...info, message });
            }
        })
        return async () => {
            const startedAt = process.hrtime.bigint();
            const currentContext = asyncLocalStorage.getStore() || {};
            const info = { ...data, tree: this.#buildDependencyTree(currentContext.suiteStack) };

            this.#emit(events.testStart, info);

            const mergedContext = {
                suiteStack: [...currentContext.suiteStack, info],
                fileOriginName: this.fileOriginName,
            };

            await asyncLocalStorage.run(mergedContext, async () => {
                try {
                    await testFn({ diagnostic: logger(info) });

                    const elapsedTimeMs = this.#calcElapsed(startedAt);
                    this.#emit(events.testPass, { ...info, elapsedTimeMs });
                } catch (error) {
                    const elapsedTimeMs = this.#calcElapsed(startedAt);
                    this.#emit(events.testFail, { error: { ...error, stack: error.stack }, ...info, elapsedTimeMs });
                }
                const elapsedTimeMs = this.#calcElapsed(startedAt);
                this.#emit(events.testEnd, { ...info, elapsedTimeMs });
            });
        };
    }

    #buildDependencyTree(suiteStack) {
        let formattedPath = '';
        suiteStack.forEach((suite, index) => {
            formattedPath += `${' '.repeat(index * 4)}${suite.name}\n`;
        });
        return formattedPath.trimEnd();
    }

    #calcElapsed(startedAt) {
        const endedAt = process.hrtime.bigint();
        return (Number(endedAt - startedAt) / 1000000).toFixed(2);
    }

    #getFileOriginName() {
        const stack = new Error().stack;
        const fileOrigin = stack.split('\n').filter(line => !line.includes('(node:')).reverse()[0];
        const fileStart = 'file://';
        const fileEnd = '.js';
        const [indexStart, indexEnd] = [fileOrigin.indexOf(fileStart), fileOrigin.indexOf(fileEnd)];
        return fileOrigin.slice(indexStart, indexEnd) + '.js';
    }
}

export default TestRunner;
