const { MongoClient, ObjectID } = require('mongodb');
const Grid = require('gridfs-stream');
const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = hydra.getServerResponseHelper();
let serverResponse = new ServerResponse();

let api = express.Router();

(async () => {
    const mongo = await MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/nodetube');
    const db = mongo.db('nodetube');

    const gfs = Grid(db, (require('mongodb')));

    api.get('/', (req, res) => {
        serverResponse.sendOk(res, {
            result: {
                msg: `hello from ${hydra.getServiceName()} - ${hydra.getInstanceID()}`
            }
        });
    });

    api.get('/doStream', async (req, res) => {
        const { id } = req.query;

        const videoMeta = await db.collection('videos.files').find({ _id: new ObjectID(id) }, { 'contentType': 1 }).next();

        if (!videoMeta) return res.status(404).end();

        res.set('content-type', videoMeta.contentType);

        gfs.createReadStream({
            filename: `video_${id}`,
            root: 'videos'
        })
        .pipe(res);
    });
})();

module.exports = api;