# node-red-context-configservice
Spring Cloud Config provides server-side and client-side support for externalized configuration in a distributed system. With the Config Server, you have a central place to manage external properties for applications across all environments.

Node-RED provides a way to store information that can be shared between different nodes without using the messages that pass through a flow. This is called ‘context’.

The ‘scope’ of a particular context value determines who it is shared with. There are three context scope levels:
* Node - only visible to the node that set the value
* Flow - visible to all nodes on the same flow (or tab in the editor)
* Global - visible to all nodes

We are looking for use both features, to retrieve and storage  externalized configuration in our Node-RED global context.

## Context Store with ConfigService
Node-RED provides two built-in modules for this:
* memory
* localfilesystem

We build a custom one on base of they *memory* one.

To enable it, the following option in **your settings.js** can be used:
```
contextStorage: {
    default: {
        module: config => (require("@doing-things-with-node-red/node-red-context-configservice")(
            "http://configservice:80/properties.json",
            {
                strictSSL: true,
                interval: 3600000,
                retries: 3
            }
        ))
    }
},
```