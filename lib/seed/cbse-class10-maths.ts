/**
 * Cold-start seed data for CBSE Class 10 Mathematics
 * Based on knowledge of 5-7 years of historical paper patterns.
 * This data is used when no actual past papers have been uploaded yet.
 * dataSource: "knowledge_based"
 */

export const CBSE_CLASS10_MATHS_SEED = {
  board: "CBSE",
  class: "10",
  subject: "Mathematics",
  dataSource: "knowledge_based",
  academicYear: "2024-25",
  examPattern: {
    totalMarks: 80,
    durationMinutes: 180,
    sections: [
      { name: "A", questionType: "mcq", totalQuestions: 20, marksEach: 1, totalMarks: 20 },
      { name: "B", questionType: "very_short_answer", totalQuestions: 5, marksEach: 2, totalMarks: 10 },
      { name: "C", questionType: "short_answer", totalQuestions: 6, marksEach: 3, totalMarks: 18 },
      { name: "D", questionType: "long_answer", totalQuestions: 4, marksEach: 5, totalMarks: 20 },
      { name: "E", questionType: "case_study", totalQuestions: 3, marksEach: 4, totalMarks: 12 }
    ]
  },
  chapterAnalytics: [
    {
      chapter: "Real Numbers",
      unit: "Number Systems",
      frequencyScore: 100,
      averageMarks: 5,
      averageWeightagePercent: 6.25,
      recencyWeightedScore: 5.2,
      trend: "stable",
      questionTypes: { mcq: 2, very_short_answer: 1 },
      difficultyDistribution: { easy: 50, medium: 40, hard: 10 },
      topTopics: [
        { topic: "Euclid's Division Lemma", appearances: 5, probability: 85, trend: "stable" },
        { topic: "Fundamental Theorem of Arithmetic", appearances: 5, probability: 90, trend: "stable" },
        { topic: "Irrational numbers proof", appearances: 4, probability: 75, trend: "stable" }
      ]
    },
    {
      chapter: "Polynomials",
      unit: "Algebra",
      frequencyScore: 100,
      averageMarks: 6,
      averageWeightagePercent: 7.5,
      recencyWeightedScore: 6.5,
      trend: "stable",
      questionTypes: { mcq: 2, short_answer: 1, very_short_answer: 1 },
      difficultyDistribution: { easy: 30, medium: 55, hard: 15 },
      topTopics: [
        { topic: "Zeroes of polynomial", appearances: 5, probability: 92, trend: "stable" },
        { topic: "Relationship between zeroes and coefficients", appearances: 5, probability: 88, trend: "stable" },
        { topic: "Division algorithm", appearances: 3, probability: 65, trend: "decreasing" }
      ]
    },
    {
      chapter: "Pair of Linear Equations",
      unit: "Algebra",
      frequencyScore: 100,
      averageMarks: 8,
      averageWeightagePercent: 10,
      recencyWeightedScore: 8.5,
      trend: "stable",
      questionTypes: { mcq: 2, short_answer: 1, long_answer: 1 },
      difficultyDistribution: { easy: 20, medium: 50, hard: 30 },
      topTopics: [
        { topic: "Graphical method", appearances: 5, probability: 80, trend: "stable" },
        { topic: "Elimination method", appearances: 5, probability: 85, trend: "stable" },
        { topic: "Substitution method", appearances: 5, probability: 85, trend: "stable" },
        { topic: "Word problems", appearances: 4, probability: 78, trend: "stable" }
      ]
    },
    {
      chapter: "Quadratic Equations",
      unit: "Algebra",
      frequencyScore: 100,
      averageMarks: 9.6,
      averageWeightagePercent: 12,
      recencyWeightedScore: 10.2,
      trend: "stable",
      questionTypes: { mcq: 3, short_answer: 2, long_answer: 1 },
      difficultyDistribution: { easy: 30, medium: 55, hard: 15 },
      topTopics: [
        { topic: "Nature of roots", appearances: 5, probability: 92, trend: "stable" },
        { topic: "Quadratic formula", appearances: 5, probability: 88, trend: "stable" },
        { topic: "Factorisation method", appearances: 5, probability: 85, trend: "stable" },
        { topic: "Word problems", appearances: 4, probability: 80, trend: "stable" }
      ]
    },
    {
      chapter: "Arithmetic Progressions",
      unit: "Algebra",
      frequencyScore: 100,
      averageMarks: 8,
      averageWeightagePercent: 10,
      recencyWeightedScore: 8.2,
      trend: "increasing",
      questionTypes: { mcq: 2, short_answer: 1, long_answer: 1 },
      difficultyDistribution: { easy: 25, medium: 55, hard: 20 },
      topTopics: [
        { topic: "nth term formula", appearances: 5, probability: 90, trend: "stable" },
        { topic: "Sum of n terms", appearances: 5, probability: 88, trend: "stable" },
        { topic: "Word problems on AP", appearances: 4, probability: 82, trend: "increasing" }
      ]
    },
    {
      chapter: "Triangles",
      unit: "Geometry",
      frequencyScore: 100,
      averageMarks: 10,
      averageWeightagePercent: 12.5,
      recencyWeightedScore: 10.5,
      trend: "stable",
      questionTypes: { mcq: 2, short_answer: 2, long_answer: 1 },
      difficultyDistribution: { easy: 25, medium: 45, hard: 30 },
      topTopics: [
        { topic: "Basic Proportionality Theorem", appearances: 5, probability: 92, trend: "stable" },
        { topic: "Similarity criteria (AA, SSS, SAS)", appearances: 5, probability: 90, trend: "stable" },
        { topic: "Pythagoras theorem", appearances: 5, probability: 88, trend: "stable" },
        { topic: "Areas of similar triangles", appearances: 4, probability: 78, trend: "stable" }
      ]
    },
    {
      chapter: "Coordinate Geometry",
      unit: "Geometry",
      frequencyScore: 100,
      averageMarks: 6,
      averageWeightagePercent: 7.5,
      recencyWeightedScore: 6.8,
      trend: "increasing",
      questionTypes: { mcq: 2, short_answer: 1 },
      difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
      topTopics: [
        { topic: "Distance formula", appearances: 5, probability: 88, trend: "stable" },
        { topic: "Section formula", appearances: 5, probability: 85, trend: "stable" },
        { topic: "Area of triangle", appearances: 4, probability: 78, trend: "increasing" },
        { topic: "Midpoint formula", appearances: 5, probability: 82, trend: "stable" }
      ]
    },
    {
      chapter: "Introduction to Trigonometry",
      unit: "Trigonometry",
      frequencyScore: 100,
      averageMarks: 8,
      averageWeightagePercent: 10,
      recencyWeightedScore: 8.5,
      trend: "stable",
      questionTypes: { mcq: 3, short_answer: 1, very_short_answer: 1 },
      difficultyDistribution: { easy: 35, medium: 50, hard: 15 },
      topTopics: [
        { topic: "Trigonometric ratios", appearances: 5, probability: 90, trend: "stable" },
        { topic: "Trigonometric identities", appearances: 5, probability: 92, trend: "stable" },
        { topic: "Complementary angles", appearances: 4, probability: 80, trend: "stable" }
      ]
    },
    {
      chapter: "Some Applications of Trigonometry",
      unit: "Trigonometry",
      frequencyScore: 100,
      averageMarks: 5,
      averageWeightagePercent: 6.25,
      recencyWeightedScore: 5.5,
      trend: "stable",
      questionTypes: { mcq: 1, long_answer: 1 },
      difficultyDistribution: { easy: 20, medium: 55, hard: 25 },
      topTopics: [
        { topic: "Heights and distances", appearances: 5, probability: 95, trend: "stable" },
        { topic: "Angle of elevation", appearances: 5, probability: 90, trend: "stable" },
        { topic: "Angle of depression", appearances: 4, probability: 85, trend: "stable" }
      ]
    },
    {
      chapter: "Circles",
      unit: "Geometry",
      frequencyScore: 100,
      averageMarks: 6,
      averageWeightagePercent: 7.5,
      recencyWeightedScore: 6.5,
      trend: "stable",
      questionTypes: { mcq: 2, short_answer: 1 },
      difficultyDistribution: { easy: 30, medium: 55, hard: 15 },
      topTopics: [
        { topic: "Tangent to a circle", appearances: 5, probability: 92, trend: "stable" },
        { topic: "Number of tangents from external point", appearances: 5, probability: 88, trend: "stable" }
      ]
    },
    {
      chapter: "Areas Related to Circles",
      unit: "Mensuration",
      frequencyScore: 80,
      averageMarks: 4,
      averageWeightagePercent: 5,
      recencyWeightedScore: 4.2,
      trend: "decreasing",
      questionTypes: { mcq: 1, short_answer: 1 },
      difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
      topTopics: [
        { topic: "Area of sector", appearances: 4, probability: 75, trend: "decreasing" },
        { topic: "Area of segment", appearances: 3, probability: 65, trend: "decreasing" }
      ]
    },
    {
      chapter: "Surface Areas and Volumes",
      unit: "Mensuration",
      frequencyScore: 100,
      averageMarks: 7,
      averageWeightagePercent: 8.75,
      recencyWeightedScore: 7.5,
      trend: "stable",
      questionTypes: { mcq: 2, long_answer: 1 },
      difficultyDistribution: { easy: 20, medium: 50, hard: 30 },
      topTopics: [
        { topic: "Combination of solids", appearances: 5, probability: 88, trend: "stable" },
        { topic: "Conversion of solids", appearances: 4, probability: 80, trend: "stable" },
        { topic: "Frustum of cone", appearances: 3, probability: 70, trend: "rebound_possible" }
      ]
    },
    {
      chapter: "Statistics",
      unit: "Statistics & Probability",
      frequencyScore: 100,
      averageMarks: 6,
      averageWeightagePercent: 7.5,
      recencyWeightedScore: 6.5,
      trend: "stable",
      questionTypes: { mcq: 1, short_answer: 1, case_study: 1 },
      difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
      topTopics: [
        { topic: "Mean (step-deviation, assumed mean)", appearances: 5, probability: 90, trend: "stable" },
        { topic: "Median", appearances: 5, probability: 88, trend: "stable" },
        { topic: "Mode", appearances: 5, probability: 85, trend: "stable" },
        { topic: "Ogive", appearances: 3, probability: 68, trend: "rebound_possible" }
      ]
    },
    {
      chapter: "Probability",
      unit: "Statistics & Probability",
      frequencyScore: 100,
      averageMarks: 4,
      averageWeightagePercent: 5,
      recencyWeightedScore: 4.5,
      trend: "increasing",
      questionTypes: { mcq: 2, very_short_answer: 1 },
      difficultyDistribution: { easy: 40, medium: 45, hard: 15 },
      topTopics: [
        { topic: "Classical probability", appearances: 5, probability: 90, trend: "stable" },
        { topic: "Cards probability", appearances: 4, probability: 82, trend: "stable" },
        { topic: "Dice probability", appearances: 4, probability: 80, trend: "stable" }
      ]
    }
  ],
  questionTypeDistribution: {
    mcq: { avgCount: 20, avgMarks: 20, percentOfPaper: 25 },
    very_short_answer: { avgCount: 5, avgMarks: 10, percentOfPaper: 12.5 },
    short_answer: { avgCount: 6, avgMarks: 18, percentOfPaper: 22.5 },
    long_answer: { avgCount: 4, avgMarks: 20, percentOfPaper: 25 },
    case_study: { avgCount: 3, avgMarks: 12, percentOfPaper: 15 }
  },
  difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
  overallInsights: {
    mostConsistentChapters: ["Quadratic Equations", "Triangles", "Arithmetic Progressions", "Trigonometry"],
    increasingTrendChapters: ["Coordinate Geometry", "Probability", "Arithmetic Progressions"],
    decreasingTrendChapters: ["Areas Related to Circles", "Constructions"],
    reboundCandidates: ["Statistics (Ogive)", "Surface Areas (Frustum)"]
  }
};
