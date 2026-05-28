export interface MCQQuestion {
  q_no: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  answer: string;
  topic: string;
  type?: string;
}

export interface ShortQuestion {
  q_no: number;
  question?: string;
  answer?: string;
  topic: string;
  parts?: { part: string; question: string; answer: string; note?: string }[];
}

export interface CaseStudyQuestion {
  q_no: number;
  context: string;
  topic: string;
  sub_questions: { part: string; marks: number; question: string; answer: string; note?: string }[];
}

export type AnyQuestion = MCQQuestion | ShortQuestion | CaseStudyQuestion;

export interface Section {
  section: string;
  title: string;
  marks_per_question: number | null;
  type: string;
  questions: AnyQuestion[];
}

export interface PastPaper {
  year: number;
  title: string;
  set: string;
  time_allowed: string;
  maximum_marks: number;
  general_instructions: string[];
  sections: Section[];
}

export interface PastPaperIndex {
  board: string;
  cls: string;
  subject: string;
  papers: PastPaper[];
}

const CBSE_10_MATHS: PastPaperIndex = {
  board: 'CBSE',
  cls: '10',
  subject: 'Mathematics',
  papers: [
    {
      year: 2025,
      title: 'CBSE Class 10 Mathematics (Standard)',
      set: '30/1/1',
      time_allowed: '3 Hours',
      maximum_marks: 80,
      general_instructions: [
        'All questions are compulsory.',
        'Internal choice is provided wherever applicable.',
        'Questions follow the current CBSE syllabus.',
      ],
      sections: [
        {
          section: 'A',
          title: 'Objective Questions',
          marks_per_question: 1,
          type: 'MCQ',
          questions: [
            { q_no: 1, question: 'If one zero of the quadratic polynomial f(x) = x² + 5x + k is 2, then the value of k is:', options: { a: '-14', b: '4', c: '-10', d: '10' }, answer: 'a', topic: 'Polynomials' },
            { q_no: 2, question: 'The pair of equations 2x + 3y = 7 and 4x + 6y = 14 has:', options: { a: 'Infinitely many solutions', b: 'A unique solution', c: 'No solution', d: 'Two distinct solutions' }, answer: 'a', topic: 'Pair of Linear Equations' },
            { q_no: 3, question: 'In an AP, the common difference is 2 and the first term is 3. The fifth term is:', options: { a: '9', b: '11', c: '13', d: '7' }, answer: 'b', topic: 'Arithmetic Progressions' },
            { q_no: 4, question: 'Which of the following numbers is irrational?', options: { a: '0.36', b: '2/7', c: '√7', d: '3/5' }, answer: 'c', topic: 'Real Numbers' },
            { q_no: 5, question: 'The discriminant of the equation x² – 4x + 4 = 0 is:', options: { a: '16', b: '12', c: '0', d: '4' }, answer: 'c', topic: 'Quadratic Equations' },
            { q_no: 6, question: 'If sin θ = 3/5, then cos θ is:', options: { a: '4/5', b: '3/4', c: '5/3', d: '1/5' }, answer: 'a', topic: 'Introduction to Trigonometry' },
            { q_no: 7, question: 'The sum of the first 15 natural numbers is:', options: { a: '120', b: '105', c: '115', d: '140' }, answer: 'b', topic: 'Arithmetic Progressions' },
            { q_no: 8, question: 'If tangents from an external point A to a circle with center O touch the circle at P and Q, then OA is equal to:', options: { a: 'AP', b: 'AQ', c: 'OP', d: 'OQ' }, answer: 'a', topic: 'Circles' },
            { q_no: 9, question: 'The product of two consecutive positive integers is 132. The integers are:', options: { a: '11, 12', b: '10, 13', c: '12, 13', d: '6, 22' }, answer: 'c', topic: 'Quadratic Equations' },
            { q_no: 10, question: 'Which of the following is not a quadratic equation?', options: { a: '2x² - 4x + 3 = 0', b: 'x + 5 = 0', c: 'x² + 6x – 9 = 0', d: '3x² + 2x = 0' }, answer: 'b', topic: 'Quadratic Equations' },
            { q_no: 11, question: 'The HCF of 20 and 28 is:', options: { a: '4', b: '7', c: '2', d: '5' }, answer: 'a', topic: 'Real Numbers' },
            { q_no: 12, question: 'Area of a circle with radius r is:', options: { a: 'πr', b: 'πr²', c: '2πr', d: 'π/2' }, answer: 'b', topic: 'Areas Related to Circles' },
            { q_no: 13, question: 'On throwing a dice, the probability of getting an even number is:', options: { a: '1/2', b: '1/3', c: '1/6', d: '2/3' }, answer: 'a', topic: 'Probability' },
            { q_no: 14, question: 'Which of the following is the solution of the equation 2x – 3 = 9?', options: { a: 'x = 3', b: 'x = 6', c: 'x = –6', d: 'x = –3' }, answer: 'b', topic: 'Pair of Linear Equations' },
            { q_no: 15, question: 'If the ratio of the areas of two circles is 9:16, then the ratio of their radii is:', options: { a: '3:4', b: '9:16', c: '4:3', d: '16:9' }, answer: 'a', topic: 'Areas Related to Circles' },
            { q_no: 16, question: 'Given that two lines with equations 3x – 2y = 7 and 6x – 4y = 14 are:', options: { a: 'Intersecting', b: 'Coincident', c: 'Parallel', d: 'Perpendicular' }, answer: 'b', topic: 'Pair of Linear Equations' },
            { q_no: 17, question: 'The next term in the sequence 8, 15, 22, ... is:', options: { a: '27', b: '29', c: '33', d: '38' }, answer: 'b', topic: 'Arithmetic Progressions' },
            { q_no: 18, question: 'If the perimeter of a square is 40 cm, its area is:', options: { a: '100 cm²', b: '36 cm²', c: '64 cm²', d: '25 cm²' }, answer: 'a', topic: 'Mensuration' },
            { q_no: 19, question: 'Assertion (A): The sum of four odd numbers is even.\nReason (R): Even + Even = Even.', options: { a: 'Both A and R are true, and R is the correct explanation of A', b: 'Both A and R are true, but R is not the correct explanation of A', c: 'A is true, R is false', d: 'A is false, R is true' }, answer: 'a', topic: 'Real Numbers', type: 'Assertion-Reason' },
            { q_no: 20, question: 'If tan θ = 1, then θ is equal to:', options: { a: '30°', b: '45°', c: '60°', d: '90°' }, answer: 'b', topic: 'Introduction to Trigonometry' },
          ],
        },
        {
          section: 'B',
          title: 'Short Answer Questions',
          marks_per_question: 2,
          type: 'Short Answer',
          questions: [
            { q_no: 21, question: 'Solve for x: 5x – 7 = 2x + 8.', answer: 'x = 5', topic: 'Pair of Linear Equations' },
            { q_no: 22, question: 'If the 10th term of an AP is 23 and the first term is 6, find the common difference.', answer: 'd = 2', topic: 'Arithmetic Progressions' },
            { q_no: 23, question: 'Find the LCM of 18 and 24.', answer: '72', topic: 'Real Numbers' },
            { q_no: 24, question: 'Find the roots of the equation x² – 2x – 8 = 0.', answer: 'x = 4, x = –2', topic: 'Quadratic Equations' },
            { q_no: 25, question: 'Simplify: 3√2 + 2√2 – √2.', answer: '4√2', topic: 'Real Numbers' },
            { q_no: 26, question: 'Write the equation of a line passing through the point (2,3) with slope 4.', answer: 'y – 3 = 4(x – 2)', topic: 'Coordinate Geometry' },
            { q_no: 27, question: 'Find the sum of the first six multiples of 7.', answer: '147', topic: 'Arithmetic Progressions' },
            { q_no: 28, question: 'Calculate the probability of drawing a king from a pack of 52 cards.', answer: '1/13', topic: 'Probability' },
            { q_no: 29, question: 'Find the height of an equilateral triangle whose side is 12 cm.', answer: '6√3 cm', topic: 'Triangles' },
            { q_no: 30, question: 'If the circumference of a circle is 44 cm, find its radius.', answer: '7 cm', topic: 'Areas Related to Circles' },
          ],
        },
        {
          section: 'C',
          title: '3-Mark Questions',
          marks_per_question: 3,
          type: 'Short Answer',
          questions: [
            { q_no: 31, question: 'If in a △ABC, DE || BC where D and E are points on AB and AC, respectively, prove that AD/DB = AE/EC.', answer: 'By Basic Proportionality Theorem, since DE || BC and D, E are points on AB and AC respectively, we have AD/DB = AE/EC.', topic: 'Triangles' },
            { q_no: 32, question: 'Construct a pair of tangents from an external point 5 cm away from the center of a circle of radius 3 cm (describe the steps only).', answer: 'Draw a circle of radius 3 cm, mark a point 5 cm from its center. Join the center and external point, construct perpendicular bisector, draw circle with half distance as radius, mark points of contact, join to external point to get tangents.', topic: 'Constructions' },
            { q_no: 33, question: 'A cylinder has a radius of 7 cm and height 15 cm. Find its curved surface area.', answer: 'Curved surface area = 2πrh = 2 × 22/7 × 7 × 15 = 660 cm²', topic: 'Surface Areas and Volumes' },
            { q_no: 34, question: 'The mean of five numbers is 18. If one number is excluded, the mean of the remaining four numbers becomes 16. Find the excluded number.', answer: 'Sum of five numbers = 5 × 18 = 90; Sum of four numbers = 4 × 16 = 64; Excluded number = 90 – 64 = 26', topic: 'Statistics' },
            { q_no: 35, question: 'A triangle has sides 7 cm, 24 cm, and 25 cm. Is the triangle a right triangle? Give reason.', answer: 'Since 7² + 24² = 49 + 576 = 625 and 25² = 625, by converse of Pythagoras Theorem, yes, it is a right triangle.', topic: 'Triangles' },
            { q_no: 36, question: 'A bag contains 3 white, 5 red, and 2 blue balls. If one ball is drawn at random, find the probability that it is not blue.', answer: 'Number of balls not blue = 3 + 5 = 8; Total balls = 10; Probability = 8/10 = 4/5', topic: 'Probability' },
            { q_no: 37, question: 'Solve: x² – x – 12 = 0 by factorization.', answer: 'x² – x – 12 = 0 => (x – 4)(x + 3) = 0 => x = 4, x = –3', topic: 'Quadratic Equations' },
            { q_no: 38, question: 'Let A(–3,2), B(5,2) and C(–1,–2) be the vertices of a triangle. Find its area.', answer: 'Area = 1/2 |–3(2+2) + 5(–2–2) + (–1)(2–2)| = 16 sq. units', topic: 'Coordinate Geometry' },
            { q_no: 39, question: 'In the given AP: 5, 8, 11, ... Which term is 50?', answer: 'nth term: a + (n–1)d = 5 + (n–1)×3 = 50 => n = 16. So 50 is the 16th term.', topic: 'Arithmetic Progressions' },
            { q_no: 40, question: 'If sec θ = 13/12, find tan θ.', answer: 'tan θ = √(sec²θ – 1) = √((169/144) – 1) = √(25/144) = 5/12', topic: 'Introduction to Trigonometry' },
          ],
        },
        {
          section: 'D',
          title: 'Case Study / Source-Based Questions',
          marks_per_question: null,
          type: 'Case Study',
          questions: [
            {
              q_no: 41,
              context: 'A garden is in the form of a rectangle whose length is 15 m more than its width. The owner decides to increase the width by 5 m and decrease the length by 10 m, keeping the area the same as before.',
              topic: 'Quadratic Equations',
              sub_questions: [
                { part: 'a', marks: 2, question: 'What is the width of the original garden?', answer: 'Width = 10 m' },
                { part: 'b', marks: 2, question: 'Find the dimensions of the changed garden.', answer: 'New width = 15 m, new length = 15 m' },
              ],
            },
            {
              q_no: 42,
              context: 'Rahul wants to frame a square photo. The area of the photo is 144 cm². The width of the frame is 2 cm all around the photo.',
              topic: 'Mensuration',
              sub_questions: [
                { part: 'a', marks: 2, question: 'What is the length of the side of the photo?', answer: '12 cm' },
                { part: 'b', marks: 2, question: 'What is the area of the frame (excluding the photo)?', answer: 'Outer square = (12+4)² = 256 cm²; Area of frame = 256 – 144 = 112 cm²' },
              ],
            },
          ],
        },
        {
          section: 'E',
          title: 'Long Answer Questions',
          marks_per_question: 5,
          type: 'Long Answer',
          questions: [
            { q_no: 43, question: 'A tent is in the form of a cylinder with a hemispherical top. The radius of the base is 7 m and the height of the cylindrical part is 9 m. Calculate the total surface area of the tent, and also find how much canvas would be required to make such a tent if 2 sq. m. extra is used for stitching. Write all steps clearly.', answer: 'Curved surface area of cylinder = 2πrh = 2 × 22/7 × 7 × 9 = 396 m²; Surface area of hemisphere = 2πr² = 2 × 22/7 × 7 × 7 = 308 m²; Total = 396 + 308 = 704 m²; Total canvas = 704 + 2 = 706 m²', topic: 'Surface Areas and Volumes' },
            { q_no: 44, question: 'A company employed 50 workers for completing a project in 18 days. After 6 days, 15 more workers joined. How many days did they actually take to finish the work? Explain your answer with proper reasoning and calculations.', answer: 'Work done in 6 days = 50 × 6 = 300 worker-days; Total work = 50 × 18 = 900 worker-days; Work left = 600 worker-days; 65 workers complete it in 600/65 ≈ 9.23 days; Total ≈ 16 days', topic: 'Arithmetic Progressions' },
          ],
        },
      ],
    },
    {
      year: 2024,
      title: 'CBSE Class 10 Mathematics (Basic)',
      set: '430/1/1',
      time_allowed: '3 Hours',
      maximum_marks: 80,
      general_instructions: [
        'Q. No. 1 to 20 are Multiple Choice Questions of 1 mark each.',
        'Q. No. 21 to 25 are Very Short Answer Questions of 2 marks each.',
        'Q. No. 26 to 31 are Short Answer Questions of 3 marks each.',
        'Q. No. 32 to 35 are Long Answer Questions of 5 marks each.',
        'Q. No. 36 to 38 are Case-Based Questions of 4 marks each.',
      ],
      sections: [
        {
          section: 'A',
          title: 'Multiple Choice Questions',
          marks_per_question: 1,
          type: 'MCQ',
          questions: [
            { q_no: 1, question: 'For what value of k, the product of zeroes of the polynomial 7kx² – 4x – 7k is 2?', options: { a: '-1/14', b: '-7/2', c: '7/2', d: '-2/7' }, answer: 'b', topic: 'Polynomials' },
            { q_no: 2, question: 'In an A.P., if a = 8 and a₁₀ = -19, then value of d is:', options: { a: '3', b: '-11/9', c: '-27/10', d: '-3' }, answer: 'd', topic: 'Arithmetic Progressions' },
            { q_no: 3, question: 'The mid-point of the line segment joining the points (−1, 3) and (8, 3/2) is:', options: { a: '(7/2, -3/4)', b: '(7/2, 9/2)', c: '(9/2, -3/4)', d: '(7/2, 9/4)' }, answer: 'd', topic: 'Coordinate Geometry' },
            { q_no: 4, question: 'If sin θ = 1/3, then sec θ is equal to:', options: { a: '2√2/3', b: '3/(2√2)', c: '3', d: '1/√3' }, answer: 'b', topic: 'Introduction to Trigonometry' },
            { q_no: 5, question: 'HCF (132, 77) is:', options: { a: '11', b: '77', c: '22', d: '44' }, answer: 'a', topic: 'Real Numbers' },
            { q_no: 6, question: 'If the roots of quadratic equation 4x² – 5x + k = 0 are real and equal, then value of k is:', options: { a: '5/4', b: '25/16', c: '-5/4', d: '25/16' }, answer: 'b', topic: 'Quadratic Equations' },
            { q_no: 7, question: 'If probability of winning a game is p, then probability of losing the game is:', options: { a: '1 + p', b: '–p', c: 'p – 1', d: '1 – p' }, answer: 'd', topic: 'Probability' },
            { q_no: 8, question: 'The distance between the points (2, −3) and (−2, 3) is:', options: { a: '2√13 units', b: '5 units', c: '13√2 units', d: '10 units' }, answer: 'a', topic: 'Coordinate Geometry' },
            { q_no: 9, question: 'For what value of θ, sin²θ + sin⁸θ + cos²θ is equal to 2?', options: { a: '45°', b: '0°', c: '90°', d: '30°' }, answer: 'c', topic: 'Introduction to Trigonometry' },
            { q_no: 10, question: 'A card is drawn from a well shuffled deck of 52 playing cards. The probability that drawn card is a red queen, is:', options: { a: '1/13', b: '2/13', c: '1/52', d: '1/26' }, answer: 'd', topic: 'Probability' },
            { q_no: 11, question: 'If a certain variable x divides a statistical data arranged in order into two equal parts; then the value of x is called the:', options: { a: 'mean', b: 'median', c: 'mode', d: 'range of the data' }, answer: 'b', topic: 'Statistics' },
            { q_no: 12, question: 'The radius of a sphere is 7/2 cm. The volume of the sphere is:', options: { a: '231/3 cu cm', b: '539/12 cu cm', c: '539/3 cu cm', d: '154 cu cm' }, answer: 'c', topic: 'Surface Areas and Volumes' },
            { q_no: 13, question: 'The mean and median of a statistical data are 21 and 23 respectively. The mode of the data is:', options: { a: '27', b: '22', c: '17', d: '23' }, answer: 'a', topic: 'Statistics' },
            { q_no: 14, question: 'The height and radius of a right circular cone are 24 cm and 7 cm respectively. The slant height of the cone is:', options: { a: '24 cm', b: '31 cm', c: '26 cm', d: '25 cm' }, answer: 'd', topic: 'Surface Areas and Volumes' },
            { q_no: 15, question: 'If one of the zeroes of the quadratic polynomial (α–1)x² + αx + 1 is –3, then the value of α is:', options: { a: '-2/3', b: '2/3', c: '4/3', d: '3/4' }, answer: 'c', topic: 'Polynomials' },
            { q_no: 16, question: 'The diameter of a circle is of length 6 cm. If one end of the diameter is (−4, 0), the other end on x-axis is at:', options: { a: '(0, 2)', b: '(6, 0)', c: '(2, 0)', d: '(4, 0)' }, answer: 'c', topic: 'Coordinate Geometry' },
            { q_no: 17, question: 'The value of k for which the pair of linear equations 5x + 2y – 7 = 0 and 2x + ky + 1 = 0 do not have a solution, is:', options: { a: '5', b: '4/5', c: '5/4', d: '5/2' }, answer: 'b', topic: 'Pair of Linear Equations' },
            { q_no: 18, question: 'Two dice are rolled together. The probability of getting a doublet is:', options: { a: '2/36', b: '1/36', c: '1/6', d: '5/6' }, answer: 'c', topic: 'Probability' },
            { q_no: 19, question: 'Assertion (A): If PA and PB are tangents drawn to a circle with centre O from an external point P, then the quadrilateral OAPB is a cyclic quadrilateral.\nReason (R): In a cyclic quadrilateral, opposite angles are equal.', options: { a: 'Both A and R are true. R explains A completely.', b: 'Both A and R are true. R does not explain A.', c: 'A is true but R is false.', d: 'A is false but R is true.' }, answer: 'c', topic: 'Circles', type: 'Assertion-Reason' },
            { q_no: 20, question: 'Assertion (A): Zeroes of a polynomial p(x) = x² – 2x – 3 are –1 and 3.\nReason (R): The graph of polynomial p(x) = x² – 2x – 3 intersects x-axis at (–1, 0) and (3, 0).', options: { a: 'Both A and R are true. R explains A completely.', b: 'Both A and R are true. R does not explain A.', c: 'A is true but R is false.', d: 'A is false but R is true.' }, answer: 'a', topic: 'Polynomials', type: 'Assertion-Reason' },
          ],
        },
        {
          section: 'B',
          title: 'Very Short Answer Questions',
          marks_per_question: 2,
          type: 'Short Answer',
          questions: [
            { q_no: 21, question: 'D is a point on the side BC of △ABC such that ∠ADC = ∠BAC. Show that AC² = BC × DC.', answer: 'By AA similarity, △BAC ~ △ADC. Therefore AC/DC = BC/AC, which gives AC² = BC × DC.', topic: 'Triangles' },
            { q_no: 22, question: 'Solve the following pair of linear equations for x and y algebraically: x + 2y = 9 and y – 2x = 2.', answer: 'x = 1, y = 4', topic: 'Pair of Linear Equations' },
            { q_no: 23, question: 'Prove that 6 – 4√5 is an irrational number, given that √5 is an irrational number.', answer: 'Assume 6 – 4√5 is rational = a. Then √5 = (6–a)/4, which is rational. Contradiction since √5 is irrational. Hence 6 – 4√5 is irrational.', topic: 'Real Numbers' },
            { q_no: 24, question: 'Evaluate: sin A cos B + cos A sin B; if A = 30° and B = 45°.', answer: '(1+√3) / (2√2)', topic: 'Introduction to Trigonometry' },
            { q_no: 25, question: 'A bag contains 4 red, 5 white and some yellow balls. If probability of drawing a red ball at random is 1/5, then find the probability of drawing a yellow ball at random.', answer: 'Total balls = 20; Yellow balls = 11; P(yellow) = 11/20', topic: 'Probability' },
          ],
        },
        {
          section: 'C',
          title: 'Short Answer Questions',
          marks_per_question: 3,
          type: 'Short Answer',
          questions: [
            { q_no: 26, question: 'Two alarm clocks ring their alarms at regular intervals of 20 minutes and 25 minutes respectively. If they first beep together at 12 noon, at what time will they beep again together next time?', answer: 'LCM(20,25) = 100 minutes = 1 hour 40 minutes. Next time = 1:40 PM', topic: 'Real Numbers' },
            { q_no: 27, question: 'The greater of two supplementary angles exceeds the smaller by 18°. Find measures of these two angles.', answer: 'Let smaller angle = x. Then x + (x+18) = 180 => x = 81°. Angles are 81° and 99°.', topic: 'Pair of Linear Equations' },
            { q_no: 28, question: 'Find the co-ordinates of the points of trisection of the line segment joining the points (−2, 2) and (7, −4).', answer: 'P = (1, 0) and Q = (4, –2)', topic: 'Coordinate Geometry' },
            { q_no: 29, question: 'In two concentric circles, the radii are OA = r cm and OQ = 6 cm. Chord CD of larger circle is a tangent to smaller circle at Q. PA is tangent to larger circle. If PA = 16 cm and OP = 20 cm, find the length CD.', answer: 'r = 12 cm; DQ = 6√3 cm; CD = 12√3 cm', topic: 'Circles' },
            { q_no: 30, question: 'A solid is in the form of a cylinder with hemispherical ends of same radii. The total height of the solid is 20 cm and the diameter of the cylinder is 14 cm. Find the surface area of the solid.', answer: 'r = 7 cm; height of cylinder = 6 cm; Surface area = 2πr(h + 2r) = 880 cm²', topic: 'Surface Areas and Volumes' },
            { q_no: 31, question: 'Prove that: (cot θ – csc θ)² = (1 – cos θ)/(1 + cos θ)', answer: 'LHS = (cos θ/sin θ – 1/sin θ)² = ((cos θ–1)/sin θ)² = (1–cos θ)/(1+cos θ) = RHS', topic: 'Introduction to Trigonometry' },
          ],
        },
        {
          section: 'D',
          title: 'Long Answer Questions',
          marks_per_question: 5,
          type: 'Long Answer',
          questions: [
            { q_no: 32, question: 'If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, then prove that other two sides are divided in the same ratio.', answer: 'In △ABC, DE || BC. Join BE and DC. Draw DM ⊥ AC and EN ⊥ AB. ar(△ADE)/ar(△BDE) = AD/DB and ar(△ADE)/ar(△CDE) = AE/EC. Since △BDE = △CDE (same base, same parallels), AD/DB = AE/EC.', topic: 'Triangles' },
            { q_no: 33, question: 'How many terms of the A.P. 27, 24, 21, … must be taken so that their sum is 105? Which term of the A.P. is zero?', answer: 'd = –3. Using Sn = n/2[2a + (n–1)d]: 105 = n/2[54 + (n–1)(–3)] => n = 5 or n = 14. For zero term: 27 + (n–1)(–3) = 0 => n = 10.', topic: 'Arithmetic Progressions' },
            { q_no: 34, question: 'The shadow of a tower standing on a level ground is found to be 40 m longer when the Sun\'s altitude is 30° than when it was 60°. Find the height of the tower and the length of original shadow. (use √3 = 1.73)', answer: 'h = 20√3 ≈ 34.6 m; original shadow = 20 m.', topic: 'Some Applications of Trigonometry' },
            { q_no: 35, question: 'A chord of a circle of radius 14 cm subtends an angle of 90° at the centre. Find the area of the corresponding minor and major segments of the circle.', answer: 'Area of minor segment = 154 – 98 = 56 sq.cm. Area of major segment = 616 – 56 = 560 sq.cm.', topic: 'Areas Related to Circles' },
          ],
        },
        {
          section: 'E',
          title: 'Case-Based Questions',
          marks_per_question: 4,
          type: 'Case Study',
          questions: [
            {
              q_no: 36,
              context: 'Two circles touch externally. The sum of their areas is 130π sq m and the distance between their centres is 14 m.',
              topic: 'Quadratic Equations',
              sub_questions: [
                { part: 'i', marks: 1, question: 'Obtain a quadratic equation involving R and r from above.', answer: 'R² + r² = 130' },
                { part: 'ii', marks: 1, question: 'Write a quadratic equation involving only r.', answer: 'r² – 14r + 33 = 0' },
                { part: 'iii', marks: 2, question: 'Find the radius r and the corresponding area irrigated.', answer: 'r = 3 m; Area = 9π m²' },
              ],
            },
            {
              q_no: 37,
              context: 'Gurpreet collected some leaves from different plants and measured their lengths in mm. Data: 70–80: 3, 80–90: 5, 90–100: 9, 100–110: 12, 110–120: 5, 120–130: 4, 130–140: 2',
              topic: 'Statistics',
              sub_questions: [
                { part: 'i', marks: 1, question: 'Write the median class of the data.', answer: '100 – 110' },
                { part: 'ii', marks: 1, question: 'How many leaves are of length equal to or more than 10 cm?', answer: '23 leaves' },
                { part: 'iii', marks: 2, question: 'Find median of the data.', answer: 'Median = 102.5 mm' },
              ],
            },
            {
              q_no: 38,
              context: 'A circular mirror is hanging on the wall with a cord. AP and AQ are tangents to the circle with centre O at P and Q respectively such that AP = 30 cm and ∠PAQ = 60°.',
              topic: 'Circles',
              sub_questions: [
                { part: 'i', marks: 1, question: 'Find the length PQ.', answer: 'PQ = 30 cm' },
                { part: 'ii', marks: 1, question: 'Find m∠POQ.', answer: '∠POQ = 120°' },
                { part: 'iii', marks: 2, question: 'Find the length OA.', answer: 'OA = 20√3 cm' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function getPastPaper(board: string, cls: string, subject: string, year: number): PastPaper | null {
  const index = [CBSE_10_MATHS].find(
    p => p.board === board && p.cls === cls && p.subject === subject
  );
  return index?.papers.find(p => p.year === year) ?? null;
}

export function hasPastPaper(board: string, cls: string, subject: string, year: number): boolean {
  return getPastPaper(board, cls, subject, year) !== null;
}
