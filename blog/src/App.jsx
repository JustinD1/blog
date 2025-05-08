import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home.jsx";
import {Post} from "./pages/Post.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="post/:uuid" element={<Post/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
