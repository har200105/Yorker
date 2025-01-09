import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "src/models/user";

const SECRET_KEY = process.env.JWT_SECRET || "akipiD";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const user = await UserModel.findOne({ where: { username } });

    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const isPasswordValid = await UserModel.prototype.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "This username is selected already" });
      return;
    }

    const token = jwt.sign({ id: user.dataValues.id, username: user.dataValues.username }, SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
