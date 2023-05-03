import express from "express"
import morgan from "morgan"

const runTestServer = (port: number, callback: Function) => {
    const app = express()
    app.use(morgan('combined'))
    return app.listen(port, callback(app))
}

export default runTestServer
