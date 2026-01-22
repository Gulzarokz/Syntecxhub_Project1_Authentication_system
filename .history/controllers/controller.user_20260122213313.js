import user from "../models/model.user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(403).josn({
                success: false,
                message: "All fields are required"
            })
        }
        const userExists = await user.findOne({ email })
        if (userExists) {
            return res.status(403).josn({
                success: false,
                message: "This email Id is already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.create({
            fullName,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "User signUp successfully"
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// user login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const userExist = await user.findOne({ email });
        if (!userExist) {
            return res.status(403).json({
                success: false,
                message: "User is not registered"
            })
        }

        const isMatchPassword = await bcrypt.compare(password, userExist.password);
        if (!isMatchPassword) {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = await jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            sameSite: "strick",
            maxAge: 24 * 60 * 60 * 1000
        }).json({
            success: true,
            message: "User login successfully"
        })
    } catch (error) {
        console.log(error);

    }
}