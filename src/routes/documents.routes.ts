import { Router } from "express";
import {
  askQuestionHandler,
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
router.post("/ask", askQuestionHandler);

export default router;
