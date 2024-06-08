import { styleText } from 'node:util';
import { events } from './../shared/vars.js';

const red = msg => styleText('red', msg);
const green = msg => styleText('green', msg);
const gray = msg => styleText('gray', msg);
const blue = msg => styleText('blue', msg);

class Formatter {
    calcElapsed(startedAt) {
        const endedAt = process.hrtime.bigint();
        return (
            (Number(endedAt - startedAt) / 1000000).toFixed(2)
        );
    }

    formatTree(tree, results) {
        const lines = tree.split('\n');
        let formattedTree = '';
        lines.forEach((line, index) => {
            if (index === lines.length - 1) {
                formattedTree += `${'  '.repeat(index)}▶ ${line.trim()}\n`;
                if (results) {
                    results.forEach(result => {
                        formattedTree += `${'  '.repeat(index + 1)}${result}`;
                    });
                }
            } else {
                formattedTree += `${'  '.repeat(index)}▶ ${line.trim()}\n`;
            }
        });
        return formattedTree;
    }

    formatStack(errorStack) {
        const [firstLine, ...stack] = errorStack.split('\n')
            .filter(line => !(line.includes('node_modules') || line.includes('node:')));

        const lineError = stack.find(line => line.includes('file://'));
        return `${red(firstLine)}\n${gray(lineError)}\n`;
    }

    formatTestResult(data, event) {
        const { name, elapsedTimeMs, error } = data;
        if (event === events.log) {
            return gray(`\tℹ ${data.message}\n`)
        }

        const elapsedTime = parseFloat(elapsedTimeMs).toFixed(6);

        if (event === events.testPass) {
            return green(`✔ ${name} (${elapsedTime}ms)\n`);
        }

        if (event === events.testFail) {
            const formattedErrorDetails = this.formatErrorDetails(error);
            return red(`✖ ${name} (${elapsedTime}ms)\n      ${formattedErrorDetails}\n`);
        }

        return '';
    }

    formatErrorDetails(error) {
        // exception ocurred
        if (!error.actual) {
            const [first, ...remain] = error.stack.split('\n')
            return `\n\n${red(first)}\n${gray(remain.join('\n'))}`
        }
        return [
            `\nAssertionError [${error.code}]: Expected values to be strictly deep-equal:`,
            `+ actual - expected\n`,
            `${this.formatJson(error.actual, '+')}`,
            `${this.formatJson(error.expected, '-')}`,
            `\nat ${this.formatStack(error.stack)}`,
        ].join('\n');
    }

    formatJson(json, prefix) {
        return JSON.stringify(json, null, 2)
            .split('\n')
            .map(line => `${prefix}   ${line}`)
            .join('\n');
    }

    generateSummary(tests, elapsedMs) {
        const total = tests.passing + tests.failing;
        return blue(`
ℹ tests ${total}
ℹ suites ${tests.suites}
ℹ pass ${tests.passing}
ℹ fail ${tests.failing}
ℹ duration_ms ${elapsedMs}
        `);
    }
}

export default Formatter;
