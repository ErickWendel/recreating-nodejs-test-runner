import { fork } from 'node:child_process';
import fs from 'node:fs/promises';
import { events } from './../shared/vars.js';

class TestRunner {
    constructor(folderName, formatter, reporter) {
        this.folderName = folderName;
        this.formatter = formatter;
        this.reporter = reporter;
        this.results = new Map();
        this.tests = {
            passing: 0,
            failing: 0,
            suites: 0,
        };
        this.startedAt = process.hrtime.bigint();
    }

    async runTests() {
        const files = (await fs.readdir(this.folderName)).filter(item => /.test.js/.test(item));
        const finished = []
        for (const file of files) {
            finished.push(this.runTestFile(file));
        }
        await Promise.all(finished)

        this.reporter.printSummary(this.tests, this.formatter.calcElapsed(this.startedAt));

    }

    async runTestFile(file) {
        const fullFileName = `${this.folderName}/${file}`;
        const cp = fork(fullFileName);

        const hooksNotPrint = ['before', 'beforeEach', 'after', 'afterEach'];
        const eventsOutput = [
            events.log,
            events.testPass,
            events.testFail
        ];
        const shouldNotCount = (event, name) => (
            hooksNotPrint.includes(name)
            &&
            event !== events.log
        )
        cp.on('message', ({ event, data }) => {
            if (!event) return;

            switch (event) {
                case events.suiteStart:
                    if (data.tree) break;
                    this.tests.suites++;
                    break;
                case events.testPass:
                    if (shouldNotCount(event, data.name)) break;
                    this.tests.passing++;
                    break;
                case events.testFail:
                    this.tests.failing++;
                    break;
                default:
                    break;
            }

            if (shouldNotCount(event, data.name)) return;

            if (!eventsOutput.includes(event)) return;

            const formattedResult = this.formatter.formatTestResult(data, event);
            this.results.set(data.tree, this.results.get(data.tree) || []);
            this.results.get(data.tree).push(formattedResult);
        });


        cp.once('error', (err) => {
            console.error(err)
        })

        return new Promise(resolve => cp.once('exit', resolve)).finally(() => {
            this.reporter.updateOutput(this.results, this.formatter);
        })
    }
}

export default TestRunner;
