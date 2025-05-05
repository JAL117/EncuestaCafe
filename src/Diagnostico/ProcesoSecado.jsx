import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_ENDPOINT = 'http://localhost:3000'; 

const PREGUNTA_IDS = {
    metodoSecado: 28,
    metodoSecadoOtro: 29, 
    descripcionSecado: 30,
};

function ProcesoSecado() {
    const [formData, setFormData] = useState({
        metodoSecado: '',
        metodoSecadoOtro: '',
        descripcionSecado: { 
            pesaCafeSecar: false, mideCondicionesAmb: false, realizaPruebaSeco: false,
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
        if (type === 'radio' && name === 'metodoSecado') {
            setFormData(prev => ({ ...prev, metodoSecado: value, metodoSecadoOtro: value === 'otro' ? prev.metodoSecadoOtro : '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (error) setError('');
    };

     const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            descripcionSecado: {
                ...prev.descripcionSecado,
                [name]: checked,
            }
        }));
        if (error) setError('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const descripcionSelected = Object.values(formData.descripcionSecado).some(v => v);
        if (!formData.metodoSecado || !descripcionSelected) {
            setError('Por favor, seleccione un método de secado y marque al menos una opción de cómo lo realiza.');
            return;
        }
        if (formData.metodoSecado === 'otro' && !formData.metodoSecadoOtro) {
             setError('Si seleccionó "otro" método de secado, por favor especifíquelo.');
             return;
        }

        const dataToSend = [];
        const addData = (key, value) => {
             if (value !== null && value !== '' && PREGUNTA_IDS[key]) {
                 dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(value) });
             }
        };

        addData('metodoSecado', formData.metodoSecado);
        if (formData.metodoSecado === 'otro') {
            addData('metodoSecadoOtro', formData.metodoSecadoOtro);
        }

        const descResp = Object.entries(formData.descripcionSecado).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
        if(descResp) addData('descripcionSecado', descResp);


        console.log('Datos a enviar (Secado):', dataToSend);
        setIsLoading(true);

        try {
            const response = await axios.post(API_ENDPOINT, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('API Response (Secado):', response.data);
            navigate('/almacenamiento');
        } catch (err) {
            console.error('API Error (Secado):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const metodoOptions = ['Cielo abierto (Patios o Canchas)', 'Camas africanas', 'Máquina de calor', 'otro'];
    const descripcionOptions = { pesaCafeSecar: 'Pesa usted el café que va a secar', mideCondicionesAmb: 'Mide condiciones ambientales', realizaPruebaSeco: 'Realiza una prueba para determinar que el café este seco' };


    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '75%' }}>
                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                    <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización del Proceso de Secado
                    </h4>

                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                     <form onSubmit={handleSubmit}>
                         <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.metodoSecado}.- Que proceso de secado tiene:</label>
                              {metodoOptions.map(opt => (
                                 <div className="form-check" key={opt}>
                                     <input className="form-check-input" type="radio" name="metodoSecado" id={`metodo_${opt.replace(/\s+/g, '')}`} value={opt} checked={formData.metodoSecado === opt} onChange={handleChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor={`metodo_${opt.replace(/\s+/g, '')}`}>{opt === 'otro' ? 'Otro' : opt}</label>
                                 </div>
                             ))}
                             {formData.metodoSecado === 'otro' && (
                                 <div className="mt-2">
                                     <input type="text" className="form-control form-control-sm" name="metodoSecadoOtro" value={formData.metodoSecadoOtro} onChange={handleChange} placeholder={`(${PREGUNTA_IDS.metodoSecadoOtro}) Indique cuál otro método`} disabled={isLoading} />
                                 </div>
                             )}
                         </div>

                          <div className="mb-3 border p-3 rounded" style={{ borderColor: tertiaryColor }}>
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.descripcionSecado}.- Describa como realiza el secado: Marque lo que realiza</label>
                             {Object.entries(descripcionOptions).map(([key, label]) => (
                                 <div className="form-check" key={key}>
                                     <input className="form-check-input" type="checkbox" name={key} id={`desc_${key}`} checked={formData.descripcionSecado[key]} onChange={handleCheckboxChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor={`desc_${key}`}>{label}</label>
                                 </div>
                             ))}
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

export default ProcesoSecado;