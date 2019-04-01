const { MongoClient, ObjectID } = require('mongodb');
const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = hydra.getServerResponseHelper();
let serverResponse = new ServerResponse();

let api = express.Router();

(async () => {
    const mongo = await MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/nodetube');
    const db = mongo.db('nodetube');

    await db.collection('videos.files').createIndex({ 'metadata.title': 'text' });
    await db.collection('videos.files').createIndex({ 'uploadDate': -1 });

    api.get('/', (req, res) => {
        serverResponse.sendOk(res, {
            result: {
                msg: `hello from ${hydra.getServiceName()} - ${hydra.getInstanceID()}`
            }
        });
    });

    api.get('/search', async (req, res) => {
        const { limit, skip, query } = req.query;

        const q = {};
    
        if (query)
            q.$text = { $search: query };

        const resultDocs = await db.collection('videos.files')
            .find(q, { 'metadata.title': 1, _id: 1, uploadDate: 1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .toArray();

        const results = resultDocs.map((doc) => {
            return {
                title: doc.metadata.title,
                id: doc._id,
                uploadDate: doc.uploadDate
            }; 
        });

        serverResponse.sendOk(res, {
            results
        });
    });

    api.get('/video', async (req, res) => {
        const { id } = req.query;

        const doc = await db.collection('videos.files')
            .find({ _id: new ObjectID(id) }, { 'metadata.title': 1, _id: 1, uploadDate: 1 })
            .next();

        if (!doc) {
            return serverResponse.sendNotFound(res);
        }

        const result = {
            title: doc.metadata.title,
            id: doc._id,
            uploadDate: doc.uploadDate    
        };

        serverResponse.sendOk(res, { result })
    });
})();

module.exports = api;