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

declare type ImportData = Omit<Note, "id">;

declare type NotesView = {
  root: HTMLElement;
  handlers: {
    onNoteSelect: (noteId: string) => void;
    onNoteAdd: () => void;
    onNoteEdit: (title: string, content: string) => void;
    onNoteDelete: (noteId: string) => void;
  };
};

declare type SliderbarItem = {
  root: HTMLElement;
  data: SliderbarItemData;
  handlers: {
    onAdd: (listItem: SliderbarItemData) => Promise<void>;
    onSelect: (noteId: string) => void;
    onDelete: (noteId: string) => Promise<void>;
  };
};

declare type SliderbarItemData = {
  id: string;
  title: string;
  description: string;
  date: string;
};

declare type EditPanelData = {
  id: string;
  title: string;
  content: string;
};
