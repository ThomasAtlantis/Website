import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout";
import Home from "@/pages/Home";
import Literature from "@/pages/Literature";
import Art from "@/pages/Art";
import Technology from "@/pages/Technology";
import Project from "@/pages/Project";
import Activity from "@/pages/Activity";
import About from "@/pages/About";
import DetailArticle from "@/pages/DetailArticle";

// 处理重定向的组件
function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查是否有保存的重定向路径
    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath && redirectPath !== location.pathname) {
      // 清除保存的路径
      sessionStorage.removeItem('redirect');
      // 导航到正确的路径
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <RedirectHandler />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/literature" element={<Literature />} />
          <Route path="/literature/:id" element={<DetailArticle />} />
          <Route path="/art" element={<Art />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/project" element={<Project />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/about" element={<About />} />
          {/* 404路由 - 重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
