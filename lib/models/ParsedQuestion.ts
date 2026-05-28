import mongoose, { Schema, model, models } from 'mongoose';

// ─── Option (for MCQ) ────────────────────────────────────────────────────────
const OptionSchema = new Schema({
  label: String,
  text: String,
}, { _id: false });

// ─── Answer ──────────────────────────────────────────────────────────────────
const AnswerSchema = new Schema({
  solution: String,
  finalAnswer: String,
}, { _id: false });

// ─── Mapping ─────────────────────────────────────────────────────────────────
const MappingSchema = new Schema({
  unit: String,
  chapter: String,
  topic: String,
}, { _id: false });

// ─── Single Question ──────────────────────────────────────────────────────────
const QuestionSchema = new Schema({
  questionNumber: String,
  questionText: String,
  questionType: {
    type: String,
    enum: ['mcq', 'very_short_answer', 'short_answer', 'long_answer', 'case_study', 'diagram_based', 'numerical', 'assertion_reason', 'fill_in_the_blank'],
  },
  options: [OptionSchema],
  marks: Number,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  mapping: MappingSchema,
  parentQuestionNumber: String,
}, { _id: false });

// ─── Section ──────────────────────────────────────────────────────────────────
const SectionSchema = new Schema({
  sectionName: String,
  questionType: String,
  questions: [QuestionSchema],
}, { _id: false });

export interface IOption {
  label: string;
  text: string;
}

export interface IMapping {
  unit?: string;
  chapter?: string;
  topic?: string;
}

export interface IQuestion {
  questionNumber: string;
  questionText: string;
  questionType: 'mcq' | 'very_short_answer' | 'short_answer' | 'long_answer' | 'case_study' | 'diagram_based' | 'numerical' | 'assertion_reason' | 'fill_in_the_blank';
  options?: IOption[];
  marks: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  mapping?: IMapping;
  parentQuestionNumber?: string;
}

export interface ISection {
  sectionName: string;
  questionType: string;
  questions: IQuestion[];
}

// ─── ParsedQuestion Document ──────────────────────────────────────────────────
export interface IParsedQuestion {
  board: string;
  class: string;
  subject: string;
  year: number;
  set: string;
  totalQuestions: number;
  totalMarks: number;
  sections: ISection[];
  source: 'admin' | 'student';
  createdAt: Date;
}

const ParsedQuestionSchema = new Schema<IParsedQuestion>({
  board: { type: String, required: true, index: true },
  class: { type: String, required: true, index: true },
  subject: { type: String, required: true, index: true },
  year: { type: Number, required: true, index: true },
  set: { type: String, default: 'Set 1' },
  totalQuestions: Number,
  totalMarks: Number,
  sections: [SectionSchema],
  source: { type: String, enum: ['admin', 'student'], default: 'admin' },
}, { timestamps: true });

export const ParsedQuestion = models.ParsedQuestion || model<IParsedQuestion>('ParsedQuestion', ParsedQuestionSchema);

