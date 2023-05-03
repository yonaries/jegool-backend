import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const handlePrismaError = (error: any) => {
  const e = error as PrismaClientKnownRequestError;

  switch (e.code) {
    case "P2025":
      throw new Error("User Not Found");
    default:
      throw new Error("Internal Server Error");
  }
};
