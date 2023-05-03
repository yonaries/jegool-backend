import express from "express";
import { getPort } from "./port";
import userRouter from "./api/user/user.routes";
import cors from "cors";

const app = express();
const port = getPort();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});

export default app;
