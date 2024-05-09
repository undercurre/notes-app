import SliderbarItem from "./SidebarItem";

export default class Sidebar {
  public root: HTMLElement;
  public handlers: {
    onAdd: (listItem?: SliderbarItemData) => Promise<void>;
    onSelect: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
  };

  private list: SliderbarItem[];
  constructor(
    root: HTMLElement,
    handlers: {
      onAdd: (listItem?: SliderbarItemData) => Promise<void>;
      onSelect: (id: string) => void;
      onDelete: (id: string) => Promise<void>;
    },
    list: SliderbarItemData[]
  ) {
    this.root = root;
    this.handlers = handlers;

    const listContainer = document.createElement("div");
    listContainer.classList.add("sidebar_list");
    this.root.appendChild(listContainer);

    this.list = list.map(
      (item) =>
        new SliderbarItem(root, item, {
          onDelete: handlers.onDelete,
        })
    );
  }

  pushListItem(listItem: SliderbarItemData) {
    this.list.push(
      new SliderbarItem(this.root, listItem, {
        onDelete: this.handlers.onDelete,
      })
    );

    this.updateActiveItem(this.list[0].data);
  }

  updateActiveItem(data: SliderbarItemData) {
    const select = this.root.querySelector("list-item--selected");
    if (select) {
      select.classList.remove("list-item--selected");
    }

    const newSelect = this.root.querySelector(
      `.list-item[data-item-id="${data.id}"]`
    );
    if (newSelect) {
      newSelect.classList.add("list-item--selected");
    }

    this.handlers.onSelect(data.id);
  }
}
