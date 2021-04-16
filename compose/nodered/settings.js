module.exports = {
    uiPort: 8000,
    userDir: '/home/nodejs/nodered',
    contextStorage: {
        default: {
            module: config => (require("@doing-things-with-node-red/node-red-context-configservice")(
                process.env.SPRING_CLOUD_CONFIG_URL,
                {
                    strictSSL: process.env.SPRING_CLOUD_SKIPSSLVALIDATION === 'true',
                    interval: process.env.SPRING_CLOUD_REFRESH_RATE,
                    retries: process.env.SPRING_CLOUD_RETRIES
                }
            ))
        }
    },
    logging: {
        console: {
            level: "debug",
            metrics: false,
            audit: false
        }
    }
}