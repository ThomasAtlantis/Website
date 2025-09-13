import React from "react";
import styles from "./About.module.less";
import avatar from "@images/about/avatar.jpg";

const About: React.FC = () => {
  // 数据定义
  const awards = {
    undergraduate: [
      "校一等奖学金、金川奖学金、浪潮奖学金",
      "东北大学优秀学生、辽宁省优秀毕业生",
      "社会实践优秀个人、社会实践优秀团队（领队）",
      "CCF全国高校绿色计算大赛国家级二等奖",
      "全国大学生英语竞赛国家级三等奖",
      "CCF大学生计算机系统与程序设计竞赛东北赛区银奖",
      "中美青年创客大赛沈阳赛区决赛优秀奖",
      "全国大学生物联网设计大赛东北赛区特等奖",
      "全国大学生数学建模竞赛辽宁省三等奖",
      "东北大学ACM校赛一等奖",
      "东北大学首届RoboMaster校内赛优秀奖"
    ],
    graduate: [
      "中国国际大学生创新大赛上海赛区金奖"
    ]
  };

  // 组织工作数据
  const workExperience = {
    undergraduate: [
      "班长",
      "东北大学学生科协科普事务部干事（年度优秀个人）",
      "学院学生党总支微信公众号编辑",
      "计算机组成原理实验室学生助理",
      "东北大学校友会理事"
    ],
    graduate: [
      "CCF上海交大学生分会候任主席、主席",
      "上海交大RyzStars国际文化交流俱乐部联合创始人、负责人",
      "上海交大高尔夫协会联合创始人、副会长"
    ]
  };

  // 讲授课程数据
  const teachingExperience = {
    undergraduate: [
      "C语言程序设计家教（3000 RMB）",
      "C语言实验课程答疑（Raspberry Pi 4b）",
      "Python语言程序设计与硬件开发（友情客串）",
      "Python语言程序设计暑期夏令营（友情客串）"
    ],
    graduate: [
      "工程实践与科技创新（2025秋季学期）",
      "工程实践与科技创新（2023春季学期）",
      "程序设计思想与方法（C++）课程助教（2024秋季学期）",
    ]
  };

  // 个人项目数据
  const personalProjects = {
    undergraduate: [
      "线代计算器：行列式求值、求逆、求幂",
      "扫雷、贪吃蛇、俄罗斯方块、2048",
      "支持命令行自定义参数的祖玛游戏",
      "2D坦克塔防游戏、VR坦克大战游戏",
      "基于Java的画图软件",
      "BetaGo围棋打谱记谱系统",
      "基于minimax算法的五子棋AI",
      "基于ESP32的局域网五子棋联机对弈终端",
      "8086汇编语言集成开发环境V1~3",
      "基于CCD传感器和红外传感器的舵机转向的循迹智能车",
      "轻量级桌面备忘录系统",
      "个人网站前后端设计与建站运营",
      "C99语言手撸CNN实现手写数字识别",
      "类C语言编译器前端",
      "基于FPGA的8位模型机的设计与实现",
      "基于CC2530的智能盆景生态系统",
      "Python在线运行工具",
      "WBS树表可视化工具",
      "Web-API前端调试工具",
      "语病语料对自动标注工具",
      "语音唤醒的疫情简报助手",
      "微信公众号后台机器人",
      "百度网盘文件外链破解（未公开使用）",
      "微信语音存储破解（未公开使用）",
      "三百两抽奖系统",
      "腾讯课堂m3u8直播回放下载器（未公开使用）",
      "报告某社交APP重大隐私安全漏洞",
      "东北大学本科生绩点批量计算工具",
      "基于证件照的毕业合影生成工具"
    ],
    graduate: [
      "实验室服务器集群部署与运维",
      "\"北京冬奥会\"国际社交媒体舆论动态监控",
      "图书检索系统",
      "共享云打印服务",
      "FormuLaTeX公式转LaTeX工具",
      "校园电动车充电桩用量分析",
      "JSON字段自动化提取工具",
      "基于霍夫梯度法的纸质棋谱自动录入和打谱辅助",
      "基于Python自主设计自动微分框架nabla",
      "原创力文档VIP下载破解（未公开使用）",
      "基于压电传感器的实时笔迹识别系统",
      "基于大模型的「海龟汤」微信机器人",
      "基于Jetson Nano的帧一致性动态视频监控",
      "流水线分析DSL与可视化工具",
      "pcap文件解包和SNI字段抽取工具",
      "基于socket的端云协同MLOps框架distpipe",
      "基于MPI的联邦训练通信框架mpi-ml",
      "端云分布式检索增强生成框架DRAGON",
      "诉责险自动化投保系统AutoInsur",
      "基于大模型的知乎知识王者外挂"
    ]
  };

  // 论文专利数据
  const papers = {
    graduate: [
      {
        firstAuthor: "Shangyu Liu",
        otherAuthors: "Zhenzhe Zheng, Xiaoyao Huang, Fan Wu, Guihai Chen, Jie Wu",
        year: "2025",
        title: "DRAGON: Enhancing On-Device Model Performance with Distributed Retrieval-Augmented Generation",
        venue: "ACM MobiHoc 2025"
      },
      {
        firstAuthor: "Shangyu Liu",
        otherAuthors: "Zhenzhe Zheng, Xiaoyao Huang, Fan Wu, Guihai Chen, Jie Wu",
        year: "2025",
        title: "SEEN: Synergistic Early-Exit Networks for Efficient On-Device Inference in Dynamic Environments",
        venue: "under review"
      },
      {
        firstAuthor: "Shangyu Liu",
        otherAuthors: "Yan Zhuang, Zhenzhe Zheng, Bingshuai Li, Yunfeng Shao, Fan Wu, Guihai Chen",
        year: "2025",
        title: "Enhancing On-Device LLM Performance with Adaptive Cloud-based KV-Cache Retrieval",
        venue: "under research"
      },
      {
        firstAuthor: "刘尚育",
        otherAuthors: "李秉帅, 邵云峰, 张煜, 嵇飞飞",
        year: "2025",
        title: "一种神经网络训练方法以及相关设备",
        venue: "CN Patent CN1198-86280A, filed Feb 04, 2024, and issued Apr 25, 2025"
      }
    ]
  };

  // 实习经历数据
  const internships = {
    undergraduate: [
      {
        company: "东北大学NLP实验室 | 小牛翻译团队",
        date: "2019.1 - 2019.2",
        description: "探索生成式自动文本摘要领域，在CNN/DailyMail数据集上复现了Google的经典摘要模型TextSum，是中文互联网最早的公开复现。开发面向句法纠错任务的数据合成工具，支持插入、删除、替换、换序四种类型标注，在CGED 2016数据集上相比Python的difflib标准库整体准确率提升15.5%。"
      }
    ],
    graduate: [
      {
        company: "华为数通网络路由技术实验室",
        date: "2024.11 - 至今",
        description: "研究面向KV检索即服务的通信压缩技术，在确保用户原始请求不上云的前提下，实现对云侧文档KV的高效压缩传输，显著降低端云分布式检索增强生成时的首token延迟。计划投稿至WWW 2026。"
      },
      {
        company: "中国电信云计算研究院",
        date: "2024.7 - 2025.6",
        description: "研究端云分布式大模型检索增强生成技术，通过端侧个性化隐私文档与云侧大规模通用知识的有机融合，提升大模型生成质量。提出持续生成、异步融合的投机融合机制与融合位置贪心调度算法，通过优化通信与解码过程的流水线覆盖，有效降低端到端解码时延。在MacBook Pro和GPU服务器上完成了原型系统部署验证。形成学术论文1篇，入选计算机网络领域顶会ACM MobiHoc 2025。"
      },
      {
        company: "华为诺亚方舟实验室",
        date: "2022.7 - 2023.6",
        description: "研究端云分布式早退网络训练和推理框架，首次提出支持低资源终端的多分支早退神经网络联邦训练算法。通过云侧多入口共享模型、端侧多出口个性化模型协同设计，实现运行时基于样本难度与计算资源动态调整推理路径。相关技术已申请发明专利1 项。"
      }
    ]
  };

  // 项目数据
  const projects = [
    "[纵向] 科技部，科技创新2030-新一代人工智能重大项目，大小模型端云协同进化与系统",
    "[纵向] 国家自然科学基金，重点项目，面向异构终端的端边协同智能计算关键技术研究",
    "[纵向] 国家自然科学基金，重点项目，大数据共享与交易中的数据安全可信研究",
    "[纵向] 科技部，国家重点研发计划\"先进计算与新兴软件\"重点专项，自演进异构融合的边缘智能计算系统",
    "[纵向] 国家自然科学基金委—中电科联合基金项目，大小模型融合的联邦持续学习方法",
    "[纵向] 国家自然科学基金，\"生成式人工智能基础研究\"专项项目，大模型的高效训练和推理方法研究",
    "[纵向] 科技部，\"战略性科技创新合作\"重点专项联合研发与示范项目",
    "[纵向] 国家自然科学基金，优秀青年科学基金项目，容忍不完全信息的高效网络资源管理",
    "[纵向] 教育部，长江学者奖励计划青年学者项目",
    "[纵向] 国防科大某合作项目",
    "[横向] 华为数通网络路由技术实验室端云协同推理合作项目",
    "[横向] 华为数通网络路由技术实验室端云协同推理咨询项目",
    "[横向] 中国电信云计算研究院合作项目",
    "[横向] 华为诺亚方舟实验室联邦学习合作项目"
  ];

  // 通用时期渲染函数
  const renderPeriod = (
    title: string,
    items: any[],
    itemRenderer: (item: any, index: number) => React.ReactNode,
    customStyles?: React.CSSProperties,
    customClassName?: string
  ) => (
    items.length > 0 && (
      <div className={styles.row}>
        <h4 style={{ width: "120px" }}>
          {title}<span style={{ fontSize: "12px", color: "#666" }}>({items.length}项)</span>
        </h4>
        <ul className={`${styles.column} ${customClassName || ''}`} style={{ paddingLeft: "20px", ...customStyles }}>
          {items.map((item, index) => (
            <li key={index}>{itemRenderer(item, index)}</li>
          ))}
        </ul>
      </div>
    )
  );

  // 通用渲染函数
  const renderPeriodSection = (
    data: { undergraduate: any[]; graduate: any[] },
    sectionTitle: string,
    itemRenderer: (item: any, index: number) => React.ReactNode,
    customStyles?: React.CSSProperties
  ) => (
    <>
      <h3>{sectionTitle}</h3>
      {renderPeriod("本科时期", data.undergraduate, itemRenderer, customStyles)}
      {renderPeriod("博士时期", data.graduate, itemRenderer, customStyles)}
    </>
  );

  // 实习经历专用渲染函数
  const renderInternshipSection = () => {
    const internshipRenderer = (internship: any) => (
      <>
        <p className={styles.company}>{internship.company}</p>
        <p className={styles.date}>{internship.date}</p>
        <p className={styles.description}>{internship.description}</p>
      </>
    );

    return (
      <>
        <h3>实习经历</h3>
        {renderPeriod("本科期间", internships.undergraduate, internshipRenderer, { columnCount: 1 }, styles.experience)}
        {renderPeriod("博士期间", internships.graduate, internshipRenderer, undefined, styles.experience)}
      </>
    );
  };

  // 论文专利专用渲染函数
  const renderPapersSection = () => {
    const paperRenderer = (paper: any) => (
      <>
        <strong>{paper.firstAuthor}</strong>, {paper.otherAuthors}, {paper.year}, <strong>{paper.title}</strong>, <span className={styles.textit}>{paper.venue}</span>
      </>
    );

    return (
      <>
        <h3>论文专利</h3>
        {renderPeriod("博士时期", papers.graduate, paperRenderer, { columnCount: 1 })}
      </>
    );
  };

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

      {renderPeriodSection(awards, "荣誉奖项", (award) => award)}

      {renderPeriodSection(workExperience, "组织工作", (work) => work)}
      {renderPeriodSection(teachingExperience, "讲授课程", (course) => course)}
      {renderPapersSection()}
      {renderPeriodSection(personalProjects, "个人项目", (project) => project)}
      {renderInternshipSection()}
      <h3>本子经历</h3>
      <div className={styles.row}>
        <h4 style={{ width: "120px" }}>博士期间<span style={{ fontSize: "12px", color: "#666" }}>({projects.length}项)</span></h4>
        <ul className={`${styles.column}`} style={{ paddingLeft: "20px" }}>
          {projects.map((project, index) => (
            <li key={index}>{project}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default About;
