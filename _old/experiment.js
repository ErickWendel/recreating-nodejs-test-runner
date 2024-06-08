import fs from 'fs';
import path from 'path';

function describe(desc, fn) {
    fn()
}
function it(desc, fn) {
    fn()
}

const Logger = {
    log: (message) => {
        try {
            throw new Error();
        } catch (error) {
            console.error(error.stack.split('\n'))
        }
    }
}


describe('Suite01', () => {
    describe('Suite02', () => {
        it('my test case01', () => {
            Logger.log('Hello there!')
        })
    })
})