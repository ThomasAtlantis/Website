import React from "react";
import styles from "./index.module.less";
import { Layout as AntdLayout } from "antd";
import { useLocation, Link } from "react-router-dom";
import { NAVBAR_ITEMS } from "@data/template/navbar";
const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentKey =
    location.pathname === "/" ? "qingchuan" : location.pathname.slice(1);

  // 获取当前active的菜单项
  const activeItem = NAVBAR_ITEMS.find(item => item.key === currentKey);
  const activeTitle = activeItem ? activeItem.label : "Qingchuan";

  console.log(location.pathname);

  return (
    <AntdLayout className={styles.layout}>
      <Header className={styles.header}>
        <ul className={styles.menu}>
          {NAVBAR_ITEMS.map((item: any) => (
            <li
              key={item.key}
              className={`${styles.menuItem} ${item.key === currentKey ? styles.active : ''}`}
            >
              <Link to={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </Header>
      <Content className={styles.content}>
        <h1 className={styles.title}>{activeTitle}</h1>
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Copyright ©2017-{new Date().getFullYear()} All rights reserved — website design by Shangyu Liu
      </Footer>
    </AntdLayout>
  );
};

export default Layout;
