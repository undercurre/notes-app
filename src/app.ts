import NotesView from "./view";

export default class App {
  public view: NotesView;

  constructor(root: HTMLElement) {
    root.innerHTML = `
      <div class="notes__sidebar">
      </div>
      <div class="notes__preview">
      </div>
      <div class="add_button_container">
      </div>
    `;

    this.view = new NotesView(root);
  }
}
