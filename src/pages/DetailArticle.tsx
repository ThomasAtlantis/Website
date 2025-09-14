import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailArticle.module.less";

interface Poem {
    _id: string;
    cover: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
}

const DetailArticle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [poem, setPoem] = useState<Poem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPoemData = async () => {
            try {
                const poemJsonModule = import.meta.glob("@data/literature/poems.json");
                const module = await poemJsonModule[Object.keys(poemJsonModule)[0]]() as { default: Poem[] };
                const poemData = module.default || module;
                const foundPoem = poemData.find((p: Poem) => p._id === id);
                setPoem(foundPoem || null);
            } catch (error) {
                console.error("Failed to load poem data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadPoemData();
        }
    }, [id]);

    const handleBack = () => {
        navigate("/literature");
    };

    // 将诗歌内容按段落分割
    const splitPoemIntoParagraphs = (content: string) => {
        return content.split('\n\n').filter(paragraph => paragraph.trim() !== '');
    };

    let annotationStarted = false;
    const separateParagraphs = (paragraphs: string[]) => {
        const poemParagraphs: string[] = [];
        const commentLines: string[] = [];

        paragraphs.forEach(paragraph => {
            if (paragraph.trim().startsWith('———')) {
                annotationStarted = true;
                const lines = paragraph.replace(/^—+/, '').split('\n');
                commentLines.push(...lines);
            } else if (paragraph.trim().startsWith('注：')) {
                annotationStarted = true;
                const lines = paragraph.split('\n');
                commentLines.push(...lines);
            } else if (annotationStarted) {
                const lines = paragraph.split('\n');
                commentLines.push(...lines);
            } else {
                poemParagraphs.push(paragraph);
            }
        });

        return { poemParagraphs, commentLines };
    };

    const { poemParagraphs, commentLines } = poem ? separateParagraphs(splitPoemIntoParagraphs(poem.content)) : { poemParagraphs: [], commentLines: [] };

    if (loading) {
        return (
            <div className={styles.detailContainer}>
                <div className={styles.loading}>加载中...</div>
            </div>
        );
    }

    if (!poem) {
        return (
            <div className={styles.detailContainer}>
                <div className={styles.notFound}>
                    <h2>诗歌未找到</h2>
                    <button onClick={handleBack} className={styles.backButton}>
                        返回诗歌列表
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← 返回诗歌列表
                </button>
            </div>

            <article className={styles.poemArticle}>
                <div className={styles.poemColumns}>
                    <div className={styles.poemCover}>
                        <img src={poem.cover} alt={poem.title} />
                    </div>
                    <header className={styles.poemHeader}>
                        <h1 className={styles.poemTitle}>{poem.title}</h1>
                        <div className={styles.poemMeta}>
                            <span className={styles.author}>清川</span>
                            <span className={styles.poemDate}>
                                {new Date(poem.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </header>
                    {poemParagraphs.map((paragraph, index) => (
                        <div key={index} className={styles.poemParagraph}>
                            <span className={styles.paragraphNumber}>{index + 1}</span>
                            <pre className={styles.poemText}>{paragraph}</pre>
                        </div>
                    ))}
                </div>

                {/* 注释行单独显示在最下面 */}
                {commentLines.length > 0 && (
                    <div className={styles.commentsSection}>
                        {commentLines.map((line, index) => (
                            <p key={index} className={styles.commentText}>
                                {line}
                            </p>
                        ))}
                    </div>
                )}
            </article>
        </div>
    );
};

export default DetailArticle;
