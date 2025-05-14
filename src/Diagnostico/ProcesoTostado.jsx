import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_ENDPOINT = 'http://localhost:3000'; // <-- REEMPLAZA ESTO

const PREGUNTA_IDS = {
    realizaTueste: 33,
    tipoTueste: 34,
};

function ProcesoTostado() {
    const [formData, setFormData] = useState({
        realizaTueste: null, 
        tipoTueste: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
         setFormData(prev => ({ ...prev, [name]: value }));
         
         if (name === 'realizaTueste' && value === 'no') {
             setFormData(prev => ({ ...prev, tipoTueste: '' }));
         }
        if (error) setError('');
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, tipoTueste: e.target.value }));
         if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.realizaTueste === null) {
             setError('Por favor, indique si realiza proceso de tueste.');
             return;
        }
        if (formData.realizaTueste === 'si' && !formData.tipoTueste) {
             setError('Si realiza tueste, por favor seleccione el tipo.');
             return;
        }

        // Preparar datos
        const dataToSend = [];
        const addData = (key, value) => {
             if (value !== null && value !== '' && PREGUNTA_IDS[key]) {
                 dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(value),  productor_id: localStorage.getItem('currentProductorId') });
             }
        };

        addData('realizaTueste', formData.realizaTueste);
        if (formData.realizaTueste === 'si') {
             addData('tipoTueste', formData.tipoTueste);
        }

        console.log('Datos a enviar (Tostado):', dataToSend);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_ENDPOINT}/tostado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log('API Response (Tostado):', result);
            navigate('/calidadtaza'); 

        } catch (err) {
            console.error('API Error (Tostado):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const tuesteOptions = ['Tueste Claro (canela)', 'Tueste Medio (americano)', 'Tueste Medio Oscuro (francés)', 'Tueste Oscuro (italiano)'];


    return (
         <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '70%' }}>
                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                     <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización del Proceso de Tostado
                    </h4>

                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.realizaTueste}.- ¿Realiza usted un proceso de Tueste?</label>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="realizaTueste" id="tuesteSi" value="si" checked={formData.realizaTueste === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="tuesteSi">Si</label>
                             </div>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="realizaTueste" id="tuesteNo" value="no" checked={formData.realizaTueste === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="tuesteNo">No</label>
                             </div>
                        </div>

                        {formData.realizaTueste === 'si' && (
                             <div className="mb-3">
                                 <label htmlFor="tipoTueste" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.tipoTueste}.- ¿Qué tipo de tueste maneja?</label>
                                 <select className="form-select" id="tipoTueste" name="tipoTueste" value={formData.tipoTueste} onChange={handleChange} disabled={isLoading}>
                                     <option value="" disabled>Seleccione...</option>
                                     {tuesteOptions.map((opt, index) => <option key={index} value={opt}>{opt}</option>)}
                                 </select>
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

export default ProcesoTostado;