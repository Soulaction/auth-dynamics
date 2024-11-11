import {NextFunction, Request, Response} from 'express';
import {UserEntity} from "../models/UserEntity";
import {ConflictError} from "../errors/ConflictError";
import authService from "../services/AuthService";
import ms from "ms";

class AuthController {
    async user(req: Request, res: Response) {
        res.status(200).json(req['user']);
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        const {login, email, password} = req.body;
        try {
            const user = await UserEntity.findOne({
                where: {login}
            });
            if (user) {
                throw new ConflictError('Пользователь с таким логином уже существует');
            }
            res.status(201).json(await authService.registration(login, email, password));
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const ip: string = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim();
        const {login, password, ua} = req.body;
        try {
            const {accessToken, refreshToken} = await authService.login(login, password, ip, ua);
            res.cookie('refreshToken', refreshToken, {maxAge: ms(process.env.REFRESH_EXPIRES!), httpOnly: true});
            res.status(200).json({accessToken});
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        const {refreshToken} = req.cookies;
        try {
            const {accessToken, refreshToken: newRefreshToken} = await authService.refresh(refreshToken);
            res.cookie('refreshToken', newRefreshToken, {maxAge: ms(process.env.REFRESH_EXPIRES!), httpOnly: true});
            res.status(200).json({accessToken});
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.status(204).json();
        } catch (error) {
            next(error);
        }
    }

}

export default new AuthController();
