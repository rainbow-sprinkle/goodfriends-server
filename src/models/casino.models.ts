import * as setting from "../config/setting.config"
import { BetHistory, BetHistoryResult, CasinoSearch } from "../types/casino.types"

// change balance (callback)
export const casinoHistoryInsert = async (dataAccess: any, affiliateCode: string, memberIdx: number, nick: string, transactionId: number, transactionType: string, refererId: number, amount: number, gameId: string, gameTitle: string, round: string, gameType: string, gameVendor: string)  => {
    
    const sql: string = `
        INSERT INTO gf_casino_betting
            SET affiliate_code = ?,
                member_idx = ?,
                nick = ?,
                transaction_id = ?,
                type = ?,
                referer_id= ?,
                amount = ?,
                game_id = ?,
                title = ?,
                round = ?,
                game_type = ?,
                vendor = ?,
                reg_date = NOW()`
    const values: (string|number)[] = [affiliateCode, memberIdx, nick, transactionId, transactionType, refererId, amount, gameId, gameTitle, round, gameType, gameVendor]
    return dataAccess.insert(sql, values)
}

export const memberGameMoneyChange = async (dataAccess: any, memberIdx: number, amount: number) => {
    const sql: string = `
        UPDATE gf_member
            SET game_money = game_money + ?
            WHERE member_idx = ?`
    const values: number[] = [amount, memberIdx]
    return dataAccess.update(sql, values)
}

// list
export const getList = async (dataAccess: any, search: CasinoSearch) => {
    let sql: string = `SELECT * FROM gf_casino_list WHERE is_open = 1`

    if(search.title) {
        sql += ` AND REPLACE(LOWER(title), ' ', '') LIKE REPLACE(LOWER("%${search.title}%"), ' ', '')`
    }
    if(search.vendor.length !== 0) {
        search.vendor.forEach((v) => {
            sql += ` AND REPLACE(LOWER(vendor), ' ', '') LIKE REPLACE(LOWER("%${v}%"), ' ', '')`
        })
    }
    if(search.type.length !== 0) {
        search.type.forEach((v) => {
            sql += ` AND REPLACE(LOWER(type), ' ', '') LIKE REPLACE(LOWER("%${v}%"), ' ', '')`
        })      
    }    
 
    sql += ` LIMIT ${search.page*setting.GAME_LIST_LIMIT}, ${setting.GAME_LIST_LIMIT}`
    return dataAccess.selectAll(sql, [])
}

export const getListTotalCount = async (dataAccess:any, search: CasinoSearch) => {

    let sql: string = `SELECT count(*) as count FROM gf_casino_list WHERE is_open = 1`
    if(search.title) {
        sql += ` AND REPLACE(LOWER(title), ' ', '') LIKE REPLACE(LOWER("%${search.title}%"), ' ', '')`
    }
    if(search.vendor.length !== 0) {
        search.vendor.forEach((v) => {
            sql += ` AND REPLACE(LOWER(vendor), ' ', '') LIKE REPLACE(LOWER("%${v}%"), ' ', '')`
        })
    }
    if(search.type.length !== 0) {
        search.type.forEach((v) => {
            sql += ` AND REPLACE(LOWER(type), ' ', '') LIKE REPLACE(LOWER("%${v}%"), ' ', '')`
        })      
    }    

    return dataAccess.selectOne(sql, [])
}

// filter menu
export const getVendor = async (dataAccess: any) => {
    let sql: string = `SELECT gcl.vendor as name FROM gf_casino_list gcl WHERE is_open = 1 GROUP BY gcl.vendor`
    return dataAccess.selectAll(sql, [])
}

export const getType = async (dataAccess: any) => {
    let sql: string = `SELECT gcl.type as name FROM gf_casino_list gcl WHERE is_open = 1 GROUP BY gcl.type;`
    return dataAccess.selectAll(sql, [])
}

// info
export const getInfo = (dataAccess: any, idx: number) => {
    let sql: string = `SELECT title, thumbnail, vendor, type FROM gf_casino_list WHERE idx = ?`
    let values: number[] = [idx]

    return dataAccess.selectOne(sql, values)
}

// bet-result
export const getBetHistory = async(dataAccess: any): Promise<any> => {
    // let sql: string = `SELECT round FROM gf_casino_betting WHERE affiliate_code = ? AND type = ? ORDER BY reg_date DESC LIMIT 0, 20`
    let sql: string = `SELECT round FROM gf_casino_betting WHERE type = ? ORDER BY reg_date DESC LIMIT 0, 20` 
    let values: string[] = ["win"]

    return await dataAccess.selectAll(sql, values)
}

export const betHistoryResult = async(dataAccess: any, list: string[])=> {
    const array: BetHistoryResult[] = await Promise.all(
        list.map( async (v: any) => {
            const round: string = v.round;
            const bets: BetHistory[] = await dataAccess.findAll(
                "gf_casino_betting", 
                "title, nick, type, amount",
                {column: "round", condition: "=", data: round });
        
            let title: string = bets[0].title;
            let nick: string = bets[0].nick;
            let betAmount: number|undefined = bets.find(bet => bet.type === 'bet')?.amount;
            let profitAmount: number = bets.reduce((acc, bet) => acc + bet.amount, 0); 
        
            let betHistoryResult: BetHistoryResult = {
                "title": title,
                "nick": nick,
                "betAmount": betAmount,
                "profitAmount": profitAmount,
            }
        
            return betHistoryResult;
        }
    ));
    return array;
}