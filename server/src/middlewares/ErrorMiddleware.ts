import {Request, Response, NextFunction} from 'express';

export default function (err, req: Request, res: Response, next: NextFunction) {
    let {statusCode = 500, message, stack} = err
    if (statusCode === 500) {
        message = 'Ошибка сервера';
    }
    res.status(statusCode).json({message, stack});
};
