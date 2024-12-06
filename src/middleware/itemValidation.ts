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
            if (err) return res.status(401).json({message: "User un authorized"})
           const role = decode as JwtPayload
            if (role.roles != "Admin") res.status(401).json({message: "Acces denied"})
            next()
            
        }) 
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Token tidak valid"
        })
    }
}

const createSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    quantity: Joi.number().min(0).required()
})

const createValidation = (req: Request, res: Response, next: NextFunction): any => {
    const validate = createSchema.validate(req.body)
    if(validate.error) {
        return res.status(400).json({
            message: validate.error.details.map(it => it.message).join()
        })
    }
    return next()
}

const updateSchema = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    location: Joi.string().optional(),
    quantity: Joi.number().min(0).optional()
})

const updateValidation = (req: Request, res: Response, next: NextFunction): any => {
    const validate = updateSchema.validate(req.body)
    if(validate.error) {
        return res.status(400).json({
            message: validate.error.details.map(it => it.message).join()
        })
    }
    return next()
}

export { createValidation, updateValidation, adminAuthorization }