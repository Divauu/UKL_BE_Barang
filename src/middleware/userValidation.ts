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
    username: Joi.string().required(),
    password: Joi.string().min(10).required(),
    roles: Joi.string().valid("Admin", "Member").required()
})

const createValidation = (req: Request, res: Response, next: NextFunction):any => {
    const validation = createSchema.validate(req.body)
    if(validation.error) {
        return res.status(400).json({
            message: validation.error.details.map(item => item.message).join()
        })
    }
    return next()
}

const updateSchema = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().min(10).optional(),
    roles: Joi.string().valid(`Admin`, `Member`).optional()

})

const updateValidation = (req: Request, res: Response, next: NextFunction):any => {
    const validation = updateSchema.validate(req.body)
    if(validation.error) {
        return res.status(400).json({
            message: validation.error.details.map(item => item.message).join()
        })
    }
    return next()
}

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const authValidation = (req: Request, res: Response, next: NextFunction): any => {
    const validation = authSchema.validate(req.body)
    if(validation.error) {
        return res.status(400).json({
            message: validation.error.details.map(item => item.message).join()
        })
    }
    return next()
}

export { createValidation, updateValidation, authValidation, adminAuthorization }