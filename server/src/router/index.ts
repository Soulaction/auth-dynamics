import {Router} from 'express';
import authRouter from "./AuthRouter";
import mailRouter from "./MailRouter";

const router = Router();
router.use('/auth', authRouter);
router.use('/mail', mailRouter);

export default router;
