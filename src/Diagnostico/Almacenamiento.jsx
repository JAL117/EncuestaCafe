import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3000';

const PREGUNTA_IDS = {
    realizaDescascarillado: 31,
    descripcionAlmacenamiento: 32,
};

function Almacenamiento() {
    const [formData, setFormData] = useState({
        realizaDescascarillado: null, 
        descripcionAlmacenamiento: {
            pesaCafeSeco: false, usaCostalesAdecuados: false, almacenaLugarSeco: false,
        },
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const tertiaryColor = '#D15078';

    const handleRadioChange = (e) => {
        setFormData(prev => ({ ...prev, realizaDescascarillado: e.target.value }));
        if (error) setError('');
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            descripcionAlmacenamiento: {
                ...prev.descripcionAlmacenamiento,
                [name]: checked,
            }
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const descripcionSelected = Object.values(formData.descripcionAlmacenamiento).some(v => v);
        if (formData.realizaDescascarillado === null || !descripcionSelected) {
            setError('Por favor, responda si realiza descascarillado y marque al menos una opción sobre el almacenamiento.');
            return;
        }

        const dataToSend = [];
        const addData = (key, value) => {
             if (value !== null && value !== '' && PREGUNTA_IDS[key]) {
                 dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(value),  productor_id: localStorage.getItem('currentProductorId') });
             }
        };

        addData('realizaDescascarillado', formData.realizaDescascarillado);

        const descResp = Object.entries(formData.descripcionAlmacenamiento).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
        if(descResp) addData('descripcionAlmacenamiento', descResp);

        console.log('Datos a enviar (Almacenamiento):', dataToSend);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_ENDPOINT}/almacenamiento`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('API Response (Almacenamiento):', response.data);
            navigate('/procesotostado');
        } catch (err) {
            console.error('API Error (Almacenamiento):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

     const descripcionOptions = { pesaCafeSeco: 'Pesa usted el café seco', usaCostalesAdecuados: 'Utiliza costales adecuados para el secado', almacenaLugarSeco: 'Almacena usted el café en lugares secos y no húmedos.' };

    return (
         <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '70%' }}>
                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                    <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización en de Almacenamiento
                    </h4>

                     {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.realizaDescascarillado}.- ¿Realiza usted un proceso de descascarillado?</label>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="realizaDescascarillado" id="descaSi" value="si" checked={formData.realizaDescascarillado === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="descaSi">Si</label>
                             </div>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="realizaDescascarillado" id="descaNo" value="no" checked={formData.realizaDescascarillado === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="descaNo">No</label>
                             </div>
                        </div>

                         <div className="mb-3 border p-3 rounded" style={{ borderColor: tertiaryColor }}>
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.descripcionAlmacenamiento}.- Describa como realiza el almacenamiento del café seco pergamino: Marque lo que realiza</label>
                              {Object.entries(descripcionOptions).map(([key, label]) => (
                                 <div className="form-check" key={key}>
                                     <input className="form-check-input" type="checkbox" name={key} id={`alm_${key}`} checked={formData.descripcionAlmacenamiento[key]} onChange={handleCheckboxChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor={`alm_${key}`}>{label}</label>
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

export default Almacenamiento;