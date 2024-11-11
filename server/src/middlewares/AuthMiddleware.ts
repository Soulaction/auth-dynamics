import {NextFunction, Request, Response} from "express";
import {UnauthorizedError} from "../errors/UnauthorizedError";
import tokenService from "../services/TokenService";
import {UserTokenData} from "../dto/UserTokenData";

export default function (req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const textError: string = 'Пользователь не авторизован';
    if (!authorization) {
        next(new UnauthorizedError(textError));
    }

    const tokenData: string[] = authorization!.split(' ');
    if (!(tokenData[0] === 'Bearer') || !tokenData[1]) {
        next(new UnauthorizedError(textError));
    }

    let user: UserTokenData;
    try {
        user = tokenService.verifyAccessToken(tokenData[1]);
        req['user'] = user;
    } catch (error) {
        next(new UnauthorizedError(textError));
    }
    next();
}
