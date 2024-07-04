import { Request, Response, NextFunction } from 'express';
import { gameLaunch, getMyInfo } from '../services/casino.services';
import { CasinoList, MyInfo, Launch, Info, BetHistoryResult, TotalNumber } from '../types/casino.types';
import { Member } from "../types/table.types";
import * as dataAccess from '../utils/dataAccess.utils'
import * as response from "../config/response"
import * as models from "../models/casino.models"
import * as setting from '../config/setting.config';

// /balance (callback)
export const responseBalance = async (req: Request, res: Response) => {
    const {username} = req.query;

    const myInfo: MyInfo = await getMyInfo()
    const member: Member = await dataAccess.findOne(
        "gf_member", 
        "*",  
        {column: "nick", condition: "=", data: username })
    
    if(myInfo?.balance >= member?.game_money) {

        res.status(200).json({balance: member.game_money})
    } else {
        // Write notification code.
        res.status(400).json(response.insufficientBalanceFailed)
    }
}

// /changeBalance (callback) -> This endpoint is a CamelCase because that's what they're requesting. We use kebabcase with a hyphen (-).
export const changeBalance = async (req: Request, res: Response) => {
    const { username, amount, transaction } = req.body
    const member: Member = await dataAccess.findOne(
        "gf_member",
        "*",
        { column: "nick", condition: "=", data: username })

    await models.casinoHistoryInsert(dataAccess, member.affiliate_code, member.member_idx, member.nick, transaction.id, transaction.type, transaction.referer_id, amount, transaction.details.game.id, transaction.details.game.title, transaction.details.game.round, transaction.details.game.type, transaction.details.game.vendor)
        .catch(res => console.log(res))

    await models.memberGameMoneyChange(dataAccess, member.member_idx, amount)
        .catch(res => console.log(res))
        
    res.status(200).json({status: "ok"})
}

// /list
export const getList = async (req: Request, res: Response) => {
    const { search } = req.body
    const list: CasinoList[] = await models.getList(dataAccess, search)
    const totalNumber: TotalNumber = await models.getListTotalCount(dataAccess, search)
    
    res.status(200).json({
        list: list,
        totalNumber: totalNumber.count,
        limit: setting.GAME_LIST_LIMIT
    })
}

// /filter menu
export const getFilterMenu = async(req: Request, res: Response) => {
    const   vendor = await models.getVendor(dataAccess);
    const type = await models.getType(dataAccess);

    res.status(200).json({
        "vendor": vendor,
        "type": type
    })
}

// /launch
export const launch = async (req: Request, res: Response) => {
    const { idx, nick } = req.body
    const launch: Launch = await gameLaunch(dataAccess, idx, nick)

    res.status(200).json({
        "link": launch.link
    })
}

// /info
export const info = async(req:Request, res: Response) => {
    const {idx} = req.body
    
    const info: Info = await models.getInfo(dataAccess, idx);
    
    res.status(200).json({
        title: info.title, 
        thumbnail: info.thumbnail, 
        vendor: info.vendor, 
        type: info.type 
    })
}

// bet-result
export const betHistoryResult = async (req: Request, res: Response) => {
    // const affiliateCode: any|undefined = req.headers["gf-affiliate-code"]
    const betHistory: string[] = await models.getBetHistory(dataAccess)
    const betHistoryResult: BetHistoryResult[] = await models.betHistoryResult(dataAccess, betHistory)

    res.status(200).json({
        "betHistoryResult": betHistoryResult
    })
}