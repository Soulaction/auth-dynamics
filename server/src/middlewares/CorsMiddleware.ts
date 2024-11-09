import {NextFunction, Request, Response} from 'express';
import ms from "ms";

const allowOrigin: string[] = ['http://localhost:8080'];
const allowMethods: string = 'GET,POST,PUT,PATH,DELETE';

export default function (req: Request, res: Response, next: NextFunction) {
    const origin: string = req.headers.origin ?? '';
    if (allowOrigin.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
        const allowHeaders: string | undefined = req.headers["access-control-request-headers"];
        res.setHeader('Access-Control-Allow-Headers', allowHeaders ?? '');
        res.setHeader('Access-Control-Allow-Methods', allowMethods);
        res.setHeader('Access-Control-Max-Age', ms(process.env.ACCESS_EXPIRES!));
        return res.end();
    }
    return next();
}
