import NotesView from "./view";

export default class App {
  public view: NotesView;

  constructor(root: HTMLElement) {
    this.view = new NotesView(root);
    this.root = 
  }
}
