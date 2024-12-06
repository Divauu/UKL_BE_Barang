import { Router } from "express";
import { verifyToken } from "../middleware/authorization";
import { authentication, createUser, deleteUser, readUser, updateUser } from "../controller/userContoller";
import { adminAuthorization, authValidation, createValidation, updateValidation } from "../middleware/userValidation";

const router = Router()

router.post(`/`,[adminAuthorization,createValidation] ,createUser)
router.get(`/`, [adminAuthorization],readUser)
router.put(`/:id`, [adminAuthorization, updateValidation], updateUser)
router.delete(`/:id`, [adminAuthorization], deleteUser)
router.post(`/api/auth/login`,authentication)

export default router