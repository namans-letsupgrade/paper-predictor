import { Schema, model, models } from 'mongoose';

export interface IPredictedPaper {
  predictionJobId: Schema.Types.ObjectId;
  board: string;
  class: string;
  subject: string;
  examYear: number;
  version: number;
  regenerationMode: string;
  blueprint: Record<string, unknown>;
  paper: any;
  validationReport: Record<string, unknown>;
  confidenceScore: number;
  confidenceLabel: string;
  analyticsSummary: Record<string, unknown>;
  createdAt: Date;
}

const PredictedPaperSchema = new Schema<IPredictedPaper>({
  predictionJobId: { type: Schema.Types.ObjectId, ref: 'PredictionJob', index: true },
  board: { type: String, required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  examYear: { type: Number, required: true },
  version: { type: Number, default: 1 },
  regenerationMode: { type: String, default: 'balanced' },
  blueprint: { type: Schema.Types.Mixed, default: {} },
  paper: { type: [Schema.Types.Mixed], default: [] },
  validationReport: { type: Schema.Types.Mixed, default: {} },
  confidenceScore: { type: Number, default: 0 },
  confidenceLabel: { type: String, default: 'Low' },
  analyticsSummary: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

PredictedPaperSchema.index({ predictionJobId: 1, version: -1 });

export const PredictedPaper = models.PredictedPaper || model<IPredictedPaper>('PredictedPaper', PredictedPaperSchema);

