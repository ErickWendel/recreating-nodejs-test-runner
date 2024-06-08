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
    }
}

export default Reporter;
