import User from "../models/user.model.js";

export const userExists = async(email) => {
    return  await User.findOne({ email });
}

export const registerUserService = async(newUser) =>{
    const user = new User(newUser);
    return  await user.save()
}

export const isLoginsucess = async( email) =>{
    return await User.findOne({ email }).select("+password");
}