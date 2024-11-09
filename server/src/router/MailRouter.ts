import {Router} from 'express';
import mailController from "../controllers/MailController";

const mailRouter = Router();
mailRouter.get('/activate/:idUser', mailController.activate);

export default mailRouter;
