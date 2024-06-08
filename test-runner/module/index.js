import TestRunner from './testRunner.js';
const runner = new TestRunner();

const describe = runner.describe.bind(runner);
const it = runner.it.bind(runner);
const before = runner.before.bind(runner);
const beforeEach = runner.beforeEach.bind(runner);

const after = runner.after.bind(runner);
const afterEach = runner.afterEach.bind(runner);


export {
    describe,
    it,
    before,
    beforeEach,
    after,
    afterEach,
};
