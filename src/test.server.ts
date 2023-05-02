import express from "express"

const runTestServer = (port: number, callback: Function) => {
    const app = express()
<<<<<<< HEAD
    return app.listen(port, callback(app))
=======
    app.listen(port, callback(app)).close()
>>>>>>> origin/main
}

export default runTestServer