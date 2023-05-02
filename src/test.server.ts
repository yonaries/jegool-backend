import express from "express"

const runTestServer = (port: number, callback: Function) => {
    const app = express()
    return app.listen(port, callback(app))
}

export default runTestServer