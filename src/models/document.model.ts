import { Schema, model, Document, Types } from "mongoose";

export type DocumentStatus = "uploaded" | "processing" | "processed" | "failed";

export interface IDocument extends Document {
  _id: Types.ObjectId;
  source: "upload" | "api" | "email";
  originalName: string;
  mimeType: string;
  rawText: string;
  status: DocumentStatus;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    source: {
      type: String,
      enum: ["upload", "api", "email"],
      required: true,
      index: true,
    },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    rawText: { type: String, required: true },

    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded",
      index: true,
    },

    error: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const DocumentModel = model<IDocument>("Document", documentSchema);
