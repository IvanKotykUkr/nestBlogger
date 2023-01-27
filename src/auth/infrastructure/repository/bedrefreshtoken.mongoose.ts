import { TokensType } from "../../auth.types";
import mongoose from "mongoose";

export const TokesSchema = new mongoose.Schema<TokensType>(
  {
    token: String,
    addedAt: Number,
  },
  {
    versionKey: false,
  }
);

export type TokensDocument = TokensType & Document;
