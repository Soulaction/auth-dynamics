import {Router}from 'express';
import authController from "../controllers/AuthController";
import auth from "../middlewares/AuthMiddleware";

const authRouter = Router();
authRouter.get('/user', auth, authController.user);
authRouter.post('/registration', authController.registration);
authRouter.post('/login', authController.login);
authRouter.get('/refresh', auth, authController.refresh);
authRouter.get('/logout', auth, authController.logout);

export default authRouter;
