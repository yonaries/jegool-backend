import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Response } from "express";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export const PrismaError = (res: Response, error: any) => {
	console.log("Error::CODE", error.code);
	console.log("Error::", error);

	if (error instanceof PrismaClientKnownRequestError) {
		if (!error.code)
			return res.status(500).json({ error: { message: error.message } });

		switch (error.code) {
			case "P2002":
				return res.status(409).json({ error: { message: error.message } });

			case "P2025":
				return res.status(404).json({ error: { message: error.message } });

			default:
				res.status(500).json({ error: { message: "Internal Server Error" } });
		}
	} else {
		res.status(500).json({ error: { message: "Internal Server Error" } });
	}
};
