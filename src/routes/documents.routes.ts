import { Router } from "express";
import {
  createDocumentHandler,
  getDocumentByIdHandler,
} from "../controllers/documents.controller";

const router = Router();

router.post("/", createDocumentHandler);
router.get("/:id", getDocumentByIdHandler);

export default router;
