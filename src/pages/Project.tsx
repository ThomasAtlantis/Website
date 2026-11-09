import React from "react";
import styles from "./Project.module.less";
import { ProjectData } from "@data/project/projects";

interface ProjectItem {
  id: number;
  type: string;
  title: string;
}

interface Category {
  id: number;
  type: string;
  title: string;
  description: string;
  children: ProjectItem[];
}

const Project: React.FC = () => {
  const categories = ProjectData as Category[];

  return (
    <div className={styles.projectContainer}>
      {categories.map((category) => (
        <div key={category.id} className={styles.categoryRow}>
          <div className={styles.categoryInfo}>
            <h2 className={styles.categoryTitle}>{category.title}</h2>
            {category.description && (
              <p className={styles.categoryDescription}>{category.description}</p>
            )}
          </div>

          <div className={styles.itemsSection}>
            <ul className={styles.itemList}>
              {category.children.map((item) => (
                <li key={item.id} className={styles.itemRow}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Project;
