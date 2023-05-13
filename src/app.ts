import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRouter from "./api/user/user.routes";
import pageRouter from "./api/page/page.routes";
import membershipRouter from "./api/membership/membership.routes";
import postRouter from "./api/post/post.routes";
import transactionRouter from "./api/transaction/transaction.routes";
import projectRouter from "./api/project/project.routes";
import subscriptionRouter from "./api/subscription/subscription.routes";
import benefitRouter from "./api/benefit/benefit.routes";
import chapaRouter from "./api/chapa/chapa.routes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("combined"));

app.use("/user", userRouter);
app.use("/page", pageRouter);
app.use("/membership", membershipRouter);
app.use("/post", postRouter);
app.use("/transaction", transactionRouter);
app.use("/project", projectRouter);
app.use("/subscription", subscriptionRouter);
app.use("/benefit", benefitRouter);
app.use("/chapa", chapaRouter);

app.get("/", (_req, res) => {
 res.status(200).send("Hello World!");
});

export default app;
