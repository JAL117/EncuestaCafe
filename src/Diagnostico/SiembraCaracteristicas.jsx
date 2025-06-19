import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3000';

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
        analisisSuelos: null, // 'si' o 'no'
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

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const textColor = '#000000';
    const tertiaryColor = '#D15078';

    useEffect(() => {
        const id = localStorage.getItem('currentProductorId');
        if (!id) {
            navigate('/');
            return;
        }
        setProductorId(id);
    }, [navigate]);

     const handleChange = (e) => {
        const { name, value } = e.target;
         setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        };

     const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'historialEnfermedadesAnteriorSiNo' && value === 'no') {
            setFormData(prev => ({ ...prev, enfermedadPlagaAnterior: '', controlAnterior: '' }));
        }
        if (name === 'historialEnfermedadesUltimaSiNo' && value === 'no') {
             setFormData(prev => ({ ...prev, enfermedadPlagaUltima: '', controlUltima: '' }));
        }
        if (error) setError('');
    };

     const handleCheckboxChange = (e) => {
        const { name, checked, dataset } = e.target;
        const group = dataset.group;

        setFormData(prev => ({
            ...prev,
            [group]: {
                ...prev[group],
                [name]: checked,
            }
        }));

        if (group === 'recursosPlantaciones' && name === 'otro' && !checked) {
             setFormData(prev => ({ ...prev, recursosOtro: '' }));
        }
        if (group === 'practicasCafetal' && name === 'otro' && !checked) {
             setFormData(prev => ({ ...prev, practicasOtro: '' }));
        }

        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const practicasSelected = Object.values(formData.practicasCafetal).some(v => v);
        const recursosSelected = Object.values(formData.recursosPlantaciones).some(v => v);
        if (!practicasSelected || formData.analisisSuelos === null || formData.monitoreoPlagas === null || !formData.tipoSombra || !recursosSelected || formData.historialEnfermedadesAnteriorSiNo === null || formData.historialEnfermedadesUltimaSiNo === null || !formData.tipoArbolesSombra ) {
             setError('Por favor, complete todas las selecciones y campos obligatorios.');
             return;
        }
         if (formData.recursosPlantaciones.otro && !formData.recursosOtro) {
             setError('Si seleccionó "otro" recurso, por favor especifíquelo.');
             return;
        }
         if (formData.historialEnfermedadesAnteriorSiNo === 'si' && (!formData.enfermedadPlagaAnterior || !formData.controlAnterior)) {
             setError('Si hubo enfrecuermedades en años anteriores, indique la Plaga/Enfermedad y el Control.');
             return;
        }
        if (formData.historialEnfermedadesUltimaSiNo === 'si' && (!formData.enfermedadPlagaUltima || !formData.controlUltima)) {
             setError('Si hubo enfermedades en la última cosecha, indique la Plaga/Enfermedad y el Control.');
             return;
        }

        setIsLoading(true);

        try {
            const respuestas = [];
            const currentProductorId = localStorage.getItem('currentProductorId');
            // Función auxiliar para agregar respuestas
            const addRespuesta = (preguntaId, respuesta) => {
                if (respuesta !== null && respuesta !== '') {
                    respuestas.push({
                        pregunta_id: preguntaId,
                        respuesta: String(respuesta),
                        productor_id: parseInt(currentProductorId, 10),
                    });
                }
            };

            // Procesar prácticas cafetal (pregunta 9)
            const practicasSeleccionadas = Object.entries(formData.practicasCafetal)
                .filter(([_, selected]) => selected)
                .map(([key]) => {
                    if (key === 'otro') {
                        return formData.practicasOtro
                            ? `Otro: ${formData.practicasOtro}`
                            : 'Otro';
                    }
                    return key;
                })
                .filter(Boolean)
                .join(', ');
            addRespuesta(PREGUNTA_IDS.practicasCafetal, practicasSeleccionadas);

            // Procesar recursos plantaciones (pregunta 13)
            const recursosSeleccionados = Object.entries(formData.recursosPlantaciones)
                .filter(([_, selected]) => selected)
                .map(([key]) => {
                    if (key === 'otro') {
                        return formData.recursosOtro
                            ? `Otro: ${formData.recursosOtro}`
                            : 'Otro';
                    }
                    return key;
                })
                .filter(Boolean)
                .join(', ');
            addRespuesta(PREGUNTA_IDS.recursosPlantaciones, recursosSeleccionados);

            // Agregar respuestas individuales
            addRespuesta(PREGUNTA_IDS.analisisSuelos, formData.analisisSuelos);
            addRespuesta(PREGUNTA_IDS.monitoreoPlagas, formData.monitoreoPlagas);
            addRespuesta(PREGUNTA_IDS.tipoSombra, formData.tipoSombra);

            // Recurso "otro" condicional (pregunta 14) - solo si es necesario
            if (formData.recursosPlantaciones.otro && formData.recursosOtro) {
                addRespuesta(PREGUNTA_IDS.recursosOtro, formData.recursosOtro);
            }

            // Historial enfermedades
            addRespuesta(
                PREGUNTA_IDS.historialEnfermedadesAnteriorSiNo,
                formData.historialEnfermedadesAnteriorSiNo
            );
            addRespuesta(
                PREGUNTA_IDS.historialEnfermedadesUltimaSiNo,
                formData.historialEnfermedadesUltimaSiNo
            );

            // Campos condicionales de enfermedades
            if (formData.historialEnfermedadesAnteriorSiNo === 'si') {
                addRespuesta(
                    PREGUNTA_IDS.enfermedadPlagaAnterior,
                    formData.enfermedadPlagaAnterior
                );
                addRespuesta(PREGUNTA_IDS.controlAnterior, formData.controlAnterior);
            }

            if (formData.historialEnfermedadesUltimaSiNo === 'si') {
                addRespuesta(
                    PREGUNTA_IDS.enfermedadPlagaUltima,
                    formData.enfermedadPlagaUltima
                );
                addRespuesta(PREGUNTA_IDS.controlUltima, formData.controlUltima);
            }

            addRespuesta(PREGUNTA_IDS.tipoArbolesSombra, formData.tipoArbolesSombra);

            // Preparar datos para enviar
            const dataToSend = {
                productor_id: parseInt(currentProductorId, 10),
                respuestas: respuestas,
            };

            console.log('Datos a enviar:', dataToSend);

            const response = await axios.post(
                `${API_ENDPOINT}/siembraCaracteristicas`,
                dataToSend,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            console.log('Respuesta del servidor:', response.data);
            if (response.data.ProductorID) {
                localStorage.setItem('currentProductorId', response.data.ProductorID);
            }
            navigate('/cosechadespulpado');
        } catch (err) {
            console.error('Error al guardar:', err);
            setError(
                `Error al guardar: ${err.response?.data?.message || err.message}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const practicasOptions = { prepSuelo: 'Preparación del Suelo', siembraSem: 'Siembra semilleros', trasplante: 'Trasplante de Cafetales', otro: 'Otro' };
    const sombraOptions = ['Monoespecífica', 'Diversificada', 'Frutales'];
    const recursosOptions = { fertilizacionQuimica: 'Fertilización química', abonosOrganicos: 'Abonos orgánicos', herbicidas: 'Herbicidas', otro: 'Otro' };
    const arbolesSombraOptions = ['Maderables', 'Frutales', 'Otros'];

    return (
         <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '80%' }}>
                <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                     <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización de la Siembra
                     </h4>

                     {error && (
                         <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                     )}

                     <form onSubmit={handleSubmit}>

                         <div className="mb-3">
                              <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.practicasCafetal}.- De acuerdo al cafetal: Marque lo que realiza:</label>
                              {Object.entries(practicasOptions).map(([key, label]) => (
                                  <div className="form-check" key={key}>
                                      <input className="form-check-input" type="checkbox" name={key} id={`practica_${key}`} data-group="practicasCafetal" checked={formData.practicasCafetal[key]} onChange={handleCheckboxChange} disabled={isLoading} />
                                      <label className="form-check-label" htmlFor={`practica_${key}`}>{label}</label>
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

                         <div className="row mb-3">
                              <div className="col-md-6">
                                  <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.analisisSuelos}.- Realiza análisis de Suelos:</label>
                                   <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="analisisSuelos" id="analisisSi" value="si" checked={formData.analisisSuelos === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="analisisSi">Si</label>
                                   </div>
                                   <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="analisisSuelos" id="analisisNo" value="no" checked={formData.analisisSuelos === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="analisisNo">No</label>
                                   </div>
                              </div>
                              <div className="col-md-6">
                                  <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.monitoreoPlagas}.- Realiza monitoreo de Plagas:</label>
                                   <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="monitoreoPlagas" id="monitoreoSi" value="si" checked={formData.monitoreoPlagas === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="monitoreoSi">Si</label>
                                   </div>
                                   <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="monitoreoPlagas" id="monitoreoNo" value="no" checked={formData.monitoreoPlagas === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="monitoreoNo">No</label>
                                   </div>
                              </div>
                         </div>

                         <div className="mb-3">
                              <label htmlFor="tipoSombra" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.tipoSombra}.- ¿Qué tipo de sombra tiene?</label>
                               <select className="form-select" id="tipoSombra" name="tipoSombra" value={formData.tipoSombra} onChange={handleChange} disabled={isLoading}>
                                  <option value="" disabled>Seleccione...</option>
                                  {sombraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                         </div>

                          <div className="mb-3">
                              <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.recursosPlantaciones}.- Recursos utilizados en las plantaciones de café:</label>
                              {Object.entries(recursosOptions).map(([key, label]) => (
                                  <div className="form-check" key={key}>
                                      <input className="form-check-input" type="checkbox" name={key} id={`recurso_${key}`} data-group="recursosPlantaciones" checked={formData.recursosPlantaciones[key]} onChange={handleCheckboxChange} disabled={isLoading} />
                                      <label className="form-check-label" htmlFor={`recurso_${key}`}>{label}</label>
                                  </div>
                              ))}
                              {formData.recursosPlantaciones.otro && (
                                  <div className="mt-2">
                                      <input type="text" className="form-control form-control-sm" name="recursosOtro" value={formData.recursosOtro} onChange={handleChange} placeholder="Indique cuál otro recurso" disabled={isLoading} />
                                  </div>
                              )}
                          </div>

                          <div className="mb-3 border p-3 rounded" style={{ borderColor: tertiaryColor }}>
                              <label className="form-label d-block mb-2" style={{ color: primaryColor, fontWeight: 'bold' }}>Historial de Enfermedades de los cafetos:</label>
                              {/* Años Anteriores */}
                              <div className="mb-2">
                                  <label className="form-label d-inline me-2" style={{ fontWeight: 'normal' }}>{PREGUNTA_IDS.historialEnfermedadesAnteriorSiNo}.- Años anteriores:</label>
                                  <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="historialEnfermedadesAnteriorSiNo" id="anteriorSi" value="si" checked={formData.historialEnfermedadesAnteriorSiNo === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="anteriorSi">Si</label>
                                   </div>
                                   <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="historialEnfermedadesAnteriorSiNo" id="anteriorNo" value="no" checked={formData.historialEnfermedadesAnteriorSiNo === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="anteriorNo">No</label>
                                   </div>
                                  {formData.historialEnfermedadesAnteriorSiNo === 'si' && (
                                      <div className="row mt-2">
                                          <div className="col-md-6">
                                              <input type="text" className="form-control form-control-sm" name="enfermedadPlagaAnterior" value={formData.enfermedadPlagaAnterior} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.enfermedadPlagaAnterior}) Enfermedad/Plaga`} disabled={isLoading} />
                                          </div>
                                          <div className="col-md-6">
                                               <input type="text" className="form-control form-control-sm" name="controlAnterior" value={formData.controlAnterior} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.controlAnterior}) Control`} disabled={isLoading} />
                                          </div>
                                      </div>
                                  )}
                              </div>
                              {/* Última Cosecha */}
                              <div>
                                  <label className="form-label d-inline me-2" style={{ fontWeight: 'normal' }}>{PREGUNTA_IDS.historialEnfermedadesUltimaSiNo}.- Última Cosecha:</label>
                                   <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="historialEnfermedadesUltimaSiNo" id="ultimaSi" value="si" checked={formData.historialEnfermedadesUltimaSiNo === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="ultimaSi">Si</label>
                                   </div>
                                   <div className="form-check form-check-inline">
                                       <input className="form-check-input" type="radio" name="historialEnfermedadesUltimaSiNo" id="ultimaNo" value="no" checked={formData.historialEnfermedadesUltimaSiNo === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                       <label className="form-check-label" htmlFor="ultimaNo">No</label>
                                   </div>
                                  {formData.historialEnfermedadesUltimaSiNo === 'si' && (
                                      <div className="row mt-2">
                                          <div className="col-md-6">
                                              <input type="text" className="form-control form-control-sm" name="enfermedadPlagaUltima" value={formData.enfermedadPlagaUltima} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.enfermedadPlagaUltima}) Enfermedad/Plaga`} disabled={isLoading} />
                                          </div>
                                          <div className="col-md-6">
                                              <input type="text" className="form-control form-control-sm" name="controlUltima" value={formData.controlUltima} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.controlUltima}) Control`} disabled={isLoading} />
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>

                          <div className="mb-3">
                              <label htmlFor="tipoArbolesSombra" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.tipoArbolesSombra}.- Tipo de árboles para sombra:</label>
                              <select className="form-select" id="tipoArbolesSombra" name="tipoArbolesSombra" value={formData.tipoArbolesSombra} onChange={handleChange} disabled={isLoading}>
                                  <option value="" disabled>Seleccione...</option>
                                  {arbolesSombraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                         </div>

                         <div className="d-flex justify-content-center mt-4">
                             <button type="submit" className="btn btn-lg px-4" style={{ background: secondaryColor, color: 'white', borderRadius: '25px', fontWeight: 'bold' }} disabled={isLoading}>
                                 {isLoading ? 'Guardando...' : 'Siguiente'}
                             </button>
                         </div>
                     </form>
                 </div>
             </div>
         </div>
     );
}

export default SiembraCaracteristicas;
