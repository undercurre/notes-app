export default class SidebarItem {
  public root: HTMLElement;
  public data: SliderbarItemData;
  public handlers: {
    onDelete: (id: string) => Promise<void>;
  };
  constructor(
    root: HTMLElement,
    data: SliderbarItemData,
    handlers: {
      onDelete: (id: string) => Promise<void>;
    }
  ) {
    this.root = root;
    this.handlers = handlers;
    this.data = data;

    const newDiv = document.createElement("div");
    newDiv.classList.add("list-item", `.list-item[data-item-id="${data.id}"]`);
    const newTitleDisplay = document.createElement("span");
    const newDescriptionDisplay = document.createElement("p");
    const newDateDisplay = document.createElement("span");
    newDateDisplay.classList.add("list-item_date");

    newDiv.append(newTitleDisplay, newDescriptionDisplay, newDateDisplay);
  }

  async deleteListItem(data: SliderbarItemData) {
    try {
      await this.handlers.onDelete(data.id);
      const select = this.root.querySelector(
        `.list-item[data-item-id="${data.id}"]`
      );
      if (select) {
        select.remove();
      }
    } catch (e) {
      console.error("Failed to delete item:", e);
    }
  }
}
