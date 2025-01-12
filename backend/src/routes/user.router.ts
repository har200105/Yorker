import express from 'express';
import { getUser, loginUser } from '../controller/user.controller';

const userRouter = express.Router();

userRouter.post('/login',loginUser);
userRouter.get('/me',getUser);

export default userRouter;