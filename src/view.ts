import NotesAPI from "./api";
import Sidebar from "./sidebar/Sidebar";

export default class NotesView {
  public root: HTMLElement;
  public activeNote: Note | null;
  public sidebar: Sidebar;
  public notes: Note[];

  constructor(
    root: HTMLElement
  ) {
    this.root = root;
    this.notes = NotesAPI.getAllNotes();
    this.activeNote = null;
    const trans = this.notes.map((item) => {
      return {
        id: item.id,
        title: item.title,
        description: item.content,
      };
    });
    this.sidebar = new Sidebar(root, this._sidebarhandlers, trans);
  }
  

  _sidebarhandlers() {
   return {
    onAdd: () => void,
    onSelect: (id: string) => {
      const selected = this.notes.find((item) => item.id === id)
      if (selected) this.activeNote = selected
    },
    onDelete: async (id: string) => {
      await this.handlers.onNoteDelete(id);
    }
   } 
  }
}
