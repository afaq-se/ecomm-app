import asyncHandler from "express-async-handler"
import User from "../models/userModel.js";

const registerUser = asyncHandler(async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
        res.status(400);
        throw new Error("User already exists, Try Login");
    };

    const user = await User.create({
        ...req.body, addresses: []
    });

    if (user) {
        res.status(201).json(user);
    };
});

export {
    registerUser
};