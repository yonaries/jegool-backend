import express from "express";
import { getPort } from "./port";

const app = express();
const port = getPort();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (_req, res) => {
    res.status(200).send("Hello World!");
})