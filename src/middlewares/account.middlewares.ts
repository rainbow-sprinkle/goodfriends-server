import { Request, Response, NextFunction } from 'express';
import * as response from '../config/response';
import * as dataAccess from "../utils/dataAccess.utils"
import * as setting from "../config/setting.config"

// sign-up
export const emailCheck = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body
    const check = await dataAccess.findOne(`gf_member`, `email`, {column: "email", condition: "=", data: email})

    if(!check) {
        next()
    } else {
        res.status(400).json(response.emailDuplicateError)
    }
}

export const authCodeCheck = async (req: Request, res: Response, next: NextFunction) => {
    const {authCode} = req.body
    const check = await dataAccess.findOne(
        "gf_auth_code", 
        "auth_code", 
        {column: "auth_code", condition: "=", data: authCode},
        {column: "reg_date", condition: ">=", data: `DATE_ADD(NOW(), INTERVAL -${setting.EMAIL_VERIFICATION_TIME} MINUTE) AND is_used = 0`})
    
    if(check) {
        next()
    } else {
        res.status(400).json(response.authCodeValidationError)
    }
}

export const promoCodeCheck = async (req: Request, res: Response, next: NextFunction) => {
    const {promoCode} = req.body
    const check = await dataAccess.findOne("gf_admin","promo_code", {column: "promo_code", condition: "=", data: promoCode})

    if(promoCode === undefined || promoCode === "" || promoCode === null || check) {
        next()
    } else {
        res.status(400).json(response.promoCodeValidationError)
    }
}