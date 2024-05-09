import { v4 as uuidv4 } from "uuid";

export default class NotesAPI {
  static getAllNotes() {
    const notes: Note[] = JSON.parse(
      localStorage.getItem("notesapp-notes") || "[]"
    );

    return notes.sort((a: Note, b: Note) => {
      return new Date(a.updated_time) > new Date(b.updated_time) ? -1 : 1;
    });
  }

  static saveNote(noteToSave: Note) {
    const notes = NotesAPI.getAllNotes();
    const existing = notes.find((note: Note) => note.id === noteToSave.id);

    // Edit/Update
    if (existing) {
      existing.title = noteToSave.title;
      existing.content = noteToSave.content;
      existing.updated_time = new Date().toISOString();
    } else {
      noteToSave.id = uuidv4();
      noteToSave.updated_time = new Date().toISOString();
      notes.push(noteToSave);
    }

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  }

  static deleteNote(id: string) {
    const notes = NotesAPI.getAllNotes();
    const newNotes = notes.filter((note: Note) => note.id != id);

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  }
}
