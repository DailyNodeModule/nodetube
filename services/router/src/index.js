
const url = require('url');
const path = require('path');
const hydra = require('hydra');
const express = require('express');
const cors = require('cors');
const request = require('request');

(async () => {
    const app = express();
    const port = Number(process.env.PORT) || 3000;
    
    await hydra.init({
        hydra: {
            serviceName: 'router',
            serviceDNS: process.env.SERVICE_DNS || '',
            serviceIP: '',
            serviceType: 'frontend',
            serviceDescription: 'Handles application routing',
            servicePort: port,
            redis: { 
                url: process.env.REDIS_URL || 'redis://localhost:6379/0' 
            }
        }
    });

    app.use(cors({ origin: true }));

    const webDirBase = process.env.WEB_BUILD_PATH || path.join( __dirname, '..', '..', '..', 'client', 'dist');

    app.get('/api/search', async (req, res) => {
        res.set('content-type', 'application/json');

        const { query, limit, skip } = req.query;

        const message = hydra.createUMFMessage({
            to: 'query:[get]/query/search/',
            from: 'router',
            body: { query, limit, skip }
        });
        
        const resp = await hydra.makeAPIRequest(message);
        res.send(resp.results);
    });

    app.get('/api/videos/:id', async (req, res) => {
        res.set('content-type', 'application/json');

        const message = hydra.createUMFMessage({
            to: `query:[get]/query/video?id=${req.params.id}`,
            from: 'router',
            body: { }
        });
        
        const resp = await hydra.makeAPIRequest(message);
        res.send(resp.result);
    });

    app.post('/api/upload', async (req, res) => {
        const srv = (await hydra.getServicePresence('upload'))[0];
        
        req.pipe(request({
            url: `http://${srv.ip}:${srv.port}/upload/doUpload`
        }))
        .pipe(res);
    });

    app.get('/api/thumbnail/:id', async (req, res) => {
        const srv = (await hydra.getServicePresence('thumbnail'))[0];
        
        request({
            url: `http://${srv.ip}:${srv.port}/thumbnails/renderThumbnail`,
            qs: {
                videoId: req.params.id
            }
        })
        .pipe(res);
    });

    app.get('/api/stream/:id', async (req, res) => {
        const srv = (await hydra.getServicePresence('stream'))[0];
        
        request({
            url: `http://${srv.ip}:${srv.port}/stream/doStream`,
            qs: {
                id: req.params.id
            }
        })
        .pipe(res);
    });

    app.use('/', express.static( path.join(webDirBase, 'nodetube') ));

    app.use((req, res, next) => {
        res.sendFile(path.join(webDirBase, 'nodetube', 'index.html'));
    });

    app.listen(port, (error) => {
        if (!error) console.log(`listening on port ${port}`);
        else console.error(`error listening on ${port}: ${error.toString()}`);
    });
})();
