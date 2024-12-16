import bcrypt from "bcryptjs";
import {
  isLoginsucess,
  registerUserService,
  userExists,
} from "../services/auth.service.js";
import { generateToken } from "../utils/jwtutils.js";

export const RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isUserExists = await userExists(email);
    if (isUserExists)
      return res.status(400).json({
        status: "failed",
        message: "It seems you already have an account, please log in instead.",
      });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { ...req.body, password: hashedPassword };

    const savedUser = await registerUserService(newUser);
    res.status(200).json({
      status: "success",
      data: [savedUser],
      message:
        "Thank you for registering with us. Your account has been successfully created.",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
  res.end();
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await isLoginsucess(email);
    console.log("user", user);
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
    }

    const accessToken = generateToken(user._id.toString());
    console.log("user._id",user._id.toString())
    res.status(200).json({
      status: "success",
      user_id: user._id.toString(),
      accessToken: accessToken,
      message: "You have successfully logged in.",
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
};
