export default class ImportButton {
  public root: HTMLElement;
  public handlers: {
    onImport: () => Promise<void>;
  };

  constructor(
    root: HTMLElement,
    handlers: {
      onImport: () => Promise<void>;
    }
  ) {
    this.root = root;
    this.handlers = handlers;

    root.innerHTML = `
    <a class="import_button" href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      Import Note
    </a>
    `;

    const button = this.root.querySelector(".import_button");

    if (button) {
      button.addEventListener("click", () => {
        this.handlers.onImport();
      });
    }
  }
}
