import e, { Request, Response } from "express";
import { createDocument, getDocumentById } from "../services/documents.service";

export async function createDocumentHandler(req: Request, res: Response) {
  try {
    const { source, originalName, mimeType, rawText } = req.body;

    if (!source || !originalName || !mimeType || !rawText) {
      return res.status(400).json({ error: "Missing required fields " });
    }

    const doc = await createDocument({
      source,
      originalName,
      mimeType,
      rawText,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.log("Create document failed: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getDocumentByIdHandler(req: Request, res: Response) {
  try {
    const doc = await getDocumentById(req.params.id as string);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(doc);
  } catch (err) {
    console.error("Get document failed: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
