import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home.jsx";
import {Post} from "./pages/Post.jsx";
import {ProtectedRoute} from "./components/ProtectedRoute.jsx";
import {AdminView} from "./pages/AdminView.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="post/:uuid" element={<Post/>}/>
        <Route path={"admin_view"} element={
          <ProtectedRoute>
            <AdminView/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
