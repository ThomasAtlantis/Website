import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Literature.module.less";

interface Poem {
  _id: string;
  cover: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const Literature: React.FC = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPoemData = async () => {
      const poemJsonModule = import.meta.glob("@data/literature/poems.json");
      const module = await poemJsonModule[Object.keys(poemJsonModule)[0]]() as { default: Poem[] };
      const poemData = module.default || module;
      setPoems(poemData);
    };
    loadPoemData();
  }, []);

  const handlePoemClick = (poemId: string) => {
    navigate(`/literature/${poemId}`);
  };

  return (
    <div className={styles.literatureContainer}>
      <div className={styles.literatureRow}>
        <div className={styles.literatureInfo}>
          <h2 className={styles.literatureTitle}>诗歌</h2>
          <p className={styles.literatureDescription}>
            诗歌是文学的重要组成部分，是人类文化的重要遗产。
          </p>
        </div>

        <div className={styles.literatureArticlesSection}>
          <ul className={styles.literatureArticleList}>
            {poems.map((poem: Poem) => (
              <li key={poem._id} className={styles.literatureArticleItem}>
                <span className={styles.literatureArticleDate}>{new Date(poem.createdAt).toLocaleDateString()}</span>
                <a
                  className={styles.literatureArticleLink}
                  onClick={() => handlePoemClick(poem._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className={styles.literatureArticleTitle}>{poem.title}</h3>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Literature;
