import { MongoClient } from 'mongodb';
import config from './config.js';
import { logger } from './util.js';

async function connect() {
    const dbClient = new MongoClient(config.dbURL);
    await dbClient.connect();

    const db = dbClient.db(config.dbName);
    const customers = db.collection(config.customerCol);

    logger.info('Connected to the database');

    return {
        collections: {
            [config.customerCol]: customers,
        },
        dbClient
    };
}

async function getDb() {
    // Initial connection attempt
    const { collections, dbClient } = await connect();

    return { collections, dbClient };
}

export {
    getDb
}
