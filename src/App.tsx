import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Literature from "@/pages/Literature";
import Art from "@/pages/Art";
import Technology from "@/pages/Technology";
import Project from "@/pages/Project";
import Activity from "@/pages/Activity";
import About from "@/pages/About";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/literature" element={<Literature />} />
          <Route path="/art" element={<Art />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/project" element={<Project />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}
