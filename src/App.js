import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Sections from './Sections';
import Students from './Students';
import Scores from './Scores';
import Subjects from './Subjects';
import Compare from './Compare';

function App() {
  return (
    // <MuiThemeProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/compare" element={<Compare />} />
            <Route path="/departments" element={<Sections />} />
            <Route path="/students" element={<Students />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/" element={<Home />} />
            <Route path='/subjects' element={<Subjects />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
