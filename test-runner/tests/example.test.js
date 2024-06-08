import { setTimeout } from 'node:timers/promises';
import { deepStrictEqual } from 'node:assert';
import { describe, it, before, beforeEach, afterEach, after } from './../module/index.js'
// import { describe, it, before, beforeEach } from './../module/index.js'

// const { describe, it, before, beforeEach } = global; // was injected after importing there
// runner.on('testStart', (data) => {
//     // console.log(`\n🚀 Test ${data.name} started.`);
// });

// runner.on('testEnd', ({ elapsedTimeMs, name }) => {
//     console.log(`\n✅ Hook [${name}] ended. Elapsed time: ${elapsedTimeMs}ms\n`);
// });

describe('My suite 0', () => {
    beforeEach(async (ctx) => {
        ctx.diagnostic.log('beforeEach!');
        deepStrictEqual('ok')
    })

    before(async (ctx) => {
        ctx.diagnostic.log('before!');
    })

    after(async (ctx) => {
        ctx.diagnostic.log('before!');
    })

    afterEach(async (ctx) => {
        deepStrictEqual('ok')
        ctx.diagnostic.log('beforeEach!');
    })

    it('test pass 00', async (ctx) => {
        ctx.diagnostic.log('hey logger!');
        deepStrictEqual({ d: 1 }, { d: 1 });
    });
    // todo: t.logger.count
    describe('My sub-suite 0', () => {
        it('test pass 00', async (ctx) => {
            ctx.diagnostic.log('hey logger!');
            deepStrictEqual({ d: 1 }, { d: 1 });
        });
    })
    describe('My sub-suite 1', () => {
        before(async (ctx) => {
            // await setTimeout(100);
            ctx.diagnostic.log('[before] Hook on [My suite 1]');
            deepStrictEqual({ d: 1 }, { d: 1 });
        });

        it('test pass 01', async (ctx) => {
            deepStrictEqual({ d: 1 }, { d: 1 });
        });

        it('test pass 02', async (ctx) => {
            ctx.diagnostic.log('test pass 02!');
            deepStrictEqual({ d: 1 }, { d: 1 });
        });

        it('test fails', async (ctx) => {
            ctx.diagnostic.log('test fails!');
            deepStrictEqual({ name: 'bob' }, { name: 'sara' });
        });
        it('test fails 02', async (ctx) => {
            ctx.diagnostic.log('test fails!');
            deepStrictEqual({ total: 20 }, { total: 100 });
        });
    });
});
