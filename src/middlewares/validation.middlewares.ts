import { Request, Response, NextFunction } from 'express';
import * as response from "../config/response"
import * as dataAccess from "../utils/dataAccess.utils"

export const checkHeaders = async (req: Request, res: Response, next:NextFunction) : Promise<any> => {
    const apiKey: any|undefined = req.headers["gf-api-key"];
    const affiliateCode: any|undefined = req.headers["gf-affiliate-code"];

    const check = await dataAccess.findOne(
        "gf_affiliate", 
        "api_key, affiliate_code", 
        {column: "api_key", condition: "=", data: apiKey},
        {column: "affiliate_code", condition: "=", data: affiliateCode})
        
    if(check) {
        next()    
    } else {
        res.status(400).json(response.headersValidationError)
    }
}