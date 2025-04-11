import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_ENDPOINT = 'TU_API_ENDPOINT'; // <-- REEMPLAZA ESTO

const PREGUNTA_IDS = {
    tratamientoCereza: 29,
    tratamientoOtro: 30, 
    fermentacionLavados: 31, 
};

function LavadoFermentacion() {
    const [formData, setFormData] = useState({
        tratamientoCereza: '',
        tratamientoOtro: '',
        fermentacionLavados: { 
            pesaCafe: false, clasificaRecipientes: false, usaRecipientesPlastico: false,
            cierraRecipientes: false, anadeAgua: false, anadeInoculo: false,
            mideTiempos: false, fermMenor12h: false, ferm24h: false, ferm36h: false,
        },
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const tertiaryColor = '#D15078';

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'radio' && name === 'tratamientoCereza') {
            setFormData(prev => ({ ...prev, tratamientoCereza: value, tratamientoOtro: value === 'otro' ? prev.tratamientoOtro : '' }));
           
             if (value !== 'Lavado') {
                 setFormData(prev => ({ ...prev, fermentacionLavados: Object.keys(prev.fermentacionLavados).reduce((acc, key) => ({ ...acc, [key]: false }), {}) }));
             }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (error) setError('');
    };

     const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            fermentacionLavados: {
                ...prev.fermentacionLavados,
                [name]: checked,
            }
        }));
        if (error) setError('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación
        if (!formData.tratamientoCereza) {
             setError('Por favor, seleccione un proceso de tratamiento de la cereza.');
             return;
        }
        if (formData.tratamientoCereza === 'otro' && !formData.tratamientoOtro) {
             setError('Si seleccionó "otro" tratamiento, por favor especifíquelo.');
             return;
        }
        const fermentacionSelected = Object.values(formData.fermentacionLavados).some(v => v);
        if (formData.tratamientoCereza === 'Lavado' && !fermentacionSelected) {
             setError('Si el tratamiento es Lavado, por favor marque al menos una opción del proceso de fermentación.');
             return;
        }

        // Preparar datos
        const dataToSend = [];
        const addData = (key, value) => {
             if (value !== null && value !== '' && PREGUNTA_IDS[key]) {
                 dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(value) });
             }
        };

        addData('tratamientoCereza', formData.tratamientoCereza);
        if (formData.tratamientoCereza === 'otro') {
            addData('tratamientoOtro', formData.tratamientoOtro);
        }

        if (formData.tratamientoCereza === 'Lavado') {
            const fermResp = Object.entries(formData.fermentacionLavados).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
            if(fermResp) addData('fermentacionLavados', fermResp);
        }


        console.log('Datos a enviar (Lavado/Fermentacion):', dataToSend);
        setIsLoading(true);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log('API Response (Lavado/Fermentacion):', result);
            navigate('/procesolavado'); 
        } catch (err) {
            console.error('API Error (Lavado/Fermentacion):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const tratamientoOptions = ['Lavado', 'Seco', 'Honey', 'otro'];
    const fermentacionOptions = {
         pesaCafe: 'Pesa el café a fermentar', clasificaRecipientes: 'Lo clasifica por recipientes',
         usaRecipientesPlastico: 'Utiliza recipientes de plástico', cierraRecipientes: 'Cierra los recipientes de Plástico',
         anadeAgua: 'Añade usted agua para el proceso de recipiente', anadeInoculo: 'Añade inóculo de Levadura',
         mideTiempos: 'Mide los tiempos de Fermentación', fermMenor12h: 'Realiza una fermentación menor de 12 horas',
         ferm24h: 'Realiza una fermentación de 24 horas', ferm36h: 'Realiza una fermentación de 36 horas'
    };

    return (
         <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '75%' }}>
                <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                     <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización del Proceso de Lavado (Fermentación)
                    </h4>

                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                         <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.tratamientoCereza}.- Que proceso de tratamiento de la cereza tiene:</label>
                             {tratamientoOptions.map(opt => (
                                 <div className="form-check form-check-inline" key={opt}>
                                     <input className="form-check-input" type="radio" name="tratamientoCereza" id={`tratamiento_${opt}`} value={opt} checked={formData.tratamientoCereza === opt} onChange={handleChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor={`tratamiento_${opt}`}>{opt === 'otro' ? 'Otro' : opt}</label>
                                 </div>
                             ))}
                             {formData.tratamientoCereza === 'otro' && (
                                 <div className="mt-2">
                                     <input type="text" className="form-control form-control-sm" name="tratamientoOtro" value={formData.tratamientoOtro} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.tratamientoOtro}) Indique cuál otro tratamiento`} disabled={isLoading} />
                                 </div>
                             )}
                        </div>

                        {formData.tratamientoCereza === 'Lavado' && (
                             <div className="mb-3 border p-3 rounded" style={{ borderColor: tertiaryColor }}>
                                 <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.fermentacionLavados}.- Sólo para cafés lavados, marque lo que realiza en el proceso de fermentación:</label>
                                 <div className="row">
                                     {Object.entries(fermentacionOptions).map(([key, label]) => (
                                         <div className="col-md-6" key={key}>
                                             <div className="form-check">
                                                 <input className="form-check-input" type="checkbox" name={key} id={`ferm_${key}`} checked={formData.fermentacionLavados[key]} onChange={handleCheckboxChange} disabled={isLoading} />
                                                 <label className="form-check-label" htmlFor={`ferm_${key}`}>{label}</label>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        )}


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

export default LavadoFermentacion;