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

interface Review {
  _id: string;
  cover: string;
  title: string;
  url_item: string;
  url_content: string;
  url_image: string;
  rating: number;
  updated: string;
}

interface PoemReview {
  _id: string;
  title: string;
  url_content: string;
  updated: string;
}

interface BookNote {
  _id: string;
  title: string;
  url_content: string;
  updated: string;
}


const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({ rating, maxRating = 10 }) => {
  const stars = [];
  const filledStars = Math.round((rating / maxRating) * 5); // 将10分制转换为5星制

  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i < filledStars ? "#e8b004" : "#e0e0e0"}
        style={{ marginRight: "2px" }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }

  return <div style={{ display: "flex", alignItems: "center" }}>{stars}</div>;
};

const Literature: React.FC = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [poemReviews, setPoemReviews] = useState<PoemReview[]>([]);
  const [bookNotes, setBookNotes] = useState<BookNote[]>([]);
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

  useEffect(() => {
    const loadReviewData = async () => {
      const reviewJsonModule = import.meta.glob("@data/literature/reviews.json");
      const module = await reviewJsonModule[Object.keys(reviewJsonModule)[0]]() as { default: Review[] };
      const reviewData = module.default || module;
      setReviews(reviewData);
    };
    loadReviewData();
  }, []);

  useEffect(() => {
    const loadPoemReviewData = async () => {
      const poemReviewJsonModule = import.meta.glob("@data/literature/poem_reviews.json");
      const module = await poemReviewJsonModule[Object.keys(poemReviewJsonModule)[0]]() as { default: PoemReview[] };
      const poemReviewData = module.default || module;
      setPoemReviews(poemReviewData);
    };
    loadPoemReviewData();
  }, []);

  useEffect(() => {
    const loadBookNoteData = async () => {
      const bookNoteJsonModule = import.meta.glob("@data/literature/book_notes.json");
      const module = await bookNoteJsonModule[Object.keys(bookNoteJsonModule)[0]]() as { default: BookNote[] };
      const bookNoteData = module.default || module;
      setBookNotes(bookNoteData);
    };
    loadBookNoteData();
  }, []);

  const handlePoemClick = (poemId: string) => {
    navigate(`/literature/${poemId}`);
  };

  return (
    <div className={styles.literatureContainer}>
      <div className={styles.literatureRow}>
        <div className={styles.literatureInfo}>
          <h2 className={styles.literatureTitle}>现代诗歌</h2>
          <p className={styles.literatureDescription}>
            现代诗歌打破传统格律束缚，以自由的形式捕捉瞬间的感知与超验的意象。它用凝练的语言、跳跃的节奏和隐喻的张力，表达个体在都市、自然或精神困境中的沉思与觉醒，赋予日常以诗性的光芒。
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
      <div className={styles.literatureRow}>
        <div className={styles.literatureInfo}>
          <h2 className={styles.literatureTitle}>诗歌评论</h2>
          <p className={styles.literatureDescription}>
            诗歌评论是理性与感性的对话，通过解析语言的肌理、意象的层次和情感的暗流，揭示文本的深层意义。它连接创作与阅读，在阐释中重构诗的宇宙，既追问诗人的意图，也激活读者的再创造。
          </p>
        </div>

        <div className={styles.literatureArticlesSection}>
          <ul className={styles.literatureArticleList}>
            {poemReviews.map((poemReview: PoemReview) => (
              <li key={poemReview._id} className={styles.literatureArticleItem}>
                <span className={styles.literatureArticleDate}>{new Date(poemReview.updated).toLocaleDateString()}</span>
                <a
                  className={styles.literatureArticleLink}
                  href={poemReview.url_content}
                  target="_blank"
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className={styles.literatureArticleTitle}>{poemReview.title}</h3>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.literatureRow}>
        <div className={styles.literatureInfo}>
          <h2 className={styles.literatureTitle}>读书笔记</h2>
          <p className={styles.literatureDescription}>
            读书笔记是阅读时的思想锚点，记录灵光闪现的段落、共鸣的观点的个人反思。它不仅是记忆的延伸，更是与文本的深度对话，在抄写、批注和梳理中内化知识，形成独特的阅读地图。
          </p>
        </div>
        <div className={styles.literatureArticlesSection}>
          <ul className={styles.literatureArticleList}>
            {bookNotes.map((bookNote: BookNote) => (
              <li key={bookNote._id} className={styles.literatureArticleItem}>
                <span className={styles.literatureArticleDate}>{new Date(bookNote.updated).toLocaleDateString()}</span>
                <a
                  className={styles.literatureArticleLink}
                  href={bookNote.url_content}
                  target="_blank"
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className={styles.literatureArticleTitle}>{bookNote.title}</h3>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.literatureRow}>
        <div className={styles.literatureInfo}>
          <h2 className={styles.literatureTitle}>书评影评</h2>
          <p className={styles.literatureDescription}>
            书评与影评是介于艺术与大众之间的桥梁，以批判性思维剖析作品的主题、叙事与美学。它超越个人喜好，追问创作的社会语境与人性回声，既为读者提供选择参考，也参与文化对话的构建。
          </p>
        </div>

        <div className={styles.literatureArticlesSection}>
          <ul className={styles.literatureArticleList}>
            {reviews.map((review: Review) => (
              <li key={review._id} className={styles.reviewItem}>
                <a className={styles.literatureArticleImage} style={{ cursor: 'pointer', background: `url(/images/literature/${review.cover}) no-repeat center center`, backgroundSize: 'cover' }} href={review.url_item} target="_blank">
                </a>
                <div className={styles.literatureArticleMeta}>
                  <span className={styles.literatureArticleDate}>{new Date(review.updated).toLocaleDateString()}</span>
                  <div className={styles.reviewRating}>
                    <StarRating rating={review.rating} />
                    <span style={{ marginLeft: "8px" }}>{review.rating.toFixed(1)}</span>
                  </div>
                  <a
                    className={styles.literatureArticleLink}
                    href={review.url_content}
                    target="_blank"
                    style={{ cursor: "pointer" }}
                  >
                    <h3 className={styles.literatureArticleTitle}>{review.title}</h3>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Literature;
