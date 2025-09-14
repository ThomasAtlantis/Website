import React from "react";
import styles from "./index.module.less";
import { Layout as AntdLayout } from "antd";
import { useLocation, Link } from "react-router-dom";
import { NAVBAR_ITEMS } from "@data/template/navbar";
const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentKey =
    location.pathname === "/" ? "index" : location.pathname.slice(1);

  // 获取当前active的菜单项
  const activeItem = NAVBAR_ITEMS.find(item => item.key === currentKey);
  const activeTitle = activeItem ? activeItem.label : "人间纪行";

  // 判断是否为Home页面
  const isHomePage = location.pathname === "/";

  // 判断是否为详情页面（包含ID参数的页面）
  const isDetailPage = location.pathname.includes("/literature/") && location.pathname !== "/literature";

  console.log(location.pathname);

  // 如果是Home页面，不显示Header和Footer
  if (isHomePage) {
    return (
      <div className={styles.homeLayout}>
        {children}
      </div>
    );
  }

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
        {!isDetailPage && <h1 className={styles.title}>{activeTitle}</h1>}
        {children}
      </Content>
      <Footer className={styles.footer}>
        Copyright ©2017-{new Date().getFullYear()} All rights reserved — website designed by Shangyu Liu
      </Footer>
    </AntdLayout>
  );
};

export default Layout;
