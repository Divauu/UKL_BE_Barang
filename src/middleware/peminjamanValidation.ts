import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import jwt, { JwtPayload }  from "jsonwebtoken";

const adminAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                message: "Token tidak ditemukan"
            })
        }
        const token = authHeader.split(" ")[1]
        const signature = process.env.SECRET || ''

        jwt.verify(token, signature, (err,decode) => {
            if (err) return res.status(401).json({message: "user un authorized"})
           const role = decode as JwtPayload
            if (role.roles != "Admin") res.status(401).json({message: "Access denied"})
            next()
            
        }) 
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Token tidak valid"
        })
    }
}


const createPeminjamanSchema = Joi.object({
  user_id: Joi.number().required(),
  item_id: Joi.number().required(),
  borrow_date: Joi.date().iso().required(),
  return_date: Joi.date().iso().required().greater(Joi.ref('borrow_date')),
});

const createPeminjamanValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createPeminjamanSchema.validate(req.body, { abortEarly: false });

  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((detail) => detail.message).join(", "),
    });
  }

  return next();
};

const returnSchema = Joi.object({
  id: Joi.number().required(),
  return_date: Joi.date().iso().required(),
});

const returnValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = returnSchema.validate(req.body, { abortEarly: false });

  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((detail) => detail.message).join(", "),
    });
  }

  return next();
};

export { createPeminjamanValidation, returnValidation, adminAuthorization };
