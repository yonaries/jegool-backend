import express from "express";
import cors from "cors";
import morgan from "morgan";

import { getPort } from "./port";
import userRouter from "./api/user/user.routes";
import pageRouter from "./api/page/page.routes";
import postRouter from "./api/post/post.routes";
import membershipRouter from "./api/membership/membership.routes";

const app = express();
const port = getPort();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("combined"));

app.use("/user", userRouter);
app.use('/page', pageRouter);
app.use('/post', postRouter);
app.use("/membership", membershipRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
