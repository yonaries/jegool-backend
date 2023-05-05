import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Response } from "express";

export const handlePrismaError = (
  res: Response,
  error: any,
  objectName: string
) => {
  const e = error as PrismaClientKnownRequestError;

  if (!e.code)
    return res.status(500).json({ message: "Internal Server Error" });

  switch (e.code) {
    case "P2002":
      res.status(409).json({ message: `${objectName} Already Exists` });
      break;
    case "P2025":
      res.status(404).json({ message: `${objectName} Not Found` });
      break;
    default:
      res.status(500).json({ message: "Internal Server Error" });
  }
};
