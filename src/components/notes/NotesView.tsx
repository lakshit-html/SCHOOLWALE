import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Pin,
  Trash2,
  Search,
  Tag,
  Edit3,
  Check,
  Upload,
  FileText,
  File,
  Eye,
  Download,
  X,
  Layers,
  Video,
  FolderPlus
} from 'lucide-react';
import { Note, NoteAttachment } from '../../types';
import { MathFormula } from '../common/MathFormula';
import { blobStorage, compressImageForMobile } from '../../services/blobStorage';

export const NotesView: React.FC = () => {
  const {
    data,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    addChapter,
    addSubject,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(data.notes[0]?.id || null);

  // New Chapter / Subject modal states
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterSubjectId, setNewChapterSubjectId] = useState(data.subjects[0]?.id || '');

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // New Note / Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubjectId, setEditSubjectId] = useState(data.subjects[0]?.id || '');
  const [editChapterId, setEditChapterId] = useState<string>('');
  const [editLectureTitle, setEditLectureTitle] = useState<string>('');
  const [editTags, setEditTags] = useState('');
  const [editAttachments, setEditAttachments] = useState<NoteAttachment[]>([]);

  // Preview modals
  const [previewAttachment, setPreviewAttachment] = useState<NoteAttachment | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const subjectsMap = new Map(data.subjects.map(s => [s.id, s]));
  const chaptersMap = new Map(data.chapters.map(c => [c.id, c]));

  // Active note
  const activeNote = data.notes.find(n => n.id === activeNoteId) || data.notes[0] || null;

  // Filter chapters based on selected subject in editing
  const availableChapters = data.chapters.filter(
    c => !editSubjectId || c.subjectId === editSubjectId
  );

  // Filter notes
  const filteredNotes = data.notes.filter(note => {
    if (selectedSubject !== 'all' && note.subjectId !== selectedSubject) return false;
    if (selectedChapter !== 'all' && note.chapterId !== selectedChapter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchLecture = note.lectureTitle?.toLowerCase().includes(q) || false;
      const matchTag = note.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag && !matchLecture) return false;
    }
    return true;
  });

  // Sort notes: pinned first, then by updatedAt desc
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleStartNewNote = () => {
    const newTitle = 'Untitled Academic Lecture Note';
    const newContent = '# Key Concepts & Derivations\n\n- Lecture Summary:\n- Important Formulae:\n- Common Pitfalls & PYQs:';
    const subId = selectedSubject !== 'all' ? selectedSubject : data.subjects[0]?.id || '';

    addNote({
      title: newTitle,
      content: newContent,
      subjectId: subId,
      chapterId: selectedChapter !== 'all' ? selectedChapter : undefined,
      lectureTitle: 'Lecture 01: Core Principles',
      pinned: false,
      tags: ['Lecture Notes', 'Revision'],
      attachments: []
    });

    setTimeout(() => {
      const latest = data.notes[0];
      if (latest) {
        setActiveNoteId(latest.id);
        setEditTitle(latest.title);
        setEditContent(latest.content);
        setEditSubjectId(latest.subjectId);
        setEditChapterId(latest.chapterId || '');
        setEditLectureTitle(latest.lectureTitle || '');
        setEditTags(latest.tags.join(', '));
        setEditAttachments([]);
        setIsEditing(true);
      }
    }, 50);
  };

  const handleOpenEdit = (note: Note) => {
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubjectId(note.subjectId);
    setEditChapterId(note.chapterId || '');
    setEditLectureTitle(note.lectureTitle || '');
    setEditTags(note.tags.join(', '));
    setEditAttachments(note.attachments || []);
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        // Safe downscale of mobile camera photos to prevent memory crashes
        const dataUrl = await compressImageForMobile(file);
        const newAttachment: NoteAttachment = {
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl,
          uploadedAt: new Date().toISOString()
        };

        // Persist file into IndexedDB for persistent offline storage
        await blobStorage.saveFile(newAttachment.id, dataUrl, newAttachment.name, newAttachment.type);

        setEditAttachments(prev => [...prev, newAttachment]);
        showToast(`Attached ${file.name}`, 'success');
      } catch (err) {
        console.error('File read error:', err);
        showToast(`Failed to load ${file.name}`, 'error');
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (attId: string) => {
    setEditAttachments(prev => prev.filter(a => a.id !== attId));
  };

  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) return;
    addChapter({
      subjectId: newChapterSubjectId || data.subjects[0]?.id || '',
      title: newChapterTitle.trim(),
      totalLectures: 10,
      completedLectures: 0,
      status: 'in_progress',
      priority: 'high',
      difficulty: 'moderate',
      notesCount: 0
    });
    setNewChapterTitle('');
    setShowAddChapterModal(false);
    showToast(`Chapter "${newChapterTitle.trim()}" created!`, 'success');
  };

  const handleCreateSubject = () => {
    if (!newSubjectName.trim()) return;
    addSubject({
      name: newSubjectName.trim(),
      color: '#06b6d4',
      icon: 'BookOpen'
    });
    setNewSubjectName('');
    setShowAddSubjectModal(false);
    showToast(`Subject "${newSubjectName.trim()}" added!`, 'success');
  };

  const handleSaveNote = () => {
    if (!activeNoteId) return;
    const tagArray = editTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    updateNote(activeNoteId, {
      title: editTitle.trim() || 'Untitled Note',
      content: editContent,
      subjectId: editSubjectId,
      chapterId: editChapterId || undefined,
      lectureTitle: editLectureTitle.trim() || undefined,
      tags: tagArray,
      attachments: editAttachments
    });
    setIsEditing(false);
    showToast('Note updated successfully', 'success');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-brand-500" />
            Lecture Notes & Document Vault
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload PDFs, slides, classroom diagrams, and chapter-wise lecture notes from your computer.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddChapterModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
          >
            <FolderPlus className="w-4 h-4 text-teal-500" />
            <span>+ Add Chapter</span>
          </button>

          <button
            onClick={() => setShowAddSubjectModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
          >
            <Layers className="w-4 h-4 text-cyan-500" />
            <span>+ Add Subject</span>
          </button>

          <button
            onClick={handleStartNewNote}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Lecture Note</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Master/Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Search & Notes List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Search & Subject/Chapter Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes, lectures, or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedSubject}
                onChange={e => {
                  setSelectedSubject(e.target.value);
                  setSelectedChapter('all');
                }}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Subjects</option>
                {data.subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedChapter}
                onChange={e => setSelectedChapter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Chapters</option>
                {data.chapters
                  .filter(c => selectedSubject === 'all' || c.subjectId === selectedSubject)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[640px]">
            {sortedNotes.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/40">
                <p className="text-xs text-slate-500">No notes found matching your filters.</p>
              </div>
            ) : (
              sortedNotes.map(note => {
                const isSelected = activeNote?.id === note.id;
                const subject = subjectsMap.get(note.subjectId);
                const chapter = note.chapterId ? chaptersMap.get(note.chapterId) : null;
                const attachmentsCount = note.attachments?.length || 0;

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setIsEditing(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-brand-500 shadow-md ring-1 ring-brand-500/40'
                        : 'bg-white/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {note.pinned && (
                          <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 line-clamp-1">
                          {note.title}
                        </h4>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          togglePinNote(note.id);
                        }}
                        className="text-slate-400 hover:text-amber-500 p-1"
                        title={note.pinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {note.lectureTitle && (
                      <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1 mt-0.5">
                        <Video className="w-3 h-3" />
                        {note.lectureTitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {note.content.replace(/^[#\s*_-]+/gm, '')}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-[11px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {subject && (
                          <span
                            className="font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${subject.color}15`,
                              color: subject.color
                            }}
                          >
                            {subject.name}
                          </span>
                        )}
                        {chapter && (
                          <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[120px]">
                            {chapter.title}
                          </span>
                        )}
                        {attachmentsCount > 0 && (
                          <span className="text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {attachmentsCount} file{attachmentsCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Viewer / Editor (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-lg">
          {activeNote ? (
            isEditing ? (
              /* Edit Mode */
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Edit Lecture Note & Uploads
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow-md shadow-brand-600/20"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Note
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Subject</label>
                    <select
                      value={editSubjectId}
                      onChange={e => setEditSubjectId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      {data.subjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Chapter (Optional)</label>
                    <select
                      value={editChapterId}
                      onChange={e => setEditChapterId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="">-- No Chapter Selected --</option>
                      {availableChapters.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Lecture Title / Number</label>
                    <input
                      type="text"
                      value={editLectureTitle}
                      onChange={e => setEditLectureTitle(e.target.value)}
                      placeholder="e.g. Lecture 03: Resonance & Aromaticity"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Upload Files Section */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-brand-500" />
                      Attached Lecture Files & PDFs
                    </span>
                    <label className="cursor-pointer px-2.5 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm">
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {editAttachments.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-2 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                      No files attached yet. Click above to attach PDFs, problem sheets, or diagrams.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {editAttachments.map(att => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate flex-1 mr-2">
                            <File className="w-4 h-4 text-brand-500 shrink-0" />
                            <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                              {att.name}
                            </span>
                            <span className="text-slate-400 text-[10px] font-mono shrink-0">
                              ({formatFileSize(att.size)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="e.g. Formulae, Organic, Exceptions, PYQs"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Content (Markdown supported)</label>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={8}
                    className="w-full flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-900 dark:text-slate-200 font-mono focus:outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex flex-col h-full justify-between space-y-4">
                <div>
                  {/* Top Bar in Note Detail */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {subjectsMap.get(activeNote.subjectId) && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${subjectsMap.get(activeNote.subjectId)?.color}20`,
                              color: subjectsMap.get(activeNote.subjectId)?.color
                            }}
                          >
                            {subjectsMap.get(activeNote.subjectId)?.name}
                          </span>
                        )}
                        {activeNote.chapterId && chaptersMap.get(activeNote.chapterId) && (
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Layers className="w-3 h-3 text-brand-500" />
                            {chaptersMap.get(activeNote.chapterId)?.title}
                          </span>
                        )}
                        {activeNote.lectureTitle && (
                          <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {activeNote.lectureTitle}
                          </span>
                        )}
                        {activeNote.pinned && (
                          <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                            <Pin className="w-3 h-3 fill-current" /> Pinned
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          Last modified: {new Date(activeNote.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {activeNote.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(activeNote)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => deleteNote(activeNote.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Attached Files List (Lecture PDFs / Images) */}
                  {activeNote.attachments && activeNote.attachments.length > 0 && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-teal-500" />
                        Attached Lecture Materials ({activeNote.attachments.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeNote.attachments.map(att => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                              <File className="w-4 h-4 text-teal-500 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {att.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {formatFileSize(att.size)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => setPreviewAttachment(att)}
                                className="p-1.5 text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-md transition-colors"
                                title="Preview File"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={att.dataUrl}
                                download={att.name}
                                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                title="Download File"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {activeNote.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {activeNote.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content viewer */}
                  <div className="mt-4 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
                    <MathFormula text={activeNote.content} />
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="p-12 text-center text-slate-400">Select or create a note</div>
          )}
        </div>
      </div>

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-teal-500" />
                Add New Chapter
              </h4>
              <button
                onClick={() => setShowAddChapterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Subject</label>
              <select
                value={newChapterSubjectId}
                onChange={e => setNewChapterSubjectId(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                {data.subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Chapter Title</label>
              <input
                type="text"
                placeholder="e.g. Thermodynamics, Kinematics, Equilibrium"
                value={newChapterTitle}
                onChange={e => setNewChapterTitle(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddChapterModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChapter}
                disabled={!newChapterTitle.trim()}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20"
              >
                Create Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-500" />
                Add New Subject / Class Track
              </h4>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Physics - Class 11, Organic Chemistry, Botony"
                value={newSubjectName}
                onChange={e => setNewSubjectName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubject}
                disabled={!newSubjectName.trim()}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal (For PDFs & Images) */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <File className="w-5 h-5 text-brand-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {previewAttachment.name}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewAttachment.dataUrl}
                  download={previewAttachment.name}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[400px]">
              {previewAttachment.type.startsWith('image/') ? (
                <img
                  src={previewAttachment.dataUrl}
                  alt={previewAttachment.name}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
                />
              ) : previewAttachment.type === 'application/pdf' ? (
                <iframe
                  src={previewAttachment.dataUrl}
                  title={previewAttachment.name}
                  className="w-full h-[70vh] rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Preview not directly embedded for this file type.
                  </p>
                  <a
                    href={previewAttachment.dataUrl}
                    download={previewAttachment.name}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
                  >
                    <Download className="w-4 h-4" /> Download {previewAttachment.name}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
