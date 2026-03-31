import { CityModel } from "../models/CityModel";
import { User } from "../models/UserModel";
import { UserLogin, UserRegister } from "../types/User";
import { BadRequestError, ConflictError, UnauthorizedError } from "../utils/error";
import { tokenCreation } from "../utils/tokenCreation";
import { validateLogin, validateRegister } from "../utils/validations/userValidation";
import bcrypt from "bcryptjs"

const validateSignupDataService = (data: UserRegister) => {
    const { error } = validateRegister(data);
    if (error) {
        throw new BadRequestError(error.details[0].message);
    }
};

const checkUserExistsService = async (email: string, username: string) => {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        if (existingUser.email === email) throw new ConflictError("Email is already registered");
        throw new ConflictError("Username already exists");
    }
};

const hashPasswordService = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

const createUserService = async (data: UserRegister, hashedPassword: string) => {
    const user = new User({
        email: data.email,
        username: data.username,
        password: hashedPassword
    });

    await user.save();
    return user;
};

export const signupService = async (data: UserRegister) => {
    validateSignupDataService(data);
    await checkUserExistsService(data.email, data.username)

    const hashedPassword = await hashPasswordService(data.password);
    const newUser = await createUserService(data, hashedPassword);

    const token = tokenCreation(newUser._id.toString());

    return { token: token, id: newUser._id };
};

const validateLoginDataService = (data: UserLogin) => {
    const { error } = validateLogin(data);
    if (error) {
        throw new BadRequestError(error.details[0].message);
    }
};

const getUserByEmailService = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }
    return user;
};

const verifyPasswordService = async (inputPassword: string, storedPassword: string) => {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    if (!isMatch) {
        throw new UnauthorizedError("Invalid email or password");
    }
};

export const loginService = async (data: UserLogin) => {
    validateLoginDataService(data);

    const user = await getUserByEmailService(data.email);
    await verifyPasswordService(data.password, user.password);

    const token = tokenCreation(user._id.toString());
    return { token, id: user._id };
};

export const deleteAccountService = async (id: string) => {
    await User.findByIdAndDelete(id)
    await CityModel.deleteMany({ userId: id });
}