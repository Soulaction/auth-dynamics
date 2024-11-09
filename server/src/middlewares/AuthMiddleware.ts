import {NextFunction, Request, Response} from "express";
import {UnauthorizedError} from "../errors/UnauthorizedError";
import tokenService from "../services/TokenService";
import {UserDto} from "../dto/UserDto";

export default function (req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const textError: string = 'Пользователь не авторизован';
    if (!authorization) {
        next(new UnauthorizedError(textError));
    }

    const tokenData: string[] = authorization!.split(' ');
    if (tokenData[0] === 'Bearer' && tokenData[1]) {
        next(new UnauthorizedError(textError));
    }

    let user: Pick<UserDto, 'email' | 'isActivate'>;
    try {
        user = tokenService.verifyAccessToken(tokenData[1]);
        req['user'] = user;
    } catch (error) {
        next(error);
    }
    next();
}
