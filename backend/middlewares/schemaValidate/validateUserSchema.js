import {
  registerSchema,
  loginSchema,
} from "../../schemaValidation/validateUserSchema.js";

export const validateRegister = (req, res, next) => {
  let { error } = registerSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({
      message: errMsg,
      success: false,
    });
  } else {
    next();
  }
};

export const validateLogin = (req, res, next) => {
  let { error } = loginSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({
      message: errMsg,
      success: false,
    });
  } else {
    next();
  }
};
