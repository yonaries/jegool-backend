import { PrivateChat } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const privateChatSchema = Joi.object({
 user1Id: Joi.string().required(),
 user2Id: Joi.string().required(),
});

export const validatePrivateChat = (privateChat: PrivateChat): { error: ValidationError; value: PrivateChat } => {
 return privateChatSchema.validate(privateChat, options) as unknown as {
  error: ValidationError;
  value: PrivateChat;
 };
};
