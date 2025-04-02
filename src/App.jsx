import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Identificacion from './Actores/Identificacion';
import Experiencia from './Actores/Experiencia';
import Calificaciones from './Actores/Calificaciones';
import Bienvenida from './Bienvenida';
import ProductorInfo from './Diagnostico/ProductorInfo';
import VariedadCafe from './Diagnostico/VariedadCafe';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida/>} />
        <Route path="/identificacion" element={<Identificacion />} />
        <Route path="/experiencia" element={<Experiencia />} />
        <Route path="/calificaciones" element={<Calificaciones />} />
        <Route path="/productorinfo" element={<ProductorInfo/>} />
        <Route path="/variedadcafe" element={<VariedadCafe/>} />
      </Routes>
    </Router>
  );
}

export default App;