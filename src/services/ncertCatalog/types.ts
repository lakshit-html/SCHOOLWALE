// NCERT Catalog Core Types

export type NCERTSubject =
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Biology'
  | 'Science'
  | 'Social Science'
  | 'English';

export interface NCERTChapter {
  id: string;
  chapterNumber: number;
  title: string;
  pdfUrl: string;
  portalUrl: string;
  summary: string;
  detailedTheory?: string;
  keyFormulas?: string[];
  highYieldPoints: string[];
}

export interface NCERTBook {
  id: string;
  classLevel: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
  subject: NCERTSubject;
  title: string;
  code: string;
  coverColor: string;
  officialPortalUrl: string;
  chapters: NCERTChapter[];
}
