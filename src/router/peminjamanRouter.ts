import express from "express";
import { createPeminjamanValidation, returnValidation } from "../middleware/peminjamanValidation";
import { createPeminjaman, readPeminjaman, returnItem, usageReport } from "../controller/peminjamanController";
import { adminAuthorization } from "../middleware/itemValidation";


const router = express.Router();

router.post(`/api/inventory/borrow`, [adminAuthorization, createPeminjamanValidation], createPeminjaman);
router.get(`/api/inventory/borrow`, [adminAuthorization],readPeminjaman);
router.post(`/api/inventory/return`, [adminAuthorization, returnValidation], returnItem);
router.post(`/api/inventory/usage-report`, [adminAuthorization], usageReport)

export default router;
