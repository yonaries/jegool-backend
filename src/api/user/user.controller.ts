import UserService from "./services";
import { Request, Response } from "express";

export const createUserAccount = async (req: Request, res: Response) => {
    const user = req.body;

    try {
        console.log(user);
        if (user) {
            const createdUser = await UserService.createUserAccount(user);
            res.status(200).json(createdUser);
        }

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}