const NAVBAR_ITEMS = [
  {
    key: "qingchuan",
    label: "Qingchuan",
  },
  {
    key: "technology",
    label: "科技",
  },
  {
    key: "project",
    label: "项目",
  },
  {
    key: "literature",
    label: "文学",
  },
  {
    key: "art",
    label: "艺术",
  },
  {
    key: "activity",
    label: "瞬间",
  },
  {
    key: "about",
    label: "关于",
  },
];

NAVBAR_ITEMS.forEach((item: any) => {
  if (item.key === "qingchuan") {
    item.href = `/`;
  } else {
    item.href = `/${item.key}`;
  }
});

export { NAVBAR_ITEMS };
