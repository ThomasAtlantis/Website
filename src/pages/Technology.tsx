import React from "react";
import { CatalogueData } from "@data/technology/catalogue";
import styles from "./Technology.module.less";

interface Category {
  id: number;
  type: string;
  title: string;
  description: string;
  children: Article[];
}

interface Article {
  id: number;
  type: string;
  title: string;
  href: string;
  date: string;
}

const Technology: React.FC = () => {
  return (
    <div className={styles.technologyContainer}>
      {CatalogueData.map((category: Category) => (
        <div key={category.id} className={styles.categoryRow}>
          {/* 左侧类别信息 */}
          <div className={styles.categoryInfo}>
            <h2 className={styles.categoryTitle}>{category.title}</h2>
            <p className={styles.categoryDescription}>
              {category.description}
            </p>
          </div>

          {/* 右侧文章列表 */}
          <div className={styles.articlesSection}>
            <ul className={styles.articleList}>
              {category.children.map((article) => (
                <li key={article.id} className={styles.articleItem}>
                  <span className={styles.articleDate}>{article.date}</span>
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.articleLink}
                  >
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Technology;
