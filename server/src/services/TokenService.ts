import jwt from 'jsonwebtoken';
import {UserDto} from "../dto/UserDto";
import {UnauthorizedError} from "../errors/UnauthorizedError";
import {TokenEntity} from "../models/TokenEntity";
import {v4 as uuid} from 'uuid';
import * as fs from "fs";
import path from "path";
import {UserTokenData} from "../dto/UserTokenData";

export class TokenService {

    async saveToken(userId: string, token: string, ip: string, ua: string) {
        const oldToken = await TokenEntity.findOne({where: {userId, token, ip, ua}});
        if (oldToken) {
            await this.removeToken(token);
        }
        await TokenEntity.create({
            id: uuid(),
            token,
            ip,
            ua,
            userId
        });
    }

    async removeToken(token: string) {
        await TokenEntity.destroy({where: {token}});
    }

    async generateTokens(userData: UserTokenData): Promise<{ accessToken: string, refreshToken: string }> {
        const privateKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'privateAccess.pem'), 'utf8');
        const accessToken: string = 'Bearer ' + jwt.sign({id: userData.id, login: userData.login, role: userData.role}
            , privateKey
            , {algorithm: 'RS256', expiresIn: '1m'});

        const refreshToken: string = 'Bearer ' + jwt.sign({name: 'test'}
            , process.env.REFRESH_TOKEN_SECRET!
            , {expiresIn: '10m'}
        );
        return {accessToken, refreshToken};
    }

    verifyAccessToken(accessToken: string): UserTokenData {
        try {
            const publicKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'publicAccess.pem'), 'utf8');
            return <UserTokenData>jwt.verify(accessToken, publicKey);
        } catch (error) {
            throw new UnauthorizedError('Пользователь не авторизован');
        }
    }

    verifyRefreshToken(refreshToken: string): UserTokenData {
        try {
           return <UserTokenData>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        } catch (error) {
            throw new UnauthorizedError('Пользователь не авторизован');
        }
    }
}

export default new TokenService();
