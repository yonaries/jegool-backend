import { CommunityChat } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const communityChatSchema = Joi.object({
 pageId: Joi.string().required(),
});

export const validateCommunityChat = (communityChat: CommunityChat): { error: ValidationError; value: CommunityChat } => {
 return communityChatSchema.validate(communityChat, options) as unknown as {
  error: ValidationError;
  value: CommunityChat;
 };
};
