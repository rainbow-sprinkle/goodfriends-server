import axios from 'axios';
import { BetHistory, GameInfo, MyInfo } from '../types/casino.types';

export const getMyInfo = (): Promise<any> => {
    const endpoint: string = 'https://api.honorlink.org/api/my-info';
    const apiKey: string = process.env.HONORLINK_API_KEY!;
    
    const headers = {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios.get(endpoint, {headers})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {reject(error)})
    })
}

export const getGameList = (): Promise<any> => {
    const endpoint: string = 'https://api.honorlink.org/api/game-list';
    const apiKey: string = process.env.HONORLINK_API_KEY!;
    
    const headers = {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios.get(endpoint, {headers})
            .then(response => {resolve(response.data)})
            .catch(error => {reject(error)})
    })
}

export const gameLaunch = async (dataAccess: any, idx: number, nick: string): Promise<any> => {
    
    const sql: string = `SELECT game_id, vendor FROM gf_casino_list WHERE idx = ?`
    const values: number[] = [idx]
    const data: GameInfo = await dataAccess.selectOne(sql, values)

    const endpoint: string = `https://api.honorlink.org/api/game-launch-link?username=${nick}&nickname=devel&game_id=${data.game_id}&vendor=${data.vendor}`;
    const apiKey: string = process.env.HONORLINK_API_KEY!;

    const headers = {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios.get(endpoint, {headers})
            .then(response => {resolve(response.data)})
            .catch(error => {reject(error)})
    })
}