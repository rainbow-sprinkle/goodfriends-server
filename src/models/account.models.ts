import * as types from "../types/check.types"
import * as setting from "../config/setting.config"

export const authCodeInsert = async (dataAccess: any, authCode: string): Promise<any> => {
    const sql: string = `
        INSERT INTO gf_auth_code
            SET auth_code = ?,
                reg_date = NOW()`
    const values: string[] = [authCode]

    return dataAccess.insert(sql, values)
}

export const signUpInsert = async (dataAccess:any, affiliateCode:string, email:string, password:string, nick:string, loginType:string): Promise<any> => {
    let sql:string = `
        INSERT INTO gf_member
            SET email = ?,
                password = ?,
                nick = ?,
                profile_image = ?,
                login_date = NOW(),
                reg_date = NOW(),
                login_type = ?,
                affiliate_code = ?`
    let values:string[] = [affiliateCode, email, password, nick, setting.INITIAL_PROFILE_IMAGE, loginType, ]    
    return dataAccess.insert(sql, values)
}

export const authCodeUpdate = async (dataAccess: any, authCode: string): Promise<any> => {
    const sql: string = `
        UPDATE gf_auth_code SET
            is_used = 1
            WHERE auth_code = ?`
    const values: string[] = [authCode]

    return dataAccess.update(sql, values)
}

// sign-in
export const userCheck = async (dataAccess: any, email: string, password: string): Promise<any> => {
    const sql:string = `
        SELECT * FROM gf_member gm 
            WHERE gm.email = ?
            AND gm.password = ?`
    const values:string[] = [email, password]

    const data:types.memberResult = await dataAccess.selectOne(sql, values)
    if(data) {
        return data
    } else {
        return false
    }
}

// sign-in
export const loginDateUpdate = async (dataAccess: any, email: string) => {
    const sql:string = `
        UPDATE gf_member
            SET login_date = NOW()
            WHERE email = ?`
    const values:string[] = [email]

    return dataAccess.update(sql, values)
}

// forgot-passowrd
export const changePassword = async(dataAccess: any, email: string, password: string): Promise<any> => {
    const sql: string = `
        UPDATE gf_member SET
            password = ?
            WHERE email = ?`
    const values:string[] = [password, email]

    return dataAccess.update(sql, values)
}

// profile
export const updateProfileImage = async (dataAccess:any, memberIdx: number, profileImage: string) => {
    const sql: string = `
        UPDATE gf_member SET
            profile_image = ?
            WHERE member_idx = ?`
    const values: (string|number)[] = [profileImage, memberIdx]

    return dataAccess.update(sql, values)
}

export const updateNick = async (dataAccess:any, memberIdx: number, nick: string) => {
    const sql: string = `
        UPDATE gf_member SET
            nick = ?
            WHERE member_idx = ?`
    const values: (string|number)[] = [nick, memberIdx]

    return dataAccess.update(sql, values)
}

export const profileHideSetting = async (dataAccess:any, isProfileHide: number, memberIdx: number) => {
    const sql: string = `
        UPDATE gf_member SET
            is_profile_hide = ?
            WHERE member_idx = ?`
    const values: number[] = [isProfileHide, memberIdx ]

    return dataAccess.update(sql, values)
}