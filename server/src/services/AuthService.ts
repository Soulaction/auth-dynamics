import {UserEntity} from "../models/UserEntity";
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcryptjs';
import {BadRequestError} from "../errors/BadRequestError";
import tokenService from "./TokenService";
import {UnauthorizedError} from "../errors/UnauthorizedError";
import {UserDto} from "../dto/UserDto";
import mailService from "./MailService";

export class AuthService {
    async registration(login: string, email: string, password: string) {
        const encryptPsw: string = await bcrypt.hash(password, 9);

        const newUser: UserDto = (await UserEntity.create({id: uuid(), login, email, password: encryptPsw})).dataValues;
        await mailService.sendActivateLInk(email, process.env.SERVER_URL + '/mail/activate/' + newUser.id);
        return newUser;
    }

    async login(login: string, password: string, ip: string, ua: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await UserEntity.findOne({
            where: {login}
        });
        if (!user?.dataValues.isActivate) {
            throw new BadRequestError('Электронная пота не активирована');
        }
        const textError: string = 'Не верные учётные данные пользователя';
        if (!user) {
            throw new BadRequestError(textError);
        }
        if (bcrypt.compareSync(user.dataValues.password, password)) {
            throw new BadRequestError(textError);
        }
        const {accessToken, refreshToken} = await tokenService.generateTokens(user.dataValues);
        await tokenService.saveToken(user.dataValues.id, refreshToken, ip, ua);
        return {accessToken, refreshToken};
    }

    async refresh(userData: UserDto, token: string): Promise<{ accessToken: string, refreshToken: string }> {
        if (!token) {
            throw new UnauthorizedError('Пользователь не авторизован')
        }
        tokenService.verifyRefreshToken(token);
        await tokenService.removeToken(token);
        const {accessToken, refreshToken} = await tokenService.generateTokens(userData);

        return {accessToken, refreshToken};
    }

    async logout(refreshToken: string) {
        await tokenService.removeToken(refreshToken);
    }
}

export default new AuthService();
