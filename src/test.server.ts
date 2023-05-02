import express from "express"

const runTestServer = (port: number, callback: Function) => {
    const app = express()
    app.listen(port, callback(app)).close()
}

export default runTestServer