import { Router } from "express";
import {
  createDocumentHandler,
  getDocumentByIdHandler,
  listDocumentsHandler,
  semanticSearchHandler,
} from "../controllers/documents.controller";

const router = Router();

router.post("/", createDocumentHandler);
router.get("/:id", getDocumentByIdHandler);
router.get("/", listDocumentsHandler);
router.get("/search/semantic", semanticSearchHandler);

export default router;
