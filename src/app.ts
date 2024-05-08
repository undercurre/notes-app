import NotesView from "./view";
import NotesAPI from "./api";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());

    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();

    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers() {
    return {
      onNoteSelect: (noteId) => {
        const selectedNote = this.notes.find((note) => note.id === noteId);
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "新建笔记",
          content: "开始记录...",
        };

        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title, content) => {
        NotesAPI.saveNote({
          id: this.activeNote.id,
          title,
          content,
        });

        this._refreshNotes();
      },
      onNoteDelete: (noteId) => {
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
      },
    };
  }
}