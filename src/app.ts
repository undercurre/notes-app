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
      <div class="export_button_container">
      </div>
      <div class="import_button_container">
      </div>
      <a class="github" href="https://github.com/undercurre/notes-app" target="_blank">
        <img src="mdi--github.svg" alt="GitHub">
      </a>
    `;

    this.view = new NotesView(root);
  }
}
