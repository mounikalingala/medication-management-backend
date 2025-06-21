import express from "express";
import {
    addMedication,
    getMedications,
    markTaken,
} from "../controllers/medicationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);
router.post("/", addMedication);
router.get("/", getMedications);
router.put("/:id/taken", markTaken);
export default router;
