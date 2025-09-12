import React, { useRef, useState, useEffect } from "react";
import styles from "./Activity.module.less";
import { ActivityData } from "@data/activity/activity";

const Activity: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isObserverEnabled, setIsObserverEnabled] = useState(false);

  const ITEMS_PER_PAGE = 15;

  // 处理内容中的blockquote标签
  const processContent = (content: string): string => {
    return content.replace(
      /<blockquote>(.*?)<\/blockquote>/g,
      '<span class="blockquote">$1</span>'
    );
  };

  // 瀑布流布局函数
  const arrangeMasonry = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const items = container.querySelectorAll(`.${styles.masonryItem}`);

    if (items.length === 0) return;

    const masonryItems = Array.from(items);
    const containerWidth = container.offsetWidth;
    const gap = 20;

    // 计算列数和每列宽度
    let columns = 4;
    if (containerWidth < 480) columns = 1;
    else if (containerWidth < 768) columns = 2;
    else if (containerWidth < 1024) columns = 3;
    else columns = 4;

    const itemWidth = Math.floor((containerWidth - gap * (columns - 1)) / columns);
    const columnHeights = new Array(columns).fill(0);

    // 第一步：隐藏所有元素，避免重排过程可见
    masonryItems.forEach((item: Element) => {
      const htmlItem = item as HTMLElement;
      htmlItem.style.opacity = '0';
      htmlItem.style.position = 'absolute';
      htmlItem.style.width = `${itemWidth}px`;
      htmlItem.style.left = '0px';
      htmlItem.style.top = '0px';
      htmlItem.style.margin = '0';
    });

    // 第二步：计算所有位置
    const positions: Array<{ x: number, y: number, height: number }> = [];

    masonryItems.forEach((item: Element) => {
      const htmlItem = item as HTMLElement;

      // 找到最短的列
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      const x = shortestColumn * (itemWidth + gap);
      const y = columnHeights[shortestColumn];

      // 获取实际高度
      const itemHeight = htmlItem.offsetHeight;
      columnHeights[shortestColumn] += itemHeight + gap;

      positions.push({ x, y, height: itemHeight });
    });

    // 第三步：批量设置位置，然后显示
    requestAnimationFrame(() => {
      masonryItems.forEach((item: Element, index: number) => {
        const htmlItem = item as HTMLElement;
        const pos = positions[index];

        // 一次性设置位置
        htmlItem.style.left = `${pos.x}px`;
        htmlItem.style.top = `${pos.y}px`;
      });

      // 设置容器高度
      const maxHeight = Math.max(...columnHeights);
      container.style.height = `${maxHeight}px`;

      // 第四步：显示所有元素
      requestAnimationFrame(() => {
        masonryItems.forEach((item: Element) => {
          const htmlItem = item as HTMLElement;
          htmlItem.style.opacity = '1';
          htmlItem.style.transition = 'opacity 0.2s ease-in-out';
        });
      });
    });
  };


  // 初始化数据
  useEffect(() => {
    console.log('初始化数据');
    const initialItems = ActivityData.slice(0, ITEMS_PER_PAGE);
    console.log('初始项目数量:', initialItems.length);
    setVisibleItems(initialItems);
    setHasMore(ActivityData.length > ITEMS_PER_PAGE);
  }, []);

  // 当可见项目变化时重新排列布局
  useEffect(() => {
    console.log(`useEffect触发: visibleItems.length = ${visibleItems.length}`);
    if (visibleItems.length > 0) {
      console.log(`可见项目数量: ${visibleItems.length}`);

      // 延迟执行布局，确保DOM完全渲染
      const timeout = setTimeout(() => {
        console.log('开始执行布局函数');
        console.log('containerRef.current:', containerRef.current);
        console.log('containerRef.current?.querySelectorAll(".masonryItem"):', containerRef.current?.querySelectorAll('.masonryItem'));
        arrangeMasonry();
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [visibleItems]);

  // 监听窗口大小变化，重新排列布局
  useEffect(() => {
    const handleResize = () => {
      arrangeMasonry();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // 监听滚动事件，启用 observer
  useEffect(() => {
    const handleScroll = () => {
      if (!isObserverEnabled) {
        setIsObserverEnabled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { once: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isObserverEnabled]);

  // 使用 useRef 存储加载函数
  const loadMoreItemsRef = useRef<(() => void) | null>(null);

  // 更新加载函数
  useEffect(() => {
    loadMoreItemsRef.current = () => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);

      setTimeout(() => {
        const nextPage = currentPage + 1;
        const startIndex = nextPage * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newItems = ActivityData.slice(startIndex, endIndex);

        if (newItems.length > 0) {
          setVisibleItems(prev => [...prev, ...newItems]);
          setCurrentPage(nextPage);

          // 检查是否还有更多数据
          const nextStartIndex = (nextPage + 1) * ITEMS_PER_PAGE;
          const hasMoreData = nextStartIndex < ActivityData.length;
          setHasMore(hasMoreData);
        } else {
          setHasMore(false);
        }

        setIsLoading(false);
      }, 500);
    };
  }, [currentPage, isLoading, hasMore]);

  // 设置Intersection Observer
  useEffect(() => {
    if (!isObserverEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && hasMore && loadMoreItemsRef.current) {
          loadMoreItemsRef.current();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isObserverEnabled, isLoading, hasMore]);

  return (
    <>
      <div className={styles.activityContainer}>
        <div ref={containerRef} className={styles.masonry}>
          {visibleItems.map((item: any, index: number) => {
            return (
              <div key={`${item.title}-${index}`} className={styles.masonryItem}>
                <h2>{item.title}</h2>
                <p className={styles.date}>{item.date}</p>
                {item.images.length > 0 && (
                  <img
                    src={`/images/activities/${item.images[0]}`}
                    alt={item.title}
                  />
                )}
                <p dangerouslySetInnerHTML={{ __html: processContent(item.content) }}></p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 加载触发器 - 移到瀑布流容器外部 */}
      <div ref={observerRef} className={styles.loadTrigger}>
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            <p>加载中...</p>
          </div>
        )}
        {!hasMore && !isLoading && (
          <div className={styles.noMoreIndicator}>
            <p>- 没有更多内容了 -</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Activity;
