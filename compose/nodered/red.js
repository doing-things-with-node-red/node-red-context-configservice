const http = require('http')
const express = require("express")
const RED = require("node-red")

const settings = require("./settings")

async function startServer() {
    // Create an Express app
    const app = express()
    // Add a simple route for static content served from 'public'
    app.use("/", express.static("public"))
    // Create a server
    const server = http.createServer(app)
    // Initialise the runtime with a server and settings
    RED.init(server, settings)
    // Serve the editor UI from /red
    app.use(settings.httpAdminRoot, RED.httpAdmin)
    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot, RED.httpNode)
    // Set server port
    server.listen(8000)
    // Start the runtime
    RED.start()
}

startServer()