import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Activity.module.less";
import { ActivityData } from "@data/activity/activity";

const Activity: React.FC = () => {
  const num_columns = 4;
  const vertical_gap = 20;
  const increment = 8;
  const hasCalculated = useRef(false);
  const masonryRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(26);
  const [itemPositions, setItemPositions] = useState<{ top: number, left: number }[]>([]);
  const [itemVisable, setItemVisable] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  const visableActivities = ActivityData.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    setTimeout(() => {
      const newCount = Math.min(visibleCount + increment, ActivityData.length);
      setVisibleCount(newCount);
      setIsLoading(false);

      if (newCount >= ActivityData.length) {
        setHasMore(false);
      }
    }, 300);
  }, [visibleCount, isLoading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoading, hasMore]);

  useEffect(() => {
    if (visibleCount > 26) {
      hasCalculated.current = false;
      setItemVisable(false);
      calculateAndSetHeights();
      checkAllHeightsReady();
    }
  }, [visibleCount]);

  const arrangeItems = () => {
    const masonryItems = document.querySelectorAll(`.${styles.masonryItem}`);
    const itemWidth = (masonryItems[0] as HTMLElement).offsetWidth;

    const positions: { top: number, left: number }[] = [];
    const columnHeights = new Array(num_columns).fill(0);

    for (let i = 0; i < masonryItems.length; i += num_columns) {
      const groupIndex = Math.floor(i / num_columns);
      const heightList = new Array(num_columns).fill(0);
      for (let j = 0; j < Math.min(num_columns, masonryItems.length - i); j++) {
        const item = masonryItems[i + j] as HTMLElement;
        const height = parseInt((item as HTMLElement).getAttribute('data-height') || '0');
        heightList[j] = height;
      }
      if (groupIndex === 0) {
        for (let j = 0; j < Math.min(num_columns, masonryItems.length - i); j++) {
          const height = heightList[j];
          columnHeights[j] += height + vertical_gap;
          const left = j * itemWidth;
          const top = 0;
          positions[i + j] = { top, left };
        }
      } else {
        const heightListWithIndices = heightList.map((height, index) => ({ height, index }));
        heightListWithIndices.sort((a, b) => b.height - a.height);
        heightListWithIndices.forEach((item) => {
          const height = item.height;
          const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
          const left = shortestColumnIndex * itemWidth;
          const top = columnHeights[shortestColumnIndex] + vertical_gap;
          positions[i + item.index] = { top, left };
          columnHeights[shortestColumnIndex] += height + vertical_gap;
        });
      }
    }

    setItemPositions(positions);

    const paddingBottom = 20;
    let bottomHeight = Math.max(...columnHeights) + paddingBottom;
    if (loadingRef.current) {
      (loadingRef.current as HTMLElement).style.top = `${bottomHeight}px`;
      bottomHeight += (loadingRef.current as HTMLElement).offsetHeight;
    }
    if (masonryRef.current) {
      (masonryRef.current as HTMLElement).style.height = `${bottomHeight}px`;
    }

    setItemVisable(true);
  };

  const calculateAndSetHeights = () => {
    const masonryItems = document.querySelectorAll(`.${styles.masonryItem}`);
    masonryItems.forEach((item) => {
      const height = (item as HTMLElement).offsetHeight;
      (item as HTMLElement).setAttribute('data-height', height.toString());
    });
  };

  const checkAllHeightsReady = () => {
    const masonryItems = document.querySelectorAll(`.${styles.masonryItem}`);
    let allReady = true;

    masonryItems.forEach((item) => {
      const height = parseInt((item as HTMLElement).getAttribute('data-height') || '0');
      if (height <= 0) {
        allReady = false;
      }
    });

    if (allReady && masonryItems.length > 0) {
      hasCalculated.current = true;
      masonryItems.forEach((item, index) => {
        console.log(`活动${index}高度: ${item.getAttribute('data-height')}`);
      });
      arrangeItems();
    } else {
      requestAnimationFrame(() => {
        calculateAndSetHeights();
        checkAllHeightsReady();
      });
    }
  };
  useEffect(() => {
    if (hasCalculated.current) return;
    calculateAndSetHeights();
    checkAllHeightsReady();
  }, []);

  useEffect(() => {
    const imageContainers = document.querySelectorAll(`.${styles.imageContainer}`);
    imageContainers.forEach((container) => {
      const dataSrc = container.getAttribute('data-src');
      if (dataSrc) {
        (container as HTMLElement).style.backgroundImage = `url(${dataSrc})`;
      }
    });
  }, [visableActivities]);

  const processContent = (content: string) => {
    const parts = content.split(/(<blockquote>.*?<\/blockquote>)/g);

    return parts.map((part, index) => {
      if (part.startsWith('<blockquote>') && part.endsWith('</blockquote>')) {
        const innerContent = part.replace(/<\/?blockquote>/g, '');
        return (
          <span key={index} className="blockquote">
            {innerContent}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      <div className={styles.activityContainer}>
        <div className={styles.masonry} ref={masonryRef}>
          {visableActivities.map((item: any, index: number) => {
            return (
              <div
                key={`${item.title}-${index}`}
                className={styles.masonryItem}
                style={{
                  '--num-columns': num_columns,
                  top: itemPositions[index]?.top || 0,
                  left: itemPositions[index]?.left || 0,
                  opacity: itemVisable ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out',
                } as React.CSSProperties}
              >
                <h2>{item.title}</h2>
                <p className={styles.date}>{item.date}</p>
                {item.images.length > 0 && (
                  <div
                    className={styles.imageContainer}
                    data-src={`/images/activities/${item.images[0].filename}`}
                    style={{
                      '--aspect-ratio': item.images[0].aspectRatio,
                      backgroundColor: '#f0f0f0'
                    } as React.CSSProperties}
                  />
                )}
                <p className={styles.content}>{processContent(item.content)}</p>
              </div>
            );
          })}
          <div className={styles.loading} ref={loadingRef} style={{
            opacity: (itemVisable && hasMore) ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}>
            {isLoading ? '加载中...' : '下拉加载更多'}
          </div>
        </div>
      </div>
    </>
  );
};

export default Activity;
