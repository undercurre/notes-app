import NotesView from "./view";
import NotesAPI from "./api";

import { v4 as uuidv4 } from "uuid";

export default class App {
  public notes: Note[];
  public activeNote: Note | null;
  public view: NotesView;

  constructor(root: HTMLElement) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers(), this.notes);

    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();

    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  _setNotes(notes: Note[]) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  _setActiveNote(note: Note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers() {
    return {
      onNoteSelect: (noteId: string) => {
        const selectedNote = this.notes.find(
          (note: Note) => note.id === noteId
        );
        if (selectedNote) this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          id: uuidv4(),
          title: "新建笔记",
          content: "开始记录...",
          updated_time: new Date().toISOString(),
        };

        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title: string, content: string) => {
        console.log("edit", this.activeNote);
        if (this.activeNote) {
          NotesAPI.saveNote({
            id: this.activeNote.id,
            title,
            content,
            updated_time: new Date().toISOString(),
          });

          this._refreshNotes();
        }
      },
      onNoteDelete: (noteId: string) => {
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
      },
    };
  }
}
