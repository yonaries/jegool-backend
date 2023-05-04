import express from "express";
import { getPort } from "./port";
import userRouter from "./api/user/user.routes";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = getPort();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("combined"));

app.use("/user", userRouter);

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
