#!/usr/bin/env node

import TestRunner from './test-runner.js';
import Formatter from './formatter.js';
import Reporter from './reporter.js';

const [folderName] = process.argv.map((value, index, list) => {
    if (value === '--test') return list[index + 1];
    return null;
}).filter(i => !!i);

if (!folderName) {
    console.error('Please specify the test folder using --test <folder>');
    process.exit(1);
}
const folder = `${process.cwd()}/${folderName}`
const formatter = new Formatter();
const reporter = new Reporter(formatter);
const testRunner = new TestRunner(folder, formatter, reporter);

const hasError = await testRunner.runTests();
process.exit(hasError ? 1 : 0)
