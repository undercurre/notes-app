import SliderbarItem from "./SidebarItem";

export default class Sidebar {
  public root: HTMLElement;
  public handlers: {
    onSelect: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
  };

  private list: SliderbarItem[];
  constructor(
    root: HTMLElement,
    handlers: {
      onSelect: (id: string) => void;
      onDelete: (id: string) => Promise<void>;
    },
    list: SliderbarItemData[]
  ) {
    this.root = root;
    this.handlers = handlers;
    const sorted = this.sortListData(list);
    this.list = sorted.map(
      (item) =>
        new SliderbarItem(root, item, {
          onSelect: handlers.onSelect,
          onDelete: async (id) => {
            await handlers.onDelete(id);
            this.sortList();
          },
        })
    );
  }

  pushListItem(listItem: SliderbarItemData) {
    let dateList = this.list.map((item) => {
      return { id: item.data.id, date: item.data.date };
    });
    dateList.push({
      id: listItem.id,
      date: listItem.date,
    });
    dateList = dateList.sort((a, b) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });
    const insertIndex = dateList.findIndex((item) => item.id === listItem.id);
    this.list.splice(
      insertIndex,
      0,
      new SliderbarItem(
        this.root,
        listItem,
        {
          onSelect: this.handlers.onSelect,
          onDelete: async (id) => {
            await this.handlers.onDelete(id);
            this.sortList();
          },
        },
        insertIndex
      )
    );
    this.sortList();
  }

  editListItem(data: SliderbarItemData) {
    const editOne = this.list.find((item) => item.data.id === data.id);
    if (editOne) {
      editOne.editListItem(data);
    }
  }

  sortList() {
    this.list = this.list.sort((a: SliderbarItem, b: SliderbarItem) => {
      return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1;
    });
  }

  sortListData(list: SliderbarItemData[]) {
    return list.sort((a: SliderbarItemData, b: SliderbarItemData) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });
  }
}
