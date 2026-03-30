import { City } from "../../types/City";
import Joi from "joi";

export function validateCityAdd(obj: City) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        country: Joi.string().min(2).max(100).required(),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
    });

    return schema.validate(obj);
}