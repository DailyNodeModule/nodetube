const { MongoClient, ObjectID } = require('mongodb');
const multer = require('multer');
const GridFSStorage = require('multer-gridfs-storage');
const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = hydra.getServerResponseHelper();
let serverResponse = new ServerResponse();

let api = express.Router();

(async () => {
    const mongo = await MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/nodetube');
    const db = mongo.db('nodetube');

    const storage = new GridFSStorage({ 
        db,
        file: (req, file) => {
            if (file.mimetype.indexOf('video/') !== -1) {
                const id = new ObjectID();
                const uploadDate = new Date();
                const title = req.body.title;

                const result = {
                    id,
                    uploadDate,
                    title
                }

                req.result = result;

                return {
                    id,
                    uploadDate,
                    filename: `video_${id}`,
                    metadata: {
                        title
                    },
                    bucketName: 'videos'
                };
            } else {
                return null;
            }
        } 
    });

    const upload = multer({ storage });

    api.get('/', (req, res) => {
        serverResponse.sendOk(res, {
            result: {
                msg: `hello from ${hydra.getServiceName()} - ${hydra.getInstanceID()}`
            }
        });
    });

    api.post('/doUpload', upload.single('video'), async (req, res) => {
        res.set('content-type', 'application/json');

        res.send(req.result);
    });
})();

module.exports = api;