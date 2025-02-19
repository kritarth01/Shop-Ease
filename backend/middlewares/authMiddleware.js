import jwt from "jsonwebtoken"
import { User } from "../models/userModels.js";


export const requireSignIn = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    // console.log("Token------",token)
    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error("Invalid or expired token", error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};


export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if (user.role !== 1) {
            return res.send({
                success: false,
                msg: "Unauthorised Access"
            })
        }
        else {
            next();
        }
    } catch (error) {
        res.send({
            success: false,
            msg: "Error in admin middleware"
        })
    }
}