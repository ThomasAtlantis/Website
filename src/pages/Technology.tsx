import React, { useEffect, useState } from "react";
import styles from "./Technology.module.less";


interface Article {
  title: string;
  href: string;
  type: string;
  updated_time: number;
  created_time: number;
}

interface Category {
  type: string;
  title: string;
  description: string;
  children: Record<string, Article>;
}

const Technology: React.FC = () => {

  const [zhihuData, setZhihuData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadZhihuData = async () => {
      try {
        const jsonModules = import.meta.glob('@data/technology/zhihu/*.json');
        const dataPromises = Object.keys(jsonModules).sort((a, b) => {
          const fileNameA = a.split('/').pop() || '';
          const numA = parseInt(fileNameA.split('_')[1]);
          const fileNameB = b.split('/').pop() || '';
          const numB = parseInt(fileNameB.split('_')[1]);
          return numB - numA;
        }).map(async (path) => {
          const module = await jsonModules[path]() as { default: Category };
          return module.default || module;
        });

        const allData = await Promise.all(dataPromises);
        setZhihuData(allData);
      } catch (error) {
        console.error('Error loading Zhihu data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadZhihuData();
  }, []);

  if (loading) {
    return (
      <div className={styles.technologyContainer}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.technologyContainer}>
      {zhihuData.map((category: Category, index: number) => (
        <div key={`${category.type}-${index}`} className={styles.categoryRow}>
          <div className={styles.categoryInfo}>
            <h2 className={styles.categoryTitle}>{category.title}</h2>
            <p className={styles.categoryDescription}>
              {category.description}
            </p>
          </div>

          {/* 右侧文章列表 */}
          <div className={styles.articlesSection}>
            <ul className={styles.articleList}>
              {Object.entries(category.children).map(([id, article]: [string, Article]) => (
                <li key={id} className={styles.articleItem}>
                  <span className={styles.articleDate}>{new Date(article.updated_time * 1000).toLocaleDateString()}</span>
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
