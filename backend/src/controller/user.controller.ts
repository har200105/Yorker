import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { UserModel } from "../models/user";
import { config } from "../config";

const ACCESS_TOKEN_SECRET_KEY = config.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = config.REFRESH_TOKEN_SECRET_KEY;

export const getUser = async(req: Request,res: Response): Promise<void> => {
  if(req?.currentUser?.id){
    res.status(200).json({currentUser: req.currentUser});
    return;
  }
  res.status(401).json({error: 'Invalid token'});
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const user = await UserModel.findOne({ where: { username },raw: true });

    if (!user) {
      const hashedPassword = await hash(password, 10);
      const newUserInstance = await UserModel.create({
        username,
        password: hashedPassword
      });
      
      const newUser = newUserInstance.get({ plain: true }); 

      const tokens = generateTokens(newUser);
      res.status(201).json({ message: "User created", ...tokens });
      return;
    }

    const isPasswordValid = await compare(password,user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const tokens = generateTokens(user);
    res.status(200).json({ message: "User logged in", ...tokens });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    ACCESS_TOKEN_SECRET_KEY!,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_TOKEN_SECRET_KEY!,
    { expiresIn: "10d" }
  );

  return { accessToken, refreshToken };
};
