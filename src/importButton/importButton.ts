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
    <input type="file" id="excelFile" accept=".xlsx, .xls" />
    <a class="import_button" href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      Import Note
    </a>
    `;

    const inputFile = document.getElementById("excelFile");
    if (inputFile)
      inputFile.addEventListener("change", () => {
        this.handlers.onImport();
      });

    const button = this.root.querySelector(".import_button");

    if (button && inputFile) {
      button.addEventListener("click", () => {
        inputFile.click();
      });
    }
  }
}
