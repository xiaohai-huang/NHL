import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import GameGrid from "./components/GameGrid";

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<p>Home Page</p>} />
        <Route path="game-grid" element={<GameGrid />} />
      </Routes>
    </Router>
  );
}

export default App;
