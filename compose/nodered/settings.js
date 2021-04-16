const configServiceStorage = require("@doing-things-with-node-red/node-red-context-configservice")

module.exports = {
    uiPort: 8000,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 1000,
    debugUseColors: true,
    flowFilePretty: true,
    userDir: '/home/nodejs/nodered',
    httpAdminRoot: '/',
    httpNodeRoot: '/',
    functionGlobalContext: {
        config: {}
    },
    functionExternalModules: false,
    exportGlobalContextKeys: false,
    contextStorage: {
        default: {
            module: config => (configServiceStorage(
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
    },
    editorTheme: {
        projects: {
            enabled: false,
        }
    }
}