import dot from "dotenv";
import admin from "firebase-admin";
import { ActionCodeSettings } from "firebase-admin/lib/auth/action-code-settings-builder";
import { Resend } from "resend";

dot.config();

export default async function sendVerifyEmail(email: string, name: string) {
 try {
  const actionCodeSettings: ActionCodeSettings = {
   url: "https://jegool.vercel.app",
   handleCodeInApp: true,
  };
  const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
   from: "noreply@jegool.firebaseapp.com",
   to: email,
   subject: "Verify Your Email Address",
   html: `<p>Hello ${name}, <strong>Welcome to Jegool!</strong> <br/> Follow this link to verify your email address please. ${link} <br/> if you didn’t ask to verify this address, you can ignore this email.<br/> <br/> Thanks Your %APP_NAME% team</p>`,
  });
 } catch (error) {
  console.log(error);
 }
}
