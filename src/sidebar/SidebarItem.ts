const MAX_BODY_LENGTH = 30;

export default class SidebarItem {
  public root: HTMLElement;
  public data: SliderbarItemData;
  public handlers: {
    onSelect: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
  };
  constructor(
    root: HTMLElement,
    data: SliderbarItemData,
    handlers: {
      onSelect: (id: string) => void;
      onDelete: (id: string) => Promise<void>;
    },
    insertIndex?: number
  ) {
    this.root = root;
    this.handlers = handlers;
    this.data = data;

    const isSelectedOne =
      this.root.querySelectorAll(".list-item--selected").length > 0;
    const newDiv = document.createElement("div");
    newDiv.classList.add("list-item", `data-item-id-${data.id}`);
    if (!isSelectedOne) {
      newDiv.classList.add("list-item--selected");
      this.selectListItem(data.id);
    }
    const newTitleDisplay = document.createElement("span");
    newTitleDisplay.innerHTML = data.title;
    newTitleDisplay.classList.add("list-item_title");
    const newDescriptionDisplay = document.createElement("p");
    newDescriptionDisplay.innerHTML = `${data.description.substring(
      0,
      MAX_BODY_LENGTH
    )}${data.description.length > MAX_BODY_LENGTH ? "..." : ""}`;
    newDescriptionDisplay.classList.add("list-item_description");
    const newDateDisplay = document.createElement("span");
    newDateDisplay.innerHTML = new Date(data.date).toLocaleString();
    newDateDisplay.classList.add("list-item_date");
    const newDelIcon = document.createElement("div");
    newDelIcon.classList.add("list-item_del");
    newDelIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path fill="#2f88ff" stroke="#000" d="M18.4237 10.5379C18.794 10.1922 19.2817 10 19.7883 10H42C43.1046 10 44 10.8954 44 12V36C44 37.1046 43.1046 38 42 38H19.7883C19.2817 38 18.794 37.8078 18.4237 37.4621L4 24L18.4237 10.5379Z"/><path stroke="#fff" d="M36 19L26 29"/><path stroke="#fff" d="M26 19L36 29"/></g></svg>
    `;
    newDelIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      const doDelete = confirm("确认要删除该笔记吗?");

      if (doDelete) {
        if (data.id) this.deleteListItem(data.id);
      }
    });

    newDiv.append(
      newTitleDisplay,
      newDescriptionDisplay,
      newDateDisplay,
      newDelIcon
    );
    newDiv.addEventListener("click", () => {
      this.selectListItem(data.id);
    });
    if (insertIndex !== void 0) {
      if (insertIndex !== 0) {
        this.root.insertBefore(newDiv, this.root.childNodes[insertIndex]);
      } else {
        this.root.append(newDiv);
      }
    } else {
      this.root.insertBefore(newDiv, this.root.childNodes[0]);
    }
  }

  selectListItem(id: string) {
    this.handlers.onSelect(id);
    this.root
      .querySelectorAll(".list-item--selected")
      .forEach((noteListItem) => {
        noteListItem.classList.remove("list-item--selected");
      });

    const select = this.root.querySelector(`.data-item-id-${this.data.id}`);
    if (select) select.classList.add("list-item--selected");
  }

  async deleteListItem(id: string) {
    try {
      await this.handlers.onDelete(id);
      const select = this.root.querySelector(`.data-item-id-${id}`);
      if (select) {
        this.root.removeChild(select);
      }
    } catch (e) {
      console.error("Failed to delete item:", e);
    }
  }

  async editListItem(data: SliderbarItemData) {
    try {
      const titleDisplay = document.querySelector(
        `.data-item-id-${data.id} .list-item_title`
      );
      if (titleDisplay) {
        titleDisplay.innerHTML = data.title;
      }
      const descriptionDisplay = document.querySelector(
        `.data-item-id-${data.id} .list-item_description`
      );
      if (descriptionDisplay) {
        descriptionDisplay.innerHTML = data.description;
      }
      const dateDisplay = document.querySelector(
        `.data-item-id-${data.id} .list-item_date`
      );
      if (dateDisplay) {
        dateDisplay.innerHTML = new Date().toLocaleString();
      }
    } catch (e) {
      console.error("Failed to edit item:", e);
    }
  }
}
