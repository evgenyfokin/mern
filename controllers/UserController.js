import {validationResult} from "express-validator";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const doc = UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: await bcrypt.hash(req.body.password, 10),
        })

        const user = await doc.save()

        const token = jwt.sign({
                _id: user._id
            }, 'secret123',
            {
                expiresIn: '30d'
            })
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Failed to register :("
        })
    }

}
export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({
                message: 'User is not found (L)'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'User is not found (P)'
            })
        }

        const token = jwt.sign(
            {_id: user._id,}, 'secret123', {expiresIn: '30d'}
        )

        const {passwordHash, ...userdata} = user._doc

        res.json({
            ...userdata,
            token
        })

    } catch (e) {
        console.log(e)
        res.status(404).json({
            message: 'Failed to login :('
        })
    }
}
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found "
            })
        }
        const {passwordHash, ...userData} = user._doc
        res.json({
            userData
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Access denied"
        })
    }
}