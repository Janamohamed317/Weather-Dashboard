import Joi from "joi";
import { UserLogin, UserRegister } from "../../types/User";

export function validateRegister(obj: UserRegister) {
    const schema = Joi.object({
        username: Joi.string().min(2).max(25).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(8).max(64).required()
    });

    return schema.validate(obj);
}

export function validateLogin(obj: UserLogin) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    return schema.validate(obj);
}