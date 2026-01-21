import { Schema, model, Types, Document } from "mongoose";

export interface IChunk extends Document {
  documentId: Types.ObjectId;
  text: string;
  embedding: number[];
  index: number;
  createdAt: Date;
}

const chunkSchema = new Schema<IChunk>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      index: true,
      required: true,
    },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    index: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const ChunkModel = model<IChunk>("Chunk", chunkSchema);
