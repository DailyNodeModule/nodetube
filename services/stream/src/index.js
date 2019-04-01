const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();

(async () => {
    await hydraExpress.init({
        hydra: {
            serviceName: 'stream',
            serviceDNS: process.env.SERVICE_DNS || '',
            serviceIP: '',
            serviceType: 'backend',
            serviceDescription: 'Handles streaming video to the browser',
            servicePort: Number(process.env.PORT) || 0,
            redis: { 
                url: process.env.REDIS_URL || 'redis://localhost:6379/0' 
            }
        }
    }, () => {
        hydraExpress.registerRoutes({
            '/stream': require('./routes')
        });
    });
})();