const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();

(async () => {
    await hydraExpress.init({
        hydra: {
            serviceName: 'upload',
            serviceDNS: process.env.SERVICE_DNS || '',
            serviceIP: '',
            serviceType: 'backend',
            serviceDescription: 'Hydra Master Control Program',
            servicePort: Number(process.env.PORT) || 0,
            redis: { 
                url: process.env.REDIS_URL || 'redis://localhost:6379/0' 
            }
        }
    }, () => {
        hydraExpress.registerRoutes({
            '/upload': require('./routes')
        });
    });

    hydra.registerService();
})();