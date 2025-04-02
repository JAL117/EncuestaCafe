import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Identificacion from './Actores/Identificacion';
import Experiencia from './Actores/Experiencia';
import Calificaciones from './Actores/Calificaciones';
import Bienvenida from './Bienvenida';
import ProductorInfo from './Diagnostico/ProductorInfo';
import VariedadCafe from './Diagnostico/VariedadCafe';
import SiembraCaracteristicas from './Diagnostico/SiembraCaracteristicas';
import CosechaDespulpado from './Diagnostico/CosechaDespulpado';
import LavadoFermentacion from './Diagnostico/LavadoFermentacion';
import ProcesoLavado from './Diagnostico/ProcesoLavado';
import ProcesoSecado from './Diagnostico/ProcesoSecado';
import Almacenamiento from './Diagnostico/Almacenamiento';
import ProcesoTostado from './Diagnostico/ProcesoTostado';
import CalidadTaza from './Diagnostico/CalidadTaza';


function App() {
  return (
    <Router>
      <Routes>
   
        <Route path="/" element={<Bienvenida/>}/>

        //Actores
        <Route path="/identificacion" element={<Identificacion />}/>
        <Route path="/experiencia" element={<Experiencia />}/>
        <Route path="/calificaciones" element={<Calificaciones />}/>

        //Diagnostico
        <Route path="/productorinfo" element={<ProductorInfo/>}/>
        <Route path="/variedadcafe" element={<VariedadCafe/>}/>
        <Route path="/siembracaracteristicas" element={<SiembraCaracteristicas/>}/>
        <Route path="/cosechadespulpado" element={<CosechaDespulpado/>}/>
        <Route path="/lavadofermentacion" element={<LavadoFermentacion/>}/>
        <Route path="/procesolavado" element={<ProcesoLavado/>}/>
        <Route path="/procesosecado" element={<ProcesoSecado/>}/>
        <Route path="/almacenamiento" element={<Almacenamiento/>}/>
        <Route path="/procesotostado" element={<ProcesoTostado/>}/>
        <Route path="/calidadtaza" element={<CalidadTaza/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;