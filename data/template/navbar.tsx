const NAVBAR_ITEMS = [
  {
    key: "index",
    label: "人间纪行",
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
  if (item.key === "index") {
    item.href = `/`;
  } else {
    item.href = `/${item.key}`;
  }
});

export { NAVBAR_ITEMS };
