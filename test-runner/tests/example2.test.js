import { setTimeout } from 'node:timers/promises';
import { deepStrictEqual } from 'node:assert';
import { describe, it, before, beforeEach } from './../module/index.js'

// const { describe, it, before, beforeEach } = global; // was injected after importing there
// runner.on('testStart', (data) => {
//     // console.log(`\n🚀 Test ${data.name} started.`);
// });

// runner.on('testEnd', ({ elapsedTimeMs, name }) => {
//     console.log(`\n✅ Hook [${name}] ended. Elapsed time: ${elapsedTimeMs}ms\n`);
// });

describe('SU 0', () => {
    describe('SU 0', () => {
        it('haha pass', async (ctx) => {
            deepStrictEqual({ d: 1 }, { d: 1 });
        });
    })
})
describe('Suite 0', () => {
    // todo: t.logger.count
    describe('Sub 1', () => {
        describe('Sub 2', () => {
            it('hoho pass', async (ctx) => {
                deepStrictEqual({ d: 1 }, { d: 1 });
            });
        })
    })
    describe('Sub 1', () => {

        it('hoho pass 01', async (ctx) => {
            deepStrictEqual({ d: 1 }, { d: 1 });
        });

        it('hoho pass 02', async (ctx) => {
            deepStrictEqual({ d: 1 }, { d: 1 });
        });

    });
});
