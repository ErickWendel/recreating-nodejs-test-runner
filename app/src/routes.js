
import { once } from 'events';
import { ObjectId } from 'mongodb';
import { reply, logger } from './util.js';

const setupRoutes = ({ customers }) => {
    return {
        'GET /customers': async (req, res) => {

            const { query } = req;

            const data = await customers
                .find(query)
                .sort({ name: 1 })
                .toArray();

            return reply(res, { data });
        },
        'POST /customers': async (req, res) => {
            const data = JSON.parse(await once(req, 'data'));
            const { insertedId } = await customers.insertOne(data);
            logger.info(`${data.name} inserted at ${new Date().toISOString()}`)

            return reply(res, { code: 201, data: { message: `customer ${data.name} created!`, _id: insertedId } });
        },
        'PATCH /customers/:id': async (req, res) => {
            const updateData = JSON.parse(await once(req, 'data'));
            const result = await customers.updateOne(
                { _id: ObjectId.createFromHexString(req.id) },
                { $set: updateData });
            if (!result.modifiedCount) {
                return reply(res, { code: 404, data: { error: 'Customer not Found' } });
            }
            return reply(res, { code: 200, data: { message: `customer ${req.id} updated!` } });
        },
        'DELETE /customers/:id': async (req, res) => {
            const result = await customers.deleteOne({ _id: ObjectId.createFromHexString(req.id) });
            if (!result.deletedCount) {
                return reply(res, { code: 404, data: { error: 'Customer not Found' } });
            }
            return reply(res, { code: 200, data: { message: `customer ${req.id} deleted!` } });
        },
    };
};


export {
    setupRoutes
}