import {Request, Response, NextFunction} from 'express'
import {UserEntity} from "../models/UserEntity";

export class MailController {
    async activate(req: Request, res: Response, next: NextFunction) {
        const {idUser} = req.params;
        try {
            const user = await UserEntity.findByPk(idUser);
            if (user) {
                user.set({isActivate: true});
                await user.save();
            }
            res.redirect(process.env.CLIENT_URL! + '/login');
        } catch (error) {
            next();
        }
    }
}

export default new MailController();
