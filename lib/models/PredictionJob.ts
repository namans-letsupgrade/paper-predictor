import { Schema, model, models } from 'mongoose';

export interface IPredictionJob {
  board: string;
  class: string;
  subject: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  papersUsed: number;
  syllabusAvailable: boolean;
  textbookAvailable: boolean;
  yearsAnalyzed: number[];
  chapterAnalytics: Record<string, unknown>;
  topicProbabilities: Record<string, unknown>;
  questionTypeDistribution: Record<string, unknown>;
  difficultyDistribution: Record<string, unknown>;
  overallInsights: Record<string, unknown>;
  confidenceScore: number;
  confidenceLabel: string;
  dataSource: 'data_based' | 'knowledge_based';
  createdAt: Date;
  updatedAt: Date;
}

const PredictionJobSchema = new Schema<IPredictionJob>({
  board: { type: String, required: true, index: true },
  class: { type: String, required: true, index: true },
  subject: { type: String, required: true, index: true },
  status: { type: String, enum: ['pending', 'running', 'complete', 'error'], default: 'pending' },
  papersUsed: { type: Number, default: 0 },
  syllabusAvailable: { type: Boolean, default: false },
  textbookAvailable: { type: Boolean, default: false },
  yearsAnalyzed: [Number],
  chapterAnalytics: { type: Schema.Types.Mixed, default: {} },
  topicProbabilities: { type: Schema.Types.Mixed, default: {} },
  questionTypeDistribution: { type: Schema.Types.Mixed, default: {} },
  difficultyDistribution: { type: Schema.Types.Mixed, default: {} },
  overallInsights: { type: Schema.Types.Mixed, default: {} },
  confidenceScore: { type: Number, default: 0 },
  confidenceLabel: { type: String, default: 'Very Low' },
  dataSource: { type: String, enum: ['data_based', 'knowledge_based'], default: 'knowledge_based' },
}, { timestamps: true });

// Compound index for lookup
PredictionJobSchema.index({ board: 1, class: 1, subject: 1 });

export const PredictionJob = models.PredictionJob || model<IPredictionJob>('PredictionJob', PredictionJobSchema);

