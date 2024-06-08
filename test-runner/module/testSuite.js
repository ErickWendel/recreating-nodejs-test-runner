class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.beforeHooks = [];
        this.beforeEachHooks = [];

        this.afterHooks = [];
        this.afterEachHooks = [];
    }
}

export default TestSuite;
