import React from "react";
import styles from "./About.module.less";
import avatar from "@images/about/avatar.jpg";

const About: React.FC = () => {
  return (
    <div className={styles.about}>
      <div className={styles.row}>
        <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} />
        <div className={styles.column} style={{ paddingLeft: "20px" }}>
          <h2 className={styles.title}>清川 <span style={{ fontSize: "14px" }}>(1997 - ?)</span></h2>
          <p>把自己幻想成河流的拟态人形生物，暂未列入保护名单的濒危物种。曾广泛分布于重庆、河北、河南、江西、陕西、辽宁，好结交江湖好友，激扬文字、针砭时弊。<strong>反内卷，也反躺平，青年人应有志于身体力行地改造世界！</strong>长太息以掩涕兮，哀民生之多艰。愿以广厦之千万间，大庇天下寒士俱欢颜！</p>
          <ul>
            <li>计算机系博士生，职业炼丹师，全栈工程师</li>
            <li>围棋深度业余爱好者，童子功敌不过野路子</li>
            <li>喜民谣，弹吉他只为治疗五音不全</li>
            <li>国画灵魂画手，好金石刀笔</li>
            <li>每晚南体跑步、每周电院乒乓</li>
            <li>擅长清蒸鲈鱼回锅肉、火罐按摩与修理马桶</li>
          </ul>
          {/* <p>欢迎来交朋友（只要你不卖茶叶）！</p> */}
        </div>
      </div>
    </div>
  );
};

export default About;
