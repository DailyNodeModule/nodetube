const { MongoClient, ObjectID } = require('mongodb');
const { spawn } = require('child_process');
const Grid = require('gridfs-stream');
const hydraExpress = require('hydra-express');
const fs = require('fs');
const { file  } = require('tmp-promise');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = hydra.getServerResponseHelper();
let serverResponse = new ServerResponse();

let api = express.Router();

(async () => {
    const mongo = await MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/nodetube');
    const db = mongo.db('nodetube');
    const gfs = Grid(db, (require('mongodb')));

    await db.collection('thumbnails.files').createIndex({ 'metadata.videoId': 1 }, { unique: true });

    api.get('/', (req, res) => {
        serverResponse.sendOk(res, {
            result: {
                msg: `hello from ${hydra.getServiceName()} - ${hydra.getInstanceID()}`
            }
        });
    });

    api.get('/renderThumbnail', async (req, res) => {
        res.set('content-type', 'image/jpeg');

        if (!req.query.videoId) return res.status(404).end();

        const videoId = new ObjectID(req.query.videoId);

        const thumbnailExists = ((await db.collection('thumbnails.files')
            .find({ 'metadata.videoId': videoId })
            .count()) > 0);

        if (!thumbnailExists) {
            const videoStream = gfs.createReadStream({
                filename: `video_${videoId}`,
                root: 'videos'
            }); 

            const { fd, path, cleanup } = await file();
            const tmpStream = fs.createWriteStream(path);
            videoStream.once('end', () => {
                const ffmpeg = spawn((process.env.FFMPEG_PATH || 'ffmpeg'), ['-ss', '5', '-i', path, '-f', 'mjpeg', '-vframes', '1', 'pipe:1'], {
                    stdio: 'pipe'
                });

                const imgRaw = [];

                ffmpeg.stdout.on('data', (buf) => {
                    imgRaw.push(buf);
                });

                ffmpeg.stdout.once('end', () => {
                    const img = Buffer.concat(imgRaw);

                    const thumbnailStream = gfs.createWriteStream({
                        filename: `thumbnail_${videoId}`,
                        metadata: {
                            videoId
                        },
                        content_type: 'image/jpeg',
                        root: 'thumbnails'
                    });

                    thumbnailStream.end(img);
                    res.end(img);
                    cleanup();
                }); 
            });

            videoStream.pipe(tmpStream);
        } else {
            gfs.createReadStream({
                filename: `thumbnail_${videoId}`,
                root: 'thumbnails'
            }).pipe(res);
        }
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