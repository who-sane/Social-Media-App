import { Home } from './pages/Home'
import { Route, Routes } from 'react-router'
import { Navbar } from './components/Navbar'
import { CreatePostPage } from './pages/CreatePostPage'
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
function App() {
  return (
    <div className="min-h-screen bg-rose-50 text-black-900 transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          } />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/community/create" element={
            <ProtectedRoute>
              <CreateCommunityPage />
            </ProtectedRoute>
          } />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
