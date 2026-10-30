import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './components/feedback/ToastProvider';
import { AppLayout } from './components/layout/AppLayout';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import Company from './components/pages/Company';
import NewProject from './components/pages/NewProject';
import Projects from './components/pages/Projects';
import Project from './components/pages/Project';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/company" element={<Company />} />
              <Route path="/newproject" element={<NewProject />} />
              <Route path="/project/:id" element={<Project />} />
            </Routes>
          </AppLayout>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
