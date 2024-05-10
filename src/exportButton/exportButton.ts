export default class ExportButton {
  public root: HTMLElement;
  public handlers: {
    onExport: () => Promise<void>;
  };

  constructor(
    root: HTMLElement,
    handlers: {
      onExport: () => Promise<void>;
    }
  ) {
    this.root = root;
    this.handlers = handlers;

    root.innerHTML = `
    <a class="export_button" href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      Export Note
    </a>
    `;

    const button = this.root.querySelector(".export_button");

    if (button) {
      button.addEventListener("click", () => {
        this.handlers.onExport();
      });
    }
  }
}
