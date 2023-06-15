import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Sections from './Sections';
import Students from './Students';
import Scores from './Scores';
function App() {
  return (
    // <MuiThemeProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/departments" element={<Sections />} />
            <Route path="/students" element={<Students />} />
            <Route path="/scores" element={<Scores />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
