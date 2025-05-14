import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3000'; // <-- REEMPLAZA ESTO

const PREGUNTA_IDS = {
    recolectaClasificacion: 22,
    procesoDespulpado: 23,
};

function CosechaDespulpado() {
    const [formData, setFormData] = useState({
        recolectaClasificacion: { corteOptimo: false, clasificaColor: false, clasificaHidro: false, desinfeccion: false },
        procesoDespulpado: { pesaCereza: false, usaDespulpadora: false, lavaDespulpadora: false, usaCubetasLimpias: false, mideKgDespulpado: false },
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [productorId, setProductorId] = useState(null);

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';

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
         if (error) setError('');
    };

    useEffect(() => {
        const id = localStorage.getItem('currentProductorId');
        if (!id) {
            navigate('/'); // Redirige si no hay productorId
            return;
        }
        setProductorId(id);
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const recolectaSelected = Object.values(formData.recolectaClasificacion).some(v => v);
        const despulpadoSelected = Object.values(formData.procesoDespulpado).some(v => v);

        if (!recolectaSelected || !despulpadoSelected) {
             setError('Por favor, marque al menos una opción en cada sección (recolecta y despulpado).');
             return;
        }

        const dataToSend = [];
         const addData = (key, group) => {
             const resp = Object.entries(formData[group]).filter(([_,v])=>v).map(([k,_])=>k).join(', ');
             if(resp && PREGUNTA_IDS[key]) {
                 dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: resp, productorId });
             }
        };

        addData('recolectaClasificacion', 'recolectaClasificacion');
        addData('procesoDespulpado', 'procesoDespulpado');

        console.log('Datos a enviar (Cosecha/Despulpado):', dataToSend);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_ENDPOINT}/cosechaDespulpado`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('API Response (Cosecha/Despulpado):', response.data);
            navigate('/lavadofermentacion');
        } catch (err) {
            console.error('API Error (Cosecha/Despulpado):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const recolectaOptions = { corteOptimo: 'Corta sólo las cerezas con un grado de maduración óptima.', clasificaColor: 'Clasifica las cerezas por color', clasificaHidro: 'Realiza clasificación hidrostática', desinfeccion: 'Realiza desinfección' };
    const despulpadoOptions = { pesaCereza: 'Pesa usted las cerezas que va a despulpar', usaDespulpadora: 'Utiliza una despulpadora', lavaDespulpadora: 'Lava la despulpadora antes y después del despulpe', usaCubetasLimpias: 'Utiliza cubetas o tambos limpios para colocar el café despulpado', mideKgDespulpado: 'Realiza una medición en kilogramos del café resultado del despulpe' };


    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '75%' }}>
                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                     <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización de Cosecha y Despulpado
                    </h4>

                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                     <form onSubmit={handleSubmit}>
                        
                         <div className="mb-4">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.recolectaClasificacion}.- ¿Cómo se realiza la recolecta y la clasificación de la cereza? Marque lo que realiza</label>
                             {Object.entries(recolectaOptions).map(([key, label]) => (
                                 <div className="form-check" key={key}>
                                     <input className="form-check-input" type="checkbox" name={key} id={`recolecta_${key}`} data-group="recolectaClasificacion" checked={formData.recolectaClasificacion[key]} onChange={handleCheckboxChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor={`recolecta_${key}`}>{label}</label>
                                 </div>
                             ))}
                         </div>

                       
                          <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.procesoDespulpado}.- Describa como realiza el despulpado: Marque lo que realiza</label>
                             {Object.entries(despulpadoOptions).map(([key, label]) => (
                                 <div className="form-check" key={key}>
                                     <input className="form-check-input" type="checkbox" name={key} id={`despulpado_${key}`} data-group="procesoDespulpado" checked={formData.procesoDespulpado[key]} onChange={handleCheckboxChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor={`despulpado_${key}`}>{label}</label>
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

export default CosechaDespulpado;