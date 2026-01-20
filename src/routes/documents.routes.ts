import { Router } from "express";
import {
  createDocumentHandler,
  getDocumentByIdHandler,
  listDocumentsHandler,
} from "../controllers/documents.controller";

const router = Router();

router.post("/", createDocumentHandler);
router.get("/:id", getDocumentByIdHandler);
router.get("/", listDocumentsHandler);

export default router;
