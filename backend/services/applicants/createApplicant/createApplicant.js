"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicant = void 0;
var Joi = require("joi");
var nanoid_1 = require("nanoid");
var uuidLength = 50;
var ApplicantSchema = Joi.object({
    email: Joi.string().email().required(),
    first_name: Joi.string().required().max(50),
    last_name: Joi.string().required().max(50),
    phone_number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    funnel: Joi.string(),
    stage: Joi.string(),
}).and("email", "first_name", "last_name", "phone_number");
var createApplicant = function (applicant) {
    var validation = ApplicantSchema.validate(applicant, {
        abortEarly: false,
        errors: {
            wrap: {
                label: "''",
            },
        },
    });
    if (validation.error) {
        return {
            message: "ERROR: " + validation.error.message,
        };
    }
    var email = applicant.email, first_name = applicant.first_name, last_name = applicant.last_name, phone_number = applicant.phone_number, funnel = applicant.funnel, stage = applicant.stage;
    return {
        message: "Applicant created succesfully!",
        applicant: {
            email: email,
            first_name: first_name,
            last_name: last_name,
            id: nanoid_1.nanoid(uuidLength),
            phone_number: phone_number,
            funnel: funnel ? funnel : null,
            stage: stage ? stage : null,
            created_at: Math.floor(Date.now() / 1000),
        },
    };
};
exports.createApplicant = createApplicant;