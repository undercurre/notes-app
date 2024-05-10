export default class AddButton {
  public root: HTMLElement;
  public handlers: {
    onAdd: () => Promise<void>;
  };

  constructor(
    root: HTMLElement,
    handlers: {
      onAdd: () => Promise<void>;
    }
  ) {
    this.root = root;
    this.handlers = handlers;

    root.innerHTML = `
    <a class="add_button" href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      New Note
    </a>
    `;

    const addButton = this.root.querySelector(".add_button");

    if (addButton) {
      addButton.addEventListener("click", () => {
        this.handlers.onAdd();
      });
    }
  }
}
