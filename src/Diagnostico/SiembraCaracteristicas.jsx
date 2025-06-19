import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// const API_ENDPOINT = 'http://localhost:3000';

// const PREGUNTA_IDS = {
//     practicasCafetal: 9,
//     analisisSuelos: 10,
//     monitoreoPlagas: 11,
//     tipoSombra: 12,
//     recursosPlantaciones: 13,
//     recursosOtro: 14,
//     historialEnfermedadesAnteriorSiNo: 15,
//     historialEnfermedadesUltimaSiNo: 16,
//     enfermedadPlagaAnterior: 17,
//     controlAnterior: 18,
//     enfermedadPlagaUltima: 19,
//     controlUltima: 20,
//     tipoArbolesSombra: 21,
// };

// function SiembraCaracteristicas() {
//     const [formData, setFormData] = useState({
//         practicasCafetal: { prepSuelo: false, siembraSem: false, trasplante: false },
//         analisisSuelos: null, // 'si' o 'no'
//         monitoreoPlagas: null,
//         tipoSombra: '',
//         recursosPlantaciones: { fertilizacionQuimica: false, abonosOrganicos: false, herbicidas: false, otro: false },
//         recursosOtro: '',
//         historialEnfermedadesAnteriorSiNo: null,
//         historialEnfermedadesUltimaSiNo: null,
//         enfermedadPlagaAnterior: '',
//         controlAnterior: '',
//         enfermedadPlagaUltima: '',
//         controlUltima: '',
//         tipoArbolesSombra: '',
//     });
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();
//     const [productorId, setProductorId] = useState(null);

//     const primaryColor = '#0B9785';
//     const secondaryColor = '#BF1029';
//     const baseColor = '#E0E4E4';
//     const textColor = '#000000';
//     const tertiaryColor = '#D15078';

//     useEffect(() => {
//         const id = localStorage.getItem('currentProductorId');
//         if (!id) {
//             navigate('/');
//             return;
//         }
//         setProductorId(id);
//     }, [navigate]);

//      const handleChange = (e) => {
//         const { name, value } = e.target;
//          setFormData(prev => ({ ...prev, [name]: value }));
//         if (error) setError('');
//         };

//      const handleRadioChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));

//         if (name === 'historialEnfermedadesAnteriorSiNo' && value === 'no') {
//             setFormData(prev => ({ ...prev, enfermedadPlagaAnterior: '', controlAnterior: '' }));
//         }
//         if (name === 'historialEnfermedadesUltimaSiNo' && value === 'no') {
//              setFormData(prev => ({ ...prev, enfermedadPlagaUltima: '', controlUltima: '' }));
//         }
//         if (error) setError('');
//     };

//      const handleCheckboxChange = (e) => {
//         const { name, checked, dataset } = e.target;
//         const group = dataset.group;

//         setFormData(prev => ({
//             ...prev,
//             [group]: {
//                 ...prev[group],
//                 [name]: checked,
//             }
//         }));

//         if (group === 'recursosPlantaciones' && name === 'otro' && !checked) {
//              setFormData(prev => ({ ...prev, recursosOtro: '' }));
//         }
//         if (error) setError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         const practicasSelected = Object.values(formData.practicasCafetal).some(v => v);
//         const recursosSelected = Object.values(formData.recursosPlantaciones).some(v => v);
//         if (!practicasSelected || formData.analisisSuelos === null || formData.monitoreoPlagas === null || !formData.tipoSombra || !recursosSelected || formData.historialEnfermedadesAnteriorSiNo === null || formData.historialEnfermedadesUltimaSiNo === null || !formData.tipoArbolesSombra ) {
//              setError('Por favor, complete todas las selecciones y campos obligatorios.');
//              return;
//         }
//          if (formData.recursosPlantaciones.otro && !formData.recursosOtro) {
//              setError('Si seleccionó "otro" recurso, por favor especifíquelo.');
//              return;
//         }
//          if (formData.historialEnfermedadesAnteriorSiNo === 'si' && (!formData.enfermedadPlagaAnterior || !formData.controlAnterior)) {
//              setError('Si hubo enfrecuermedades en años anteriores, indique la Plaga/Enfermedad y el Control.');
//              return;
//         }
//         if (formData.historialEnfermedadesUltimaSiNo === 'si' && (!formData.enfermedadPlagaUltima || !formData.controlUltima)) {
//              setError('Si hubo enfermedades en la última cosecha, indique la Plaga/Enfermedad y el Control.');
//              return;
//         }

//         const dataToSend = {
//             productorId: productorId,
//             respuestas: []
//         };

//         const practicasSeleccionadas = Object.entries(formData.practicasCafetal)
//             .filter(([_, selected]) => selected)
//             .map(([key]) => key)
//             .join(', ');
//         addRespuesta(PREGUNTA_IDS.practicasCafetal, practicasSeleccionadas);

//         const addData = (key, value) => {
//              if (value !== null && value !== '' && PREGUNTA_IDS[key]) {
//                  dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(value) });
//              }
//         };

//         const practicasResp = Object.entries(formData.practicasCafetal).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
//         if(practicasResp) addData('practicasCafetal', practicasResp);

//         addData('analisisSuelos', formData.analisisSuelos);
//         addData('monitoreoPlagas', formData.monitoreoPlagas);
//         addData('tipoSombra', formData.tipoSombra);

//         const recursosResp = Object.entries(formData.recursosPlantaciones).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
//         if(recursosResp) addData('recursosPlantaciones', recursosResp);
//         if(formData.recursosPlantaciones.otro && formData.recursosOtro) addData('recursosOtro', formData.recursosOtro);

//         addData('historialEnfermedadesAnteriorSiNo', formData.historialEnfermedadesAnteriorSiNo);
//         addData('historialEnfermedadesUltimaSiNo', formData.historialEnfermedadesUltimaSiNo);
//         addData('enfermedadPlagaAnterior', formData.enfermedadPlagaAnterior);
//         addData('controlAnterior', formData.controlAnterior);
//         addData('enfermedadPlagaUltima', formData.enfermedadPlagaUltima);
//         addData('controlUltima', formData.controlUltima);
//         addData('tipoArbolesSombra', formData.tipoArbolesSombra);

//         console.log('Datos a enviar (Siembra):', dataToSend);
//         setIsLoading(true);

//         try {
//             const response = await axios.post(`${API_ENDPOINT}/siembraCaracteristicas`, dataToSend, {
//                 headers: { 'Content-Type': 'application/json' },
//             });

//             console.log('API Response (Siembra):', response.data);
//             navigate('/cosechacaracteristicas');
//         } catch (err) {
//             console.error('API Error (Siembra):', err);
//             setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const practicasOptions = { prepSuelo: 'Preparación del Suelo', siembraSem: 'Siembra semilleros', trasplante: 'Trasplante de Cafetales' };
//     const sombraOptions = ['Monoespecífica', 'Diversificada', 'Frutales'];
//     const recursosOptions = { fertilizacionQuimica: 'Fertilización química', abonosOrganicos: 'Abonos orgánicos', herbicidas: 'Herbicidas', otro: 'Otro' };
//     const arbolesSombraOptions = ['Maderables', 'Frutales', 'Otros'];

//     return (
//          <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
//             <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '80%' }}>
//                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
//                      <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
//                         Caracterización de la Siembra
//                     </h4>

//                     {error && (
//                         <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
//                     )}

//                     <form onSubmit={handleSubmit}>

//                         <div className="mb-3">
//                              <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.practicasCafetal}.- De acuerdo al cafetal: Marque lo que realiza:</label>
//                              {Object.entries(practicasOptions).map(([key, label]) => (
//                                  <div className="form-check" key={key}>
//                                      <input className="form-check-input" type="checkbox" name={key} id={`practica_${key}`} data-group="practicasCafetal" checked={formData.practicasCafetal[key]} onChange={handleCheckboxChange} disabled={isLoading} />
//                                      <label className="form-check-label" htmlFor={`practica_${key}`}>{label}</label>
//                                  </div>
//                              ))}
//                         </div>

//                         <div className="row mb-3">
//                              <div className="col-md-6">
//                                  <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.analisisSuelos}.- Realiza análisis de Suelos:</label>
//                                   <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="analisisSuelos" id="analisisSi" value="si" checked={formData.analisisSuelos === 'si'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="analisisSi">Si</label>
//                                   </div>
//                                   <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="analisisSuelos" id="analisisNo" value="no" checked={formData.analisisSuelos === 'no'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="analisisNo">No</label>
//                                   </div>
//                              </div>
//                              <div className="col-md-6">
//                                  <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.monitoreoPlagas}.- Realiza monitoreo de Plagas:</label>
//                                   <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="monitoreoPlagas" id="monitoreoSi" value="si" checked={formData.monitoreoPlagas === 'si'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="monitoreoSi">Si</label>
//                                   </div>
//                                   <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="monitoreoPlagas" id="monitoreoNo" value="no" checked={formData.monitoreoPlagas === 'no'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="monitoreoNo">No</label>
//                                   </div>
//                              </div>
//                         </div>

//                         <div className="mb-3">
//                              <label htmlFor="tipoSombra" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.tipoSombra}.- ¿Qué tipo de sombra tiene?</label>
//                               <select className="form-select" id="tipoSombra" name="tipoSombra" value={formData.tipoSombra} onChange={handleChange} disabled={isLoading}>
//                                  <option value="" disabled>Seleccione...</option>
//                                  {sombraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                              </select>
//                         </div>

//                          <div className="mb-3">
//                              <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.recursosPlantaciones}.- Recursos utilizados en las plantaciones de café:</label>
//                              {Object.entries(recursosOptions).map(([key, label]) => (
//                                  <div className="form-check" key={key}>
//                                      <input className="form-check-input" type="checkbox" name={key} id={`recurso_${key}`} data-group="recursosPlantaciones" checked={formData.recursosPlantaciones[key]} onChange={handleCheckboxChange} disabled={isLoading} />
//                                      <label className="form-check-label" htmlFor={`recurso_${key}`}>{label}</label>
//                                  </div>
//                              ))}
//                              {formData.recursosPlantaciones.otro && (
//                                  <div className="mt-2">
//                                      <input type="text" className="form-control form-control-sm" name="recursosOtro" value={formData.recursosOtro} onChange={handleChange} placeholder="Indique cuál otro recurso" disabled={isLoading} />
//                                  </div>
//                              )}
//                          </div>

//                          <div className="mb-3 border p-3 rounded" style={{ borderColor: tertiaryColor }}>
//                              <label className="form-label d-block mb-2" style={{ color: primaryColor, fontWeight: 'bold' }}>Historial de Enfermedades de los cafetos:</label>
//                              {/* Años Anteriores */}
//                              <div className="mb-2">
//                                  <label className="form-label d-inline me-2" style={{ fontWeight: 'normal' }}>{PREGUNTA_IDS.historialEnfermedadesAnteriorSiNo}.- Años anteriores:</label>
//                                  <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="historialEnfermedadesAnteriorSiNo" id="anteriorSi" value="si" checked={formData.historialEnfermedadesAnteriorSiNo === 'si'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="anteriorSi">Si</label>
//                                   </div>
//                                   <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="historialEnfermedadesAnteriorSiNo" id="anteriorNo" value="no" checked={formData.historialEnfermedadesAnteriorSiNo === 'no'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="anteriorNo">No</label>
//                                   </div>
//                                  {formData.historialEnfermedadesAnteriorSiNo === 'si' && (
//                                      <div className="row mt-2">
//                                          <div className="col-md-6">
//                                              <input type="text" className="form-control form-control-sm" name="enfermedadPlagaAnterior" value={formData.enfermedadPlagaAnterior} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.enfermedadPlagaAnterior}) Enfermedad/Plaga`} disabled={isLoading} />
//                                          </div>
//                                          <div className="col-md-6">
//                                               <input type="text" className="form-control form-control-sm" name="controlAnterior" value={formData.controlAnterior} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.controlAnterior}) Control`} disabled={isLoading} />
//                                          </div>
//                                      </div>
//                                  )}
//                              </div>
//                              {/* Última Cosecha */}
//                              <div>
//                                  <label className="form-label d-inline me-2" style={{ fontWeight: 'normal' }}>{PREGUNTA_IDS.historialEnfermedadesUltimaSiNo}.- Última Cosecha:</label>
//                                   <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="historialEnfermedadesUltimaSiNo" id="ultimaSi" value="si" checked={formData.historialEnfermedadesUltimaSiNo === 'si'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="ultimaSi">Si</label>
//                                   </div>
//                                   <div className="form-check form-check-inline">
//                                       <input className="form-check-input" type="radio" name="historialEnfermedadesUltimaSiNo" id="ultimaNo" value="no" checked={formData.historialEnfermedadesUltimaSiNo === 'no'} onChange={handleRadioChange} disabled={isLoading} />
//                                       <label className="form-check-label" htmlFor="ultimaNo">No</label>
//                                   </div>
//                                  {formData.historialEnfermedadesUltimaSiNo === 'si' && (
//                                      <div className="row mt-2">
//                                          <div className="col-md-6">
//                                              <input type="text" className="form-control form-control-sm" name="enfermedadPlagaUltima" value={formData.enfermedadPlagaUltima} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.enfermedadPlagaUltima}) Enfermedad/Plaga`} disabled={isLoading} />
//                                          </div>
//                                          <div className="col-md-6">
//                                              <input type="text" className="form-control form-control-sm" name="controlUltima" value={formData.controlUltima} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.controlUltima}) Control`} disabled={isLoading} />
//                                          </div>
//                                      </div>
//                                  )}
//                              </div>
//                          </div>

//                          <div className="mb-3">
//                              <label htmlFor="tipoArbolesSombra" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.tipoArbolesSombra}.- Tipo de árboles para sombra:</label>
//                              <select className="form-select" id="tipoArbolesSombra" name="tipoArbolesSombra" value={formData.tipoArbolesSombra} onChange={handleChange} disabled={isLoading}>
//                                  <option value="" disabled>Seleccione...</option>
//                                  {arbolesSombraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                              </select>
//                         </div>

//                         <div className="d-flex justify-content-center mt-4">
//                             <button type="submit" className="btn btn-lg px-4" style={{ background: secondaryColor, color: 'white', borderRadius: '25px', fontWeight: 'bold' }} disabled={isLoading}>
//                                 {isLoading ? 'Guardando...' : 'Siguiente'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SiembraCaracteristicas;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_ENDPOINT = "http://localhost:3000";

const PREGUNTA_IDS = {
  practicasCafetal: 9,
  analisisSuelos: 10,
  monitoreoPlagas: 11,
  tipoSombra: 12,
  recursosPlantaciones: 13,
  recursosOtro: 14,
  historialEnfermedadesAnteriorSiNo: 15,
  historialEnfermedadesUltimaSiNo: 16,
  enfermedadPlagaAnterior: 17,
  controlAnterior: 18,
  enfermedadPlagaUltima: 19,
  controlUltima: 20,
  tipoArbolesSombra: 21,
};

function SiembraCaracteristicas() {
    const [formData, setFormData] = useState({
        practicasCafetal: { prepSuelo: false, siembraSem: false, trasplante: false },
        analisisSuelos: null,
        monitoreoPlagas: null, 
        tipoSombra: '',
        recursosPlantaciones: { fertilizacionQuimica: false, abonosOrganicos: false, herbicidas: false, otro: false },
        recursosOtro: '',
        historialEnfermedadesAnteriorSiNo: null, 
        historialEnfermedadesUltimaSiNo: null, 
        enfermedadPlagaAnterior: '',
        controlAnterior: '',
        enfermedadPlagaUltima: '',
        controlUltima: '',
        tipoArbolesSombra: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [productorId, setProductorId] = useState(null);

  // Colores y estilos
  const primaryColor = "#0B9785";
  const secondaryColor = "#BF1029";
  const baseColor = "#E0E4E4";
  const tertiaryColor = "#D15078";

  // Obtener productorId al cargar el componente
  useEffect(() => {
    const id = localStorage.getItem("currentProductorId");
    if (!id) {
      navigate("/");
      return;
    }
    setProductorId(id);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Resetear campos condicionales cuando se cambia a "no"
    if (name === "historialEnfermedadesAnteriorSiNo" && value === "no") {
      setFormData((prev) => ({
        ...prev,
        enfermedadPlagaAnterior: "",
        controlAnterior: "",
      }));
    }
    if (name === "historialEnfermedadesUltimaSiNo" && value === "no") {
      setFormData((prev) => ({
        ...prev,
        enfermedadPlagaUltima: "",
        controlUltima: "",
      }));
    }
    if (error) setError("");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, dataset } = e.target;
    const group = dataset.group;

    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [name]: checked,
      },
    }));

        if (group === 'recursosPlantaciones' && name === 'otro' && !checked) {
             setFormData(prev => ({ ...prev, recursosOtro: '' }));
        }
        if (error) setError('');
    };

        useEffect(() => {
            const id = localStorage.getItem('currentProductorId');
            if (!id) {
                navigate('/');
                return;
            }
            setProductorId(id);
        }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    const practicasSelected = Object.values(formData.practicasCafetal).some(
      (v) => v
    );
    const recursosSelected = Object.values(formData.recursosPlantaciones).some(
      (v) => v
    );

    if (
      !practicasSelected ||
      formData.analisisSuelos === null ||
      formData.monitoreoPlagas === null ||
      !formData.tipoSombra ||
      !recursosSelected ||
      formData.historialEnfermedadesAnteriorSiNo === null ||
      formData.historialEnfermedadesUltimaSiNo === null ||
      !formData.tipoArbolesSombra
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (formData.recursosPlantaciones.otro && !formData.recursosOtro) {
      setError('Si seleccionó "otro" recurso, por favor especifíquelo.');
      return;
    }

    if (
      formData.historialEnfermedadesAnteriorSiNo === "si" &&
      (!formData.enfermedadPlagaAnterior || !formData.controlAnterior)
    ) {
      setError(
        "Si hubo enfermedades en años anteriores, indique la Plaga/Enfermedad y el Control."
      );
      return;
    }

    if (
      formData.historialEnfermedadesUltimaSiNo === "si" &&
      (!formData.enfermedadPlagaUltima || !formData.controlUltima)
    ) {
      setError(
        "Si hubo enfermedades en la última cosecha, indique la Plaga/Enfermedad y el Control."
      );
      return;
    }


        
        const dataToSend = [];

        
        const addData = (key, value) => {
             if (value !== null && value !== '' && PREGUNTA_IDS[key]) {
                 dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(value), productorId });
             }
        };

        const practicasResp = Object.entries(formData.practicasCafetal).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
        if(practicasResp) addData('practicasCafetal', practicasResp);

        addData('analisisSuelos', formData.analisisSuelos);
        addData('monitoreoPlagas', formData.monitoreoPlagas);
        addData('tipoSombra', formData.tipoSombra);

        const recursosResp = Object.entries(formData.recursosPlantaciones).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
        if(recursosResp) addData('recursosPlantaciones', recursosResp);
        if(formData.recursosPlantaciones.otro && formData.recursosOtro) addData('recursosOtro', formData.recursosOtro);

        addData('historialEnfermedadesAnteriorSiNo', formData.historialEnfermedadesAnteriorSiNo);
        addData('historialEnfermedadesUltimaSiNo', formData.historialEnfermedadesUltimaSiNo);
        addData('enfermedadPlagaAnterior', formData.enfermedadPlagaAnterior);
        addData('controlAnterior', formData.controlAnterior);
        addData('enfermedadPlagaUltima', formData.enfermedadPlagaUltima);
        addData('controlUltima', formData.controlUltima);
        addData('tipoArbolesSombra', formData.tipoArbolesSombra);


        console.log('Datos a enviar (Siembra):', dataToSend);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_ENDPOINT}/siembraCaracteristicas`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('API Response (Siembra):', response.data);
            navigate('/cosechadespulpado');
        } catch (err) {
            console.error('API Error (Siembra):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const practicasOptions = { prepSuelo: 'Preparación del Suelo', siembraSem: 'Siembra semilleros', trasplante: 'Trasplante de Cafetales' };
    const sombraOptions = ['Monoespecífica', 'Diversificada', 'Frutales'];
    const recursosOptions = { fertilizacionQuimica: 'Fertilización química', abonosOrganicos: 'Abonos orgánicos', herbicidas: 'Herbicidas', otro: 'Otro' };
    const arbolesSombraOptions = ['Maderables', 'Frutales', 'Otros'];


  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4"
      style={{ backgroundColor: baseColor }}
    >
      <div
        className="card shadow-lg border-0"
        style={{ width: "100%", maxWidth: "80%" }}
      >
        <div
          className="card-body"
          style={{ background: baseColor, padding: "30px 25px" }}
        >
          <h4
            className="card-title text-center mb-4"
            style={{ color: primaryColor }}
          >
            Caracterización de la Siembra
          </h4>

          {error && (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ borderRadius: "15px" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Sección de Prácticas Cafetal */}
            <div className="mb-3">
              <label
                className="form-label d-block"
                style={{ color: primaryColor, fontWeight: "bold" }}
              >
                {PREGUNTA_IDS.practicasCafetal}.- De acuerdo al cafetal: Marque
                lo que realiza:
              </label>
              {Object.entries(practicasOptions).map(([key, label]) => (
                <div className="form-check" key={key}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={key}
                    id={`practica_${key}`}
                    data-group="practicasCafetal"
                    checked={formData.practicasCafetal[key]}
                    onChange={handleCheckboxChange}
                    disabled={isLoading}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`practica_${key}`}
                  >
                    {label}
                  </label>
                </div>
              ))}

              {formData.practicasCafetal.otro && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Especifique la práctica"
                  name="practicasOtro"
                  value={formData.practicasOtro}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              )}
            </div>

            {/* Sección de Análisis de Suelos y Monitoreo de Plagas */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label
                  className="form-label d-block"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                >
                  {PREGUNTA_IDS.analisisSuelos}.- Realiza análisis de Suelos:
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="analisisSuelos"
                    id="analisisSi"
                    value="si"
                    checked={formData.analisisSuelos === "si"}
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="analisisSi">
                    Si
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="analisisSuelos"
                    id="analisisNo"
                    value="no"
                    checked={formData.analisisSuelos === "no"}
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="analisisNo">
                    No
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <label
                  className="form-label d-block"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                >
                  {PREGUNTA_IDS.monitoreoPlagas}.- Realiza monitoreo de Plagas:
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="monitoreoPlagas"
                    id="monitoreoSi"
                    value="si"
                    checked={formData.monitoreoPlagas === "si"}
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="monitoreoSi">
                    Si
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="monitoreoPlagas"
                    id="monitoreoNo"
                    value="no"
                    checked={formData.monitoreoPlagas === "no"}
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="monitoreoNo">
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Tipo de Sombra */}
            <div className="mb-3">
              <label
                htmlFor="tipoSombra"
                className="form-label"
                style={{ color: primaryColor, fontWeight: "bold" }}
              >
                {PREGUNTA_IDS.tipoSombra}.- ¿Qué tipo de sombra tiene?
              </label>
              <select
                className="form-select"
                id="tipoSombra"
                name="tipoSombra"
                value={formData.tipoSombra}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Seleccione...
                </option>
                {sombraOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Recursos Utilizados */}
            <div className="mb-3">
              <label
                className="form-label d-block"
                style={{ color: primaryColor, fontWeight: "bold" }}
              >
                {PREGUNTA_IDS.recursosPlantaciones}.- Recursos utilizados en las
                plantaciones de café:
              </label>
              {Object.entries(recursosOptions).map(([key, label]) => (
                <div className="form-check" key={key}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={key}
                    id={`recurso_${key}`}
                    data-group="recursosPlantaciones"
                    checked={formData.recursosPlantaciones[key]}
                    onChange={handleCheckboxChange}
                    disabled={isLoading}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`recurso_${key}`}
                  >
                    {label}
                  </label>
                </div>
              ))}
              {formData.recursosPlantaciones.otro && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="recursosOtro"
                    value={formData.recursosOtro}
                    onChange={handleChange}
                    placeholder="Indique cuál otro recurso"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Historial de Enfermedades */}
            <div
              className="mb-3 border p-3 rounded"
              style={{ borderColor: tertiaryColor }}
            >
              <label
                className="form-label d-block mb-2"
                style={{ color: primaryColor, fontWeight: "bold" }}
              >
                Historial de Enfermedades de los cafetos:
              </label>

              {/* Años Anteriores */}
              <div className="mb-2">
                <label
                  className="form-label d-inline me-2"
                  style={{ fontWeight: "normal" }}
                >
                  {PREGUNTA_IDS.historialEnfermedadesAnteriorSiNo}.- Años
                  anteriores:
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="historialEnfermedadesAnteriorSiNo"
                    id="anteriorSi"
                    value="si"
                    checked={
                      formData.historialEnfermedadesAnteriorSiNo === "si"
                    }
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="anteriorSi">
                    Si
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="historialEnfermedadesAnteriorSiNo"
                    id="anteriorNo"
                    value="no"
                    checked={
                      formData.historialEnfermedadesAnteriorSiNo === "no"
                    }
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="anteriorNo">
                    No
                  </label>
                </div>
                {formData.historialEnfermedadesAnteriorSiNo === "si" && (
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="enfermedadPlagaAnterior"
                        value={formData.enfermedadPlagaAnterior}
                        onChange={handleChange}
                        placeholder={`(${PREGUNTA_IDS.enfermedadPlagaAnterior}) Enfermedad/Plaga`}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="controlAnterior"
                        value={formData.controlAnterior}
                        onChange={handleChange}
                        placeholder={`(${PREGUNTA_IDS.controlAnterior}) Control`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Última Cosecha */}
              <div>
                <label
                  className="form-label d-inline me-2"
                  style={{ fontWeight: "normal" }}
                >
                  {PREGUNTA_IDS.historialEnfermedadesUltimaSiNo}.- Última
                  Cosecha:
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="historialEnfermedadesUltimaSiNo"
                    id="ultimaSi"
                    value="si"
                    checked={formData.historialEnfermedadesUltimaSiNo === "si"}
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="ultimaSi">
                    Si
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="historialEnfermedadesUltimaSiNo"
                    id="ultimaNo"
                    value="no"
                    checked={formData.historialEnfermedadesUltimaSiNo === "no"}
                    onChange={handleRadioChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="ultimaNo">
                    No
                  </label>
                </div>
                {formData.historialEnfermedadesUltimaSiNo === "si" && (
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="enfermedadPlagaUltima"
                        value={formData.enfermedadPlagaUltima}
                        onChange={handleChange}
                        placeholder={`(${PREGUNTA_IDS.enfermedadPlagaUltima}) Enfermedad/Plaga`}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="controlUltima"
                        value={formData.controlUltima}
                        onChange={handleChange}
                        placeholder={`(${PREGUNTA_IDS.controlUltima}) Control`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tipo de Árboles para Sombra */}
            <div className="mb-3">
              <label
                htmlFor="tipoArbolesSombra"
                className="form-label"
                style={{ color: primaryColor, fontWeight: "bold" }}
              >
                {PREGUNTA_IDS.tipoArbolesSombra}.- Tipo de árboles para sombra:
              </label>
              <select
                className="form-select"
                id="tipoArbolesSombra"
                name="tipoArbolesSombra"
                value={formData.tipoArbolesSombra}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Seleccione...
                </option>
                {arbolesSombraOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de Envío */}
            <div className="d-flex justify-content-center mt-4">
              <button
                type="submit"
                className="btn btn-lg px-4"
                style={{
                  background: secondaryColor,
                  color: "white",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Siguiente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SiembraCaracteristicas;
