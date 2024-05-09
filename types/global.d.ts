declare interface NotesAPI {
  getAllNotes: () => Note[];
  saveNote: (note: Note) => void;
  deleteNote: (id: string) => void;
}

declare type Note = {
  id: string;
  title: string;
  content: string;
  updated_time: string;
};

declare type NotesView = {
  root: HTMLElement;
  handlers: {
    onNoteSelect: (noteId: string) => void;
    onNoteAdd: () => void;
    onNoteEdit: (title: string, content: string) => void;
    onNoteDelete: (noteId: string) => void;
  };
};
