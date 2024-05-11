import AddButton from "./addButton/AddButton";
import NotesAPI from "./api";
import EditPanel from "./editPanel/EditPanel";
import ExportButton from "./exportButton/exportButton";
import ImportButton from "./importButton/importButton";
import Sidebar from "./sidebar/Sidebar";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";

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
        this._importButtonHandlers()
      );
    const exportButtonContainer = root.querySelector(
      ".export_button_container"
    );
    if (exportButtonContainer && exportButtonContainer instanceof HTMLElement)
      this.exportButton = new ExportButton(
        exportButtonContainer,
        this._exportButtonHandlers()
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

  _importButtonHandlers() {
    return {
      onImport: async () => {
        let that = this;
        const inputFile = document.getElementById("excelFile");
        if (inputFile && inputFile instanceof HTMLInputElement) {
          if (inputFile.files && inputFile.files.length > 0) {
            const file = inputFile.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function (e) {
                if (e.target) {
                  const data = e.target.result;
                  const workbook = XLSX.read(data, { type: "array" });
                  const sheetName = workbook.SheetNames[0]; // 取第一个工作表
                  const worksheet = workbook.Sheets[sheetName];
                  const json = XLSX.utils.sheet_to_json(worksheet, {
                    raw: false,
                  }) as ImportData[];
                  const format = json.map((item) => {
                    return {
                      id: uuidv4(),
                      ...item,
                    };
                  });
                  format.map((item) => {
                    NotesAPI.saveNote(item);
                    if (that.sidebar)
                      that.sidebar.pushListItem({
                        id: item.id,
                        title: item.title,
                        description: item.content,
                        date: item.updated_time,
                      });
                  });
                  alert("Notes imported successfully!");
                }
              };
              reader.readAsArrayBuffer(file);
            }
          } else {
            alert("Please select a file first.");
          }
        }
      },
    };
  }

  _exportButtonHandlers() {
    return {
      onExport: async () => {
        const notes = NotesAPI.getAllNotes();
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(notes);
        XLSX.utils.book_append_sheet(wb, ws, "Notes");
        const exportFileName = "NotesData.xlsx";
        XLSX.writeFile(wb, exportFileName);
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
