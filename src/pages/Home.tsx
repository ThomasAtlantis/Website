import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.less";
import logo from "/logo.png";
import { NAVBAR_ITEMS } from "@data/template/navbar";

import photo1 from "@images/homepage/1.jpg";
import photo2 from "@images/homepage/2.jpg";
import photo3 from "@images/homepage/3.jpg";

import zhihu from "@images/homepage/zhihu.png";
import githubIcon from "@images/homepage/github.svg";
import emailIcon from "@images/homepage/email.svg";
import copyIcon from "@images/homepage/copy.svg";
import wechatBlogIcon from "@images/homepage/wechat_blog.png";
import doubanIcon from "@images/homepage/douban.png";
import wechatQR from "@images/homepage/wechat_blog_qrcode.png";

const activities = import.meta.glob("@images/homepage/bottom/*.jpg", { eager: true });

const zhihu_url = "https://www.zhihu.com/people/qing_chuan";
const github_url = "https://github.com/ThomasAtlantis";
const douban_url = "https://www.douban.com/people/liushangyu";

const activityImages = Object.values(activities).map((module: any) => ({
  src: module.default,
  aspectRatio: 2,
  span: 1
}));

// 自定义Tooltip组件
interface TooltipProps {
  children: React.ReactElement;
  text: string;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={styles.tooltip}>
          {text}
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const emailAddress = "liushangyu@sjtu.edu.cn";

  const handleWechatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowWechatQR(true);
  };

  const closeWechatQR = () => {
    setShowWechatQR(false);
  };

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(emailAddress);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement('textarea');
      textArea.value = emailAddress;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('降级复制也失败:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={styles.home}>
      <div className={styles.navRow}>
        <div className={styles.logoContainer}>
          <img className={styles.logo} src={logo} alt="Logo" />
          <h1 className={styles.logoTitle}>人间纪行</h1>
        </div>
        <div className={styles.navSpacer}></div>
        <div className={styles.navContainer}>
          <ul className={styles.navMenu}>
            {NAVBAR_ITEMS.filter((item: any) => item.key !== 'index').map((item: any) => (
              <li
                key={item.key}
                className={styles.navItem}
              >
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.contentRow}>
        <div className={`${styles.column1}`}>
          <p className={styles.leftColumnText}>
            Copyright©2017-{new Date().getFullYear()} All rights reserved — designed by Shangyu Liu
          </p>
        </div>
        <div className={`${styles.column2}`}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              人间纪行
            </h1>
            <div className={styles.socialSection}>
              <div className={styles.socialIcons}>
                <Tooltip text="GitHub" delay={200}>
                  <a href={github_url} target="_blank" className={styles.socialIcon}>
                    <img src={githubIcon} alt="GitHub" />
                  </a>
                </Tooltip>
                <Tooltip text="微信公众号" delay={200}>
                  <button onClick={handleWechatClick} className={`${styles.socialIcon} ${styles.button}`}>
                    <img src={wechatBlogIcon} alt="微信公众号" />
                  </button>
                </Tooltip>
                <Tooltip text="知乎" delay={200}>
                  <a href={zhihu_url} target="_blank" className={styles.socialIcon}>
                    <img src={zhihu} alt="知乎" />
                  </a>
                </Tooltip>
                <Tooltip text="豆瓣" delay={200}>
                  <a href={douban_url} target="_blank" className={styles.socialIcon}>
                    <img src={doubanIcon} alt="豆瓣" />
                  </a>
                </Tooltip>
                <Tooltip text={isEmailHovered ? "复制邮箱" : "Email"} delay={200}>
                  <button
                    onClick={handleEmailClick}
                    onMouseEnter={() => setIsEmailHovered(true)}
                    onMouseLeave={() => setIsEmailHovered(false)}
                    className={`${styles.socialIcon} ${styles.button}`}
                  >
                    <img
                      src={isEmailHovered ? copyIcon : emailIcon}
                      alt={isEmailHovered ? "复制邮箱" : "Email"}
                    />
                  </button>
                </Tooltip>
              </div>
              <Link to="/about" className={styles.aboutButton}>
                关于我
                <span className={styles.arrow}>→</span>
              </Link>
              <Link to="/technology" className={`${styles.aboutButton} ${styles.enterButton}`}>
                进入博客
                <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>
          <div className={styles.row}>
            <div className={`${styles.poemSection} ${styles.poemColumn}`}>
              <p>满树风举棋不定，惹秋蝴蝶翻落银杏苦，</p>
              <p>在砖格线上、佯作项庄舞。看脚下道牙一横，</p>
              <p>冷对秋深处。是边、角、腹？是天数，又将我</p>
              <p>敲闲在第几路？环顾，是庭院深深深锁户。</p>
            </div>
            <div className={`${styles.poemSection} ${styles.poemColumn}`}>
              <p>"小儿郎，岂总不知葡萄形状？"是偏爱京戏里</p>
              <p>孟德猖狂。不受半子不骗先，等到贴目算账。</p>
              <p>四隅藏刀，分定势子后，斜身固守无忧角。</p>
              <p>从前慢，一展双飞翼，三四子便落定五六年。</p>
            </div>
          </div>
          <img className={styles.imgBelowTitle} src={photo2} alt="homeBg" />
          <div className={styles.annotation}>
            <p>*《复盘》作于24岁生日，回顾二十年的经历</p>
            <p>*围棋术语：边、角、腹、敲闲、路、受子、猜先、贴目、先于四隅分定势子（出自玄玄棋经，指座子制）、无忧角、双飞翼、天王山、适应手、假眼、滚打包收、愚形、飞、单关、觑、断、断点、挖打、粘连、弃小而不就者有图大之心也（出自玄玄棋经）、弃子、倒扑、活棋、外势。</p>
          </div>
        </div>
        <div className={`${styles.column3}`}>
          <img src={photo1} alt="homeBg" />
          <div className={styles.poemSection}>
            <p>可叹攸关野狐禅，棋入中盘，失我天王山。</p>
            <p>试应手，在香饵里狼狈做假眼。滚打包收，</p>
            <p>满目愚形不忍看。只能一路单飞一路关，</p>
            <p>四下相觑我不断，终于玉龙见雪山。又奈何</p>
            <p>迅雷风烈变、行刺我断点、挖打又粘连，</p>
            <p>使我踏碎薄冰入深渊。</p>
          </div>
        </div>
        <div className={`${styles.homeColumn} ${styles.column4}`}>
          <img className={styles.homeBg} src={photo3} alt="homeBg" />
        </div>
        <div className={`${styles.homeColumn} ${styles.column5}`}>
          <div className={styles.poemSection}>
            <p>我望向深渊：只见银杏铺成金地毯。落叶从来</p>
            <p>是有情物，毕竟经上书：“弃小者必有大图。”</p>
            <p>又一阵、风摇树，脚下道牙拐作别路。</p>
            <p>莫如弃子做倒扑？毕竟活棋有目、兵势无骨，</p>
            <p>而一将功成万骨枯。</p>
          </div>
        </div>
      </div>

      <div className={styles.imageGrid}>
        <div
          className={`${styles.gridItem}`}
          style={{ aspectRatio: 2, border: '1px solid #ddd' }}
        >
          <img style={{ width: '100%', height: '100%' }} src='https://mapmyvisitors.com/map.png?cl=080808&w=300&t=n&d=lGFuoYIEaSY_Ud1iQKz23UTAHC1edlNQeXo3Ybx1M2s&co=9abad9&ct=808080' />
        </div>
        {activityImages.map((image, index) => (
          index != 0 && <div
            key={index}
            className={`${styles.gridItem} ${styles[`span${image.span}`]}`}
            style={{ aspectRatio: image.aspectRatio }}
          >
            <img
              src={image.src}
              alt={`活动图片 ${index + 1}`}
              className={styles.gridImage}
            />
          </div>
        ))}
      </div>

      {/* 微信二维码弹窗 */}
      {showWechatQR && (
        <div className={styles.qrModal} onClick={closeWechatQR}>
          <div className={styles.qrModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.qrCloseButton} onClick={closeWechatQR}>
              ×
            </button>
            <h3 className={styles.qrTitle}>扫码关注微信公众号</h3>
            <img src={wechatQR} alt="微信二维码" className={styles.qrImage} />
            <p className={styles.qrDescription}>扫描二维码关注我的微信公众号</p>
          </div>
        </div>
      )}

      {/* 复制成功提示 */}
      {showCopySuccess && (
        <div className={styles.copyToast}>
          <div className={styles.copyToastContent}>
            <span className={styles.copyToastIcon}>✓</span>
            <span className={styles.copyToastText}>邮箱地址已复制到剪贴板</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
