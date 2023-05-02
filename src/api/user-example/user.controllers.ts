import express from 'express';
import userService from './services';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await userService.fetchAllUsers();
        return res.status(200).json({ users });

    } catch (error) {
        return res.status(500).json({ error: error });
    }
}