import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  NCERT_BOOKS,
  NCERTBook,
  NCERTChapter
} from '../../services/ncertData';
import { MathFormula } from '../common/MathFormula';
import {
  BookOpen,
  Search,
  ExternalLink,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Presentation,
  Gamepad2,
  Bookmark,
  BookMarked
} from 'lucide-react';

export const NCERTBooksView: React.FC = () => {
  const { setActiveTab, setWhiteboardNote, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [activeModalChapter, setActiveModalChapter] = useState<{ book: NCERTBook; chapter: NCERTChapter } | null>(null);

  const classes = ['All', 'Class 12', 'Class 11', 'Class 10', 'Class 9'];
  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Science', 'Social Science'];

  // Filter books
  const filteredBooks = NCERT_BOOKS.filter(book => {
    const matchesClass = selectedClass === 'All' || book.classLevel === selectedClass;
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    const matchesQuery =
      searchQuery.trim() === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.chapters.some(
        ch =>
          ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesClass && matchesSubject && matchesQuery;
  });

  const handlePracticeQuiz = () => {
    setActiveTab('arena');
  };

  const handleAnnotateChapter = (book: NCERTBook, ch: NCERTChapter) => {
    setWhiteboardNote({
      title: ch.title,
      bookTitle: book.title,
      chapterNumber: ch.chapterNumber,
      formulas: ch.keyFormulas || [],
      points: ch.highYieldPoints || []
    });
    showToast?.(`Loaded "${ch.title}" formulas into Whiteboard!`, 'success');
    setActiveTab('whiteboard');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl shadow-teal-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <BookMarked className="w-3.5 h-3.5 text-amber-300" />
            <span>Official NCERT Digital Library — ncert.nic.in</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            NCERT Textbooks & Chapter Formulas
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-teal-100 leading-relaxed">
            Instant access to all official textbooks for Class 9, 10, 11 &amp; 12. Read official chapter PDFs, study key formulas, and launch dynamic practice quizzes directly.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="https://ncert.nic.in/textbook.php"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Visit ncert.nic.in Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setActiveTab('arena')}
              className="px-4 py-2 bg-teal-800/60 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch NCERT Quiz Arena</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search NCERT books, chapters (e.g. Electric Charges, Solutions, Matrices, Laws of Motion)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Class Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> Class:
          </span>
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedClass === cls
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Subject:
          </span>
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedSubject === sub
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Book Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
          >
            {/* Book Card Header */}
            <div
              className="p-4 sm:p-5 text-white flex items-center justify-between"
              style={{ backgroundColor: book.coverColor }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                    {book.classLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-medium">
                    {book.subject}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold">{book.title}</h3>
                <p className="text-[11px] text-white/80 font-mono">
                  Official Code: {book.code} &bull; {book.chapters.length} Chapters
                </p>
              </div>

              <a
                href={book.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in NCERT Official Portal"
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Chapters List */}
            <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800/80 flex-1 space-y-2">
              {book.chapters.map(ch => {
                const isExpanded = expandedChapterId === ch.id;
                return (
                  <div key={ch.id} className="pt-2 first:pt-0">
                    <div className="flex items-start justify-between gap-3 py-1.5">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {ch.chapterNumber}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {ch.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {ch.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setExpandedChapterId(isExpanded ? null : ch.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                          title="Toggle formulas & notes"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={ch.pdfUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          referrerPolicy="no-referrer"
                          className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                          title="Open official NCERT textbook PDF"
                        >
                          <span>PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={ch.portalUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          referrerPolicy="no-referrer"
                          className="hidden sm:flex px-2 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-[11px] font-bold rounded-lg transition-colors items-center gap-1"
                          title="Open on official NCERT Web Portal"
                        >
                          <span>Web</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Expandable formulas & notes */}
                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 animate-fade-in text-xs">
                        {ch.keyFormulas && ch.keyFormulas.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                              Key NCERT Formulae:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {ch.keyFormulas.map((form, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px]"
                                >
                                  <MathFormula text={`$${form}$`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            High-Yield Exam Points:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                            {ch.highYieldPoints.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-slate-800">
                          <button
                            onClick={handlePracticeQuiz}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <Gamepad2 className="w-3 h-3" />
                            <span>Practice Quiz</span>
                          </button>
                          <button
                            onClick={() => handleAnnotateChapter(book, ch)}
                            className="px-3 py-1 bg-teal-600/10 hover:bg-teal-600/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <Presentation className="w-3 h-3" />
                            <span>Annotate in Whiteboard</span>
                          </button>
                          <button
                            onClick={() => setActiveModalChapter({ book, chapter: ch })}
                            className="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1 ml-auto"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Quick Reader</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeModalChapter && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  {activeModalChapter.book.title} &bull; Chapter {activeModalChapter.chapter.chapterNumber}
                </span>
                <h3 className="text-base sm:text-lg font-bold mt-1">
                  {activeModalChapter.chapter.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeModalChapter.chapter.pdfUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  referrerPolicy="no-referrer"
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Open Official PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={activeModalChapter.chapter.portalUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  referrerPolicy="no-referrer"
                  className="px-3 py-1.5 bg-black/20 hover:bg-black/30 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setActiveModalChapter(null)}
                  className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Chapter Synopsis &amp; NCERT Syllabus
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeModalChapter.chapter.summary}
                </p>
                {activeModalChapter.chapter.detailedTheory && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <MathFormula text={activeModalChapter.chapter.detailedTheory} />
                  </p>
                )}
              </div>

              {activeModalChapter.chapter.keyFormulas && activeModalChapter.chapter.keyFormulas.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Core NCERT Equations &amp; Formulas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {activeModalChapter.chapter.keyFormulas.map((form, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-mono text-xs sm:text-sm"
                      >
                        <MathFormula text={`$${form}$`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <h4 className="text-xs uppercase font-bold text-amber-700 dark:text-amber-300 tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" /> NCERT High-Yield Exam Takeaways
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                  {activeModalChapter.chapter.highYieldPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleAnnotateChapter(activeModalChapter.book, activeModalChapter.chapter);
                      setActiveModalChapter(null);
                    }}
                    className="px-4 py-2 bg-teal-600/20 hover:bg-teal-600/30 text-teal-700 dark:text-teal-300 border border-teal-500/30 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Presentation className="w-4 h-4" />
                    <span>Annotate in Whiteboard</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setActiveModalChapter(null);
                    setActiveTab('arena');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Start Live Quiz on this Chapter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
