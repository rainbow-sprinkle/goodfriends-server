import express, { Request, Response } from 'express';
import * as nodemailer from "../utils/nodemailer"
import * as utils from "../utils/common.utils"
import * as response from "../config/response"
import * as models from "../models/account.models"
import * as dataAccess from "../utils/dataAccess.utils"
import jwt, {JwtPayload} from "jsonwebtoken"


// common
export const sendEmail = async (req:Request, res: Response) => {
    const {email} = req.body
    const authCode:string = utils.generateRandomCode(5)    
    try {
        await models.authCodeInsert(dataAccess, authCode)
        await nodemailer.sendEmail(email, `Please enter your verification code. ${authCode}`)    
        res.status(200).json(response.emailSendSuccess)
    } catch (error) {
        res.status(400).json(response.emailFailedSend)
    }
}

// sign-up 
export const signUp = async (req: Request, res: Response) => {
    const {email, password, authCode} = req.body
    const affiliateCode: any|undefined = req.headers["gf-affiliate-code"];
    
    const nick:string = `user${utils.generateRandomNumber(10)}`
    await models.signUpInsert(dataAccess, affiliateCode, email, utils.hashWithSHA256(password), nick, "GF", )
    await models.authCodeUpdate(dataAccess, authCode)
    
    res.status(200).json(response.signUpSuccess)
}

export const socialSignUp = async (req: Request, res: Response) => {
    const {email, password, loginType} = req.body
    const affiliateCode: any|undefined = req.headers["gf-affiliate-code"];
    
    const nick:string = `user${utils.generateRandomNumber(10)}`
    await models.signUpInsert(dataAccess, email, utils.hashWithSHA256(password), nick, loginType, affiliateCode)

    res.status(200).json(response.signUpSuccess)
}

// sign-in
export const signIn = async ( req: Request, res: Response ) => {
    const {email, password} = req.body

    const data = await models.userCheck(dataAccess, email, utils.hashWithSHA256(password))
    if(data) {
        const accessToken = jwt.sign(data, String(process.env.ACCESS_SECRET), {expiresIn: "1m", issuer: data.email})
        const refreshToken = jwt.sign(data, String(process.env.REFRESH_SECRET), {expiresIn: "1h", issuer: data.email})

        res.cookie('accessToken', accessToken, {
            secure: process.env.NODE_ENV === "production" ? true : false,
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax'
        })
        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV === "production" ? true : false,
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax'
        })

        await models.loginDateUpdate(dataAccess, email);
        res.status(200).json(response.signInSuccess)
    } else {
        res.status(400).json(response.memberValidationError)
    }
}

export const refresh = async (req: Request, res: Response ) => {
    try {
        const token: any = req.cookies.refreshToken;
        const data = jwt.verify(token, String(process.env.REFRESH_SECRET)) as JwtPayload;             
        
        const userData: any = await models.userCheck(dataAccess, data.email, data.password)
        const accessToken = jwt.sign(userData, String(process.env.ACCESS_SECRET), {expiresIn: "1m", issuer: data.email})
        const refreshToken = jwt.sign(userData, String(process.env.REFRESH_SECRET), {expiresIn: "1h", issuer: data.email})
            
        res.cookie('accessToken', accessToken, {
            secure: process.env.NODE_ENV === "production" ? true : false,
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax'
        })
        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV === "production" ? true : false,
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax'
        })
        res.status(200).json(response.tokenRecreate)
        
    } catch (error) {
        res.status(400).json(response.tokenVerificationFailed)
    }
}

export const signInSuccess = async ( req: Request, res: Response ) => {
    try {
        const token: any = req.cookies.accessToken
        const data = jwt.verify(token, String(process.env.ACCESS_SECRET)) as JwtPayload
        const userData: any = await models.userCheck(dataAccess, data.email, data.password)
        const {password, is_delete, reg_date, login_date, ...others} = userData
        res.status(200).json(others)
        
    } catch (error) {
        res.status(400).json(response.tokenVerificationFailed)
    }
}

// sign-out
export const signOut = ( req: Request, res: Response) => {
    try {
        res.cookie("accessToken", "");
        res.cookie("refreshToken", "");
        res.status(200).json(response.signOutSuccess)
    } catch (error) {
        res.status(400).json(error)
    }
}

// sign-up 
export const changePassword = async (req: Request, res: Response) => {
    const {email, password, authCode} = req.body
    
    await models.changePassword(dataAccess, email, utils.hashWithSHA256(password))
    await models.authCodeUpdate(dataAccess, authCode)

    res.status(200).json(response.passwordChangeSuccess)
}

// profile
export const changeProfileImage = async (req: Request, res: Response) => {
    const {memberIdx, profileImage} = req.body
    await models.updateProfileImage(dataAccess, memberIdx, profileImage);

    res.status(200).json(response.profileImageChangeSuccess)
}

export const changeNick = async (req: Request, res: Response) => {
    const {memberIdx, nick} = req.body
    await models.updateNick(dataAccess, memberIdx, nick)

    res.status(200).json(response.nickChangeSuccess)
}

export const profileHideSetting = async (req: Request, res: Response) => {
    const {memberIdx, nick} = req.body
    await models.profileHideSetting(dataAccess, memberIdx, nick)

    res.status(200).json(response.nickChangeSuccess)
}
