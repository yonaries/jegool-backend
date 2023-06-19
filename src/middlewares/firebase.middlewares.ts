// import admin, { app, appCheck, auth } from "@/config/firebase";
import admin from "firebase-admin";

import { Request, Response, NextFunction } from "express";
const serviceAccountKey = require("../config/firebase.json") as admin.ServiceAccount;

admin.initializeApp({
 credential: admin.credential.cert(serviceAccountKey),
});

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
 const token = req.headers.authorization?.split(" ")[1];
 if (!token) return res.status(401).send({ error: { message: "Unauthorized request" } });

 try {
  const decodedToken = await admin.auth().verifyIdToken(token);
  const uid = decodedToken.uid;

  const user = await admin.auth().getUser(uid);
  if (!user) throw new Error("Firebase: Unauthorize");

  req.body.user = user;

  next();
 } catch (error) {
  console.log(error);
  return res.status(401).send({ error: { message: `Firebase: ${error}` } });
 }
}
