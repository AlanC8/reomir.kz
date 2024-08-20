import { Router } from 'express';
import authRouter from './auth/auth-router';
import productRouter from './product/route';

const globalRouter = Router();

globalRouter.use(authRouter);
globalRouter.use(productRouter)

export default globalRouter;
