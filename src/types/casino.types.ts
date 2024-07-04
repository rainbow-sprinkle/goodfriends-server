export interface MyInfo {
    id: number;
    type: string;
    username: string;
    nickname: string;
    callback_url: string;
    balance: number;
    created_at: string;
}

export interface CasinoList {
    idx: number,
    game_id: string,
    title: string,
    provider: string,
    thumnail: string,
    vendor: string,
    type: string,
    is_open: string,
    reg_date: string
}

export interface Launch {
    link: string,
    user: LaunchUser,
    userCreated: Boolean
}

export interface LaunchUser {
    balance: number,
    id: number,
    last_access_at: string,
    nickname: string,
    token: string,
    username: string
}

export interface Info {
    title: string, 
    thumbnail: string, 
    vendor: string, 
    type: string 
}

export interface GameInfo {
    game_id: string,
    vendor: string
}

export interface BetHistory {
    title: string,
    nick: string,
    amount: number,
    type: string,
}

export interface BetHistoryResult {
    title: string,
    nick: string,
    betAmount: number|undefined,
    profitAmount: number
}

export interface TotalNumber {
    count: number
}

export interface CasinoSearch {
    title: string,
    vendor: string[],
    type: string[],
    page: number
}