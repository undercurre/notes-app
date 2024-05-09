export default class NotesView {
  public root: HTMLElement;
  public handlers: {
    onNoteSelect: (noteId: string) => void;
    onNoteAdd: () => void;
    onNoteEdit: (title: string, content: string) => void;
    onNoteDelete: (noteId: string) => void;
  };

  constructor(
    root: HTMLElement,
    handlers: {
      onNoteSelect: (noteId: string) => void;
      onNoteAdd: () => void;
      onNoteEdit: (title: string, content: string) => void;
      onNoteDelete: (noteId: string) => void;
    }
  ) {
    this.root = root;
    this.handlers = handlers;
    this.root.innerHTML = `
          <div class="notes__sidebar">
              <button class="notes__add" type="button">添加新的笔记 📒</button>
              <div class="notes__list"></div>
          </div>
          <div class="notes__preview">
              <input class="notes__title" type="text" placeholder="新笔记...">
              <textarea class="notes__body">编辑笔记...</textarea>
          </div>
      `;

    const btnAddNote = this.root.querySelector(".notes__add");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

    if (btnAddNote && inpTitle && inpBody) {
      btnAddNote.addEventListener("click", () => {
        this.handlers.onNoteAdd();
      });

      [inpTitle, inpBody].forEach((inputField) => {
        inputField.addEventListener("blur", () => {
          if (
            inpTitle instanceof HTMLInputElement &&
            inpBody instanceof HTMLTextAreaElement
          ) {
            const updatedTitle = inpTitle.value.trim();
            const updatedBody = inpBody.value.trim();

            this.handlers.onNoteEdit(updatedTitle, updatedBody);
          }
        });
      });

      this.updateNotePreviewVisibility(false);
    }
  }

  _createListItemHTML(note: Note) {
    const MAX_BODY_LENGTH = 60;

    return `
          <div class="notes__list-item" data-note-id="${note.id}">
              <div class="notes__small-title">${note.title}</div>
              <div class="notes__small-content">
                  ${note.content.substring(0, MAX_BODY_LENGTH)}
                  ${note.content.length > MAX_BODY_LENGTH ? "..." : ""}
              </div>
              <div class="notes__small-updated_time">
                  ${new Date(note.updated_time).toLocaleString()}
              </div>
          </div>
      `;
  }

  updateNoteList(notes: Note[]) {
    const notesListContainer = this.root.querySelector(".notes__list");

    // Empty list
    if (notesListContainer instanceof HTMLElement) {
      notesListContainer.innerHTML = "";

      for (const note of notes) {
        const html = this._createListItemHTML(note);

        notesListContainer.insertAdjacentHTML("beforeend", html);
      }

      // Add select/delete events for each list item
      notesListContainer
        .querySelectorAll(".notes__list-item")
        .forEach((noteListItem) => {
          if (noteListItem instanceof HTMLElement) {
            noteListItem.addEventListener("click", () => {
              if (noteListItem.dataset.noteId)
                this.handlers.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
              const doDelete = confirm("确认要删除该笔记吗?");

              if (doDelete) {
                if (noteListItem.dataset.noteId)
                  this.handlers.onNoteDelete(noteListItem.dataset.noteId);
              }
            });
          }
        });
    }
  }

  updateActiveNote(note: Note) {
    const title = this.root.querySelector(".notes__title");
    const content = this.root.querySelector(".notes__body");
    if (
      title &&
      content &&
      title instanceof HTMLInputElement &&
      content instanceof HTMLTextAreaElement
    ) {
      title.value = note.title;
      content.value = note.content;
    }

    this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
      noteListItem.classList.remove("notes__list-item--selected");
    });

    const select = this.root.querySelector(
      `.notes__list-item[data-note-id="${note.id}"]`
    );
    if (select) select.classList.add("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible: boolean) {
    const preview = this.root.querySelector(".notes__preview");
    if (preview instanceof HTMLElement)
      preview.style.visibility = visible ? "visible" : "hidden";
  }
}
