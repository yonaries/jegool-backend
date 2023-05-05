import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRouter from "@User/user.routes";
import pageRouter from "@Page/page.routes";
import membershipRouter from "@Membership/membership.routes";
import postRouter from '@Post/post.routes'

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("combined"));

app.use("/user", userRouter);
app.use("/page", pageRouter);
app.use("/membership", membershipRouter);
app.use("/post", postRouter);

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});


export default app;