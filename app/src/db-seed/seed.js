import { MongoClient } from 'mongodb'

import { customers } from './customers.js';
import config from '../config.js';
import { isTestEnv, logger } from '../util.js';

async function runSeed() {

    const client = new MongoClient(config.dbURL);
    try {
        await client.connect();

        logger.info(`Db connected successfully to ${config.dbName}!`);
        // create index for id
        const db = client.db(config.dbName);

        const collection = db.collection(config.customerCol);

        await collection.deleteMany({})
        await Promise.all(customers.map(i => collection.insertOne({ ...i })))

        logger.info(await collection.find().toArray())

    } catch (err) {
        logger.info(err.stack);
    } finally {
        await client.close();
    }
}
// npm run seed!
if (!isTestEnv) runSeed();

export { runSeed }