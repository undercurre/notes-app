import AddButton from "./addButton/AddButton";
import NotesAPI from "./api";
import EditPanel from "./editPanel/EditPanel";
import ExportButton from "./exportButton/exportButton";
import ImportButton from "./importButton/importButton";
import Sidebar from "./sidebar/Sidebar";
import { v4 as uuidv4 } from "uuid";

export default class NotesView {
  public root: HTMLElement;
  public activeNote: Note | null;
  public sidebar?: Sidebar;
  public addButton?: AddButton;
  public editPanel?: EditPanel;
  public importButton?: ImportButton;
  public exportButton?: ExportButton;
  public notes: Note[];

  constructor(root: HTMLElement) {
    this.root = root;
    this.notes = NotesAPI.getAllNotes();
    this.activeNote = null;
    const trans = this.notes.map((item) => {
      return {
        id: item.id,
        title: item.title,
        description: item.content,
        date: item.updated_time,
      };
    });
    const sideContainer = root.querySelector(".notes__sidebar");
    if (sideContainer && sideContainer instanceof HTMLElement)
      this.sidebar = new Sidebar(sideContainer, this._sidebarhandlers(), trans);
    const panelContainer = root.querySelector(".notes__preview");
    if (
      panelContainer &&
      panelContainer instanceof HTMLElement &&
      this.notes.length > 0
    ) {
      const selected = this.notes[0];
      this.activeNote = selected;
      this.editPanel = new EditPanel(panelContainer, this._editPanelHandlers());
      this.editPanel.refill(selected.title, selected.content);
    }
    const addButtonContainer = root.querySelector(".add_button_container");
    if (addButtonContainer && addButtonContainer instanceof HTMLElement)
      this.addButton = new AddButton(
        addButtonContainer,
        this._addButtonHandlers()
      );
    const importButtonContainer = root.querySelector(
      ".import_button_container"
    );
    if (importButtonContainer && importButtonContainer instanceof HTMLElement)
      this.importButton = new ImportButton(
        importButtonContainer,
        this._addButtonHandlers()
      );
    const exportButtonContainer = root.querySelector(
      ".export_button_container"
    );
    if (exportButtonContainer && exportButtonContainer instanceof HTMLElement)
      this.exportButton = new ExportButton(
        exportButtonContainer,
        this._addButtonHandlers()
      );
  }

  _sidebarhandlers() {
    return {
      onSelect: (id: string) => {
        const selected = this.notes.find((item) => item.id === id);
        if (selected && this.editPanel) {
          this.activeNote = selected;
          this.editPanel.refill(selected.title, selected.content);
        }
      },
      onDelete: async (id: string) => {
        NotesAPI.deleteNote(id);
        this._refresh();
      },
    };
  }

  _editPanelHandlers() {
    return {
      onEdit: async (title: string, content: string) => {
        if (this.activeNote && this.sidebar) {
          NotesAPI.saveNote({
            id: this.activeNote.id,
            title,
            content,
            updated_time: new Date().toISOString(),
          });
          this._refresh();
          this.sidebar.editListItem({
            id: this.activeNote.id,
            title,
            description: content,
            date: new Date().toISOString(),
          });
        }
      },
    };
  }

  _addButtonHandlers() {
    return {
      onAdd: async () => {
        const newNote = await this._addNote();
        this._refresh();
        if (this.sidebar) {
          this.sidebar.pushListItem({
            id: newNote.id,
            title: newNote.title,
            description: newNote.content,
            date: newNote.updated_time,
          });
        }
        if (this.editPanel) {
          this.editPanel.refill(newNote.title, newNote.content);
        } else {
          const panelContainer = this.root.querySelector(".notes__preview");
          if (
            panelContainer &&
            panelContainer instanceof HTMLElement &&
            this.notes.length > 0
          ) {
            const selected = this.notes[0];
            this.editPanel = new EditPanel(
              panelContainer,
              this._editPanelHandlers()
            );
            this.editPanel.refill(selected.title, selected.content);
          }
        }
      },
    };
  }

  _addNote() {
    const newNote = {
      id: uuidv4(),
      title: "新建笔记",
      content: "开始记录...",
      updated_time: new Date().toISOString(),
    };

    NotesAPI.saveNote(newNote);
    return newNote;
  }

  _refresh() {
    this.notes = NotesAPI.getAllNotes();
  }
}
