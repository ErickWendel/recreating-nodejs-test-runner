import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage();

export const buildDependencyTree = (suiteStack, message) => {
    let formattedPath = '';
    for (let i = 0; i < suiteStack.length; i++) {
        if (['before', 'beforeEach', 'after', 'afterEach', 'it'].find(item => item === suiteStack[i].type)) {
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

export const calcElapsed = (startedAt) => {
    const endedAt = process.hrtime.bigint();
    const elapsedTimeMs = (
        Number(endedAt - startedAt) / 1000000
    ).toFixed(2);
    return elapsedTimeMs;
}