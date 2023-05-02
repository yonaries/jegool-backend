import IUser from "../user.model"

const fetchUserDonations = async () => { } // from database
const fetchUserSubscriptions = async () => { }  // from database
const fetchAllUsers = async (): Promise<IUser[]> => {
    return [
        {
            id: 1,
            name: "string",
            email: "string",
            password: "string",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        } as unknown as IUser,
    ]
}  // from database

export {
    fetchUserDonations,
    fetchUserSubscriptions,
    fetchAllUsers
}