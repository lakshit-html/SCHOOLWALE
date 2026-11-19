import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Pin,
  Trash2,
  Search,
  Tag,
  Edit3,
  Check
} from 'lucide-react';
import { Note } from '../../types';

export const NotesView: React.FC = () => {
  const { data, addNote, updateNote, deleteNote, togglePinNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(data.notes[0]?.id || null);

  // New Note / Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubjectId, setEditSubjectId] = useState(data.subjects[0]?.id || '');
  const [editTags, setEditTags] = useState('');

  const subjectsMap = new Map(data.subjects.map(s => [s.id, s]));

  // Active note
  const activeNote = data.notes.find(n => n.id === activeNoteId) || data.notes[0] || null;

  // Filter notes
  const filteredNotes = data.notes.filter(note => {
    if (selectedSubject !== 'all' && note.subjectId !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTag = note.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }
    return true;
  });

  // Sort notes: pinned first, then by updatedAt desc
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleStartNewNote = () => {
    const newTitle = 'Untitled Academic Note';
    const newContent = '# Formulae & Key Points\n\n- Definition:\n- Important Exceptions:\n- PYQ Trap:';
    addNote({
      title: newTitle,
      content: newContent,
      subjectId: selectedSubject !== 'all' ? selectedSubject : data.subjects[0]?.id || '',
      pinned: false,
      tags: ['Revision']
    });
    // Set to new note
    setTimeout(() => {
      const latest = data.notes[0];
      if (latest) {
        setActiveNoteId(latest.id);
        setEditTitle(latest.title);
        setEditContent(latest.content);
        setEditSubjectId(latest.subjectId);
        setEditTags(latest.tags.join(', '));
        setIsEditing(true);
      }
    }, 50);
  };

  const handleOpenEdit = (note: Note) => {
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubjectId(note.subjectId);
    setEditTags(note.tags.join(', '));
    setIsEditing(true);
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
      tags: tagArray
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-brand-400" />
            Academic Notes & Formula Vault
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Store high-yield summary sheets, named reactions, derivations, and quick revision flashcards.
          </p>
        </div>

        <button
          onClick={handleStartNewNote}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Two-Column Master/Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Column: Search & Notes List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Search & Subject Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All</option>
              {data.subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[640px]">
            {sortedNotes.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                <p className="text-xs text-slate-500">No notes found.</p>
              </div>
            ) : (
              sortedNotes.map(note => {
                const isSelected = activeNote?.id === note.id;
                const subject = subjectsMap.get(note.subjectId);

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setIsEditing(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-brand-500 shadow-md ring-1 ring-brand-500/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {note.pinned && (
                          <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                        <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                          {note.title}
                        </h4>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          togglePinNote(note.id);
                        }}
                        className="text-slate-500 hover:text-amber-400 p-1"
                        title={note.pinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {note.content.replace(/^[#\s*_-]+/gm, '')}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-[11px]">
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

                      <span className="text-slate-500 font-mono">
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
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          {activeNote ? (
            isEditing ? (
              /* Edit Mode */
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white">Edit Academic Note</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Note
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Subject</label>
                    <select
                      value={editSubjectId}
                      onChange={e => setEditSubjectId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      {data.subjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="e.g. Formulae, Organic, Exceptions"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="text-xs text-slate-400 mb-1 block">Content (Markdown supported)</label>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={12}
                    className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex flex-col h-full justify-between space-y-4">
                <div>
                  {/* Top Bar in Note Detail */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
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
                        {activeNote.pinned && (
                          <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                            <Pin className="w-3 h-3 fill-amber-300" /> Pinned
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono">
                          Last modified: {new Date(activeNote.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{activeNote.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(activeNote)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => deleteNote(activeNote.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {activeNote.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <Tag className="w-3 h-3 text-slate-500" />
                      {activeNote.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content viewer */}
                  <div className="mt-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    {activeNote.content}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="p-12 text-center text-slate-500">Select or create a note</div>
          )}
        </div>
      </div>
    </div>
  );
};
