import { Router } from "express";
import { adminAuthorization, createValidation, updateValidation } from "../middleware/itemValidation";
import { createItem, deleteItem, readItem, updateItem } from "../controller/itemController";

const router = Router()

router.post(`/api/inventory`,[adminAuthorization, createValidation] ,createItem)
router.get(`/api/inventory/:id`, [adminAuthorization],readItem)
router.put(`/api/inventory/:id`, [adminAuthorization, updateValidation], updateItem)
router.delete(`/api/inventory/:id`, [adminAuthorization], deleteItem)

export default router