import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_ENDPOINT = 'TU_API_ENDPOINT'; // <-- REEMPLAZA ESTO

const PREGUNTA_IDS = {
    realizoCatacion: 35,
    calificacionCatacion: 36,
    notasAroma: 37,
    nivelAcidez: 38,
};

function CalidadTaza() {
    const [formData, setFormData] = useState({
        realizoCatacion: null, // 'si' o 'no'
        calificacionCatacion: '',
        notasAroma: { // Checkboxes para Q32
            floral:false, afrutado_bayas:false, afrutado_deshidratadas:false, afrutado_citricos:false,
            acido_acido:false, acido_fermentado:false, verde_vegetal:false, otra_quimico:false,
            otra_humedad_tierra:false, otra_madera:false, tostado_cereal:false, tostado_quemado:false,
            tostado_tabaco:false, nueces_nueces:false, nueces_cacao:false, especias:false,
            dulce_vainilla:false, dulce_azucar_morena:false,
        },
        nivelAcidez: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const tertiaryColor = '#D15078';

     const handleRadioChange = (e) => {
        const { name, value } = e.target;
         setFormData(prev => ({ ...prev, [name]: value }));
         // Limpiar campos dependientes si no realizó catación o no conoce
         if (name === 'realizoCatacion' && value === 'no') {
             setFormData(prev => ({ ...prev, calificacionCatacion: '', nivelAcidez: '', notasAroma: Object.keys(prev.notasAroma).reduce((acc, key) => ({ ...acc, [key]: false }), {}) }));
         }
        if (error) setError('');
    };

    const handleChange = (e) => {
         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            notasAroma: {
                ...prev.notasAroma,
                [name]: checked,
            }
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.realizoCatacion === null) {
             setError('Por favor, indique si ha realizado catación.');
             return;
        }
        if (formData.realizoCatacion === 'si' && !formData.calificacionCatacion) {
             setError('Si realizó catación, por favor indique la calificación.');
             return;
        }
         
         const aromaSelected = Object.values(formData.notasAroma).some(v => v);
        if (formData.realizoCatacion === 'si' && !aromaSelected) {
             setError('Si conoce las notas de aroma, por favor seleccione al menos una.');
            return;
         }
         if (formData.realizoCatacion === 'si' && !formData.nivelAcidez) {
            setError('Si conoce el nivel de acidez, por favor selecciónelo.');
            return; 
         }


        
        const dataToSend = [];
        const addData = (key, value) => {
             if (value !== null && value !== '' && PREGUNTA_IDS[key]) {
                 dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(value) });
             }
        };

        addData('realizoCatacion', formData.realizoCatacion);
         if (formData.realizoCatacion === 'si') {
             addData('calificacionCatacion', formData.calificacionCatacion);
             addData('nivelAcidez', formData.nivelAcidez);

             const aromaResp = Object.entries(formData.notasAroma).filter(([_,v])=>v).map(([k,_])=>k.replace(/_/g, ' ')).join(', '); // Formato legible
             if(aromaResp) addData('notasAroma', aromaResp);
         }


        console.log('Datos a enviar (Calidad Taza):', dataToSend);
        setIsLoading(true);

        try {
            const response = await axios.post(API_ENDPOINT, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('API Response (Calidad Taza):', response.data);
            alert('Encuesta completada y enviada. ¡Muchas gracias!');
            navigate('/');
        } catch (err) {
            console.error('API Error (Calidad Taza):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const calificacionOptions = ['90-100 puntos', '85-89.99 puntos', '80-84.99 puntos', 'Menos de 80 puntos'];
    const aromaOptions = {
        'Floral': ['floral'],
        'Afrutado': ['afrutado_bayas', 'afrutado_deshidratadas', 'afrutado_citricos'],
        'Ácido/Fermentado': ['acido_acido', 'acido_fermentado'],
        'Verde/Vegetal': ['verde_vegetal'],
        'Otra': ['otra_quimico', 'otra_humedad_tierra', 'otra_madera'],
        'Tostado': ['tostado_cereal', 'tostado_quemado', 'tostado_tabaco'],
        'Nueces/Cacao': ['nueces_nueces', 'nueces_cacao'],
        'Especias': ['especias'],
        'Dulce': ['dulce_vainilla', 'dulce_azucar_morena'],
    };
     const aromaLabels = {
         floral: 'Floral', afrutado_bayas: 'Bayas', afrutado_deshidratadas: 'Frutas deshidratadas', afrutado_citricos: 'Cítricos',
         acido_acido: 'Ácido', acido_fermentado: 'Fermentado', verde_vegetal: 'Verde/Vegetal', otra_quimico: 'Químico',
         otra_humedad_tierra: 'Humedad/Tierra', otra_madera: 'Madera', tostado_cereal: 'Cereal', tostado_quemado: 'Quemado',
         tostado_tabaco: 'Tabaco', nueces_nueces: 'Nueces', nueces_cacao: 'Cacao', especias: 'Especias',
         dulce_vainilla: 'Vainilla', dulce_azucar_morena: 'Azúcar morena',
     };

    const acidezOptions = ['Bajo', 'Media', 'Alto'];


    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '80%' }}>
                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                     <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Calidad en Taza de Café
                    </h4>

                     {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.realizoCatacion}.- ¿Ha realizado alguna catación para el café que usted produce?</label>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="realizoCatacion" id="catacionSi" value="si" checked={formData.realizoCatacion === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="catacionSi">Si</label>
                             </div>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="realizoCatacion" id="catacionNo" value="no" checked={formData.realizoCatacion === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="catacionNo">No</label>
                             </div>
                        </div>

                        {formData.realizoCatacion === 'si' && (
                             <>
                                 <div className="mb-3">
                                     <label htmlFor="calificacionCatacion" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.calificacionCatacion}.- Si su respuesta es sí, Indique que calificaciones ha alcanzado:</label>
                                     <select className="form-select" id="calificacionCatacion" name="calificacionCatacion" value={formData.calificacionCatacion} onChange={handleChange} disabled={isLoading}>
                                         <option value="" disabled>Seleccione...</option>
                                         {calificacionOptions.map((opt, index) => <option key={index} value={opt}>{opt}</option>)}
                                     </select>
                                 </div>

                                 <div className="mb-3 border p-3 rounded" style={{ borderColor: tertiaryColor }}>
                                      <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.notasAroma}.- Si conoce usted, conteste cuales serian algunas notas en Aroma de su café:</label>
                                      {Object.entries(aromaOptions).map(([category, keys]) => (
                                          <div key={category} className="mb-2">
                                              <strong>{category}:</strong>
                                              <div className="d-flex flex-wrap gap-2 ms-2">
                                                  {keys.map(key => (
                                                      <div className="form-check" key={key}>
                                                          <input
                                                              className="form-check-input"
                                                              type="checkbox"
                                                              name={key}
                                                              id={`aroma_${key}`}
                                                              checked={formData.notasAroma[key]}
                                                              onChange={handleCheckboxChange}
                                                              disabled={isLoading}
                                                          />
                                                          <label className="form-check-label" htmlFor={`aroma_${key}`}>{aromaLabels[key]}</label>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                      ))}
                                 </div>


                                 <div className="mb-3">
                                     <label htmlFor="nivelAcidez" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.nivelAcidez}.- Si conoce usted, conteste que nivel de acidez está presente en su café:</label>
                                      <select className="form-select" id="nivelAcidez" name="nivelAcidez" value={formData.nivelAcidez} onChange={handleChange} disabled={isLoading}>
                                         <option value="" disabled>Seleccione...</option>
                                         {acidezOptions.map((opt, index) => <option key={index} value={opt}>{opt}</option>)}
                                     </select>
                                 </div>
                             </>
                        )}


                        <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-lg px-4" style={{ background: secondaryColor, color: 'white', borderRadius: '25px', fontWeight: 'bold' }} disabled={isLoading}>
                                {isLoading ? 'Enviando...' : 'Finalizar Encuesta'}
                            </button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
}

export default CalidadTaza;