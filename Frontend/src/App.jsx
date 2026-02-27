import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer"; // Import the footer
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/CommunityFeed";
import ScenariosFeed from "./pages/ScenariosFeed";
import ScenerioArena from "./pages/ScenarioArena";
import ReportIncident from "./pages/ReportIncident";
import CheckStatus from "./pages/CheckStatus";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isFullScreenPage = location.pathname === '/scenerio';

  const hideSidebar = isAuthPage || isFullScreenPage;

  return (
    <div className="flex bg-[#0b0813] h-screen overflow-hidden">
      {!hideSidebar && <Sidebar />}

      {/* Added 'flex flex-col' here so the footer 
          can stay at the bottom of the scrollable area 
      */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/scenarios" element={<ScenariosFeed />} />
            <Route path="/scenerio" element={<ScenerioArena />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/status" element={<CheckStatus />} /> 
            <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Only show footer if it's not a full-screen or auth page */}
        {!hideSidebar && <Footer />}
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;