import express from "express";

const app = express();

export const getPort = () => (process.env.PORT || 5000);

app.listen(getPort(), () => {
    console.log(`Server started at http://localhost:${getPort()}`);
});

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
})