export default class EditPanel {
  public root: HTMLElement;
  public data?: EditPanelData;
  public handlers: {
    onEdit: (title: string, content: string) => Promise<void>;
  };

  constructor(
    root: HTMLElement,
    handlers: {
      onEdit: (title: string, content: string) => Promise<void>;
    },
    data?: EditPanelData
  ) {
    this.root = root;
    this.data = data;
    this.handlers = handlers;

    root.innerHTML = `
    <div class="code-container">    
        <div class="glow-container">
            <div class="augs" data-augmented-ui></div>
        </div>
        <section class="augs bg" data-augmented-ui>
            <button class="dots"></button>
            <input class="title panel__title" type="text" placeholder="新笔记...">
            <div class="code highcontrast-dark">
            <textarea id="code" class="panel__body">编辑笔记...</textarea>
            </div>
        </section>
    </div>
    `;

    const inpTitle = this.root.querySelector(".panel__title");
    const inpBody = this.root.querySelector(".panel__body");

    if (inpTitle && inpBody) {
      this.refill();
      [inpTitle, inpBody].forEach((inputField) => {
        inputField.addEventListener("blur", () => {
          if (
            inpTitle instanceof HTMLInputElement &&
            inpBody instanceof HTMLTextAreaElement
          ) {
            const updatedTitle = inpTitle.value.trim();
            const updatedBody = inpBody.value.trim();
            this.handlers.onEdit(updatedTitle, updatedBody);
          }
        });
      });
    }
  }

  refill(title: string = "新笔记", content: string = "待编辑...") {
    const inpTitle = this.root.querySelector(".panel__title");
    const inpBody = this.root.querySelector(".panel__body");

    if (inpTitle && inpBody) {
      (inpTitle as HTMLInputElement).value = title;
      (inpBody as HTMLTextAreaElement).value = content;
    }
  }
}
