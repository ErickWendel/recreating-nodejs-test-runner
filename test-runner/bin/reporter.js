import { styleText } from 'node:util';

const green = msg => styleText('green', msg);
const yellow = msg => styleText('yellow', msg);
const blue = msg => styleText('blue', msg);
const gray = msg => styleText('gray', msg);
const red = msg => styleText('red', msg);

class Reporter {
    #formatter
    constructor(formatter) {
        this.#formatter = formatter
    }
    updateOutput(results) {
        // Clear the console
        process.stdout.write('\x1Bc');

        // Print all results in tree order
        results.forEach((testResults, tree) => {
            if (!tree) {
                0;
            }
            process.stdout.write(this.#formatter.formatTree(tree, testResults));
        });
    }

    printSummary(tests, elapsedMs) {
        const summary = this.#formatter.generateSummary(tests, elapsedMs);
        console.log(summary);
        console.log(gray('.'.repeat(33)), '\n');
        console.log(`${yellow('Made')} ${blue('with ')}${red('love by')} ${green(`Erick Wendel`)} ${yellow(':)')}`);
        console.log(`${green('@erickwendel_')}`);
        console.log(gray('.'.repeat(33)));
    }
}

export default Reporter;
