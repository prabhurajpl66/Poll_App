import { body, validationResult } from "express-validator";

export const validateUser = [
  body("username")
    .isLength({ min: 3 })
    .isString()
    .withMessage("Username must be at least 3 characters long"),

  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("email").isEmail().withMessage("Email is not valid"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


export const validateLoginUSer = [

  body("email").isEmail().withMessage("Email is not valid"),
  body("password").notEmpty().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];




