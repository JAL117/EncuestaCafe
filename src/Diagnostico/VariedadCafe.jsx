import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_ENDPOINT = 'TU_API_ENDPOINT'; // <-- REEMPLAZA ESTO

const PREGUNTA_IDS = {
    inicioOperaciones: 1,
    cosechoUltimoCiclo: 2,
    extensionParcela: 3,
    variedadesCultivadas: 4,
    produccionKgSeco: 5,
    edadCafeto: 6,
    conoceNumPlantas: 7,
    cantidadPlantas: 8
};

function VariedadCafe() {
    const [formData, setFormData] = useState({
        inicioOperaciones: '',
        cosechoUltimoCiclo: null, 
        extensionParcela: '',
        variedadesCultivadas: { 
            Caturra: false, Catimor: false, MundoNovo: false, CostaRica95: false,
            Tipica: false, Geisha: false, Bourbon: false, CafeOro: false,
            Otra: false, Desconoce: false, Mezcla: false,
        },
        variedadOtraCual: '', 
        produccionKgSeco: '',
        edadCafeto: '',
        conoceNumPlantas: null, 
        cantidadPlantas: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const textColor = '#000000';
    const tertiaryColor = '#D15078';

    const handleChange = (e) => {
        const { name, value, type } = e.target;
         setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'conoceNumPlantas' && value === 'no') {
            setFormData(prev => ({ ...prev, cantidadPlantas: '' })); 
        }
        if (error) setError('');
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            variedadesCultivadas: {
                ...prev.variedadesCultivadas,
                [name]: checked,
            }
        }));
        if (!checked && name === 'Otra') {
             setFormData(prev => ({ ...prev, variedadOtraCual: '' })); 
        }
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        
        const variedadesSeleccionadas = Object.values(formData.variedadesCultivadas).some(v => v);
        if (!formData.inicioOperaciones || formData.cosechoUltimoCiclo === null || !formData.extensionParcela || !variedadesSeleccionadas || !formData.produccionKgSeco || !formData.edadCafeto || formData.conoceNumPlantas === null) {
             setError('Por favor, complete todos los campos obligatorios.');
             return;
        }
        if (formData.variedadesCultivadas.Otra && !formData.variedadOtraCual) {
             setError('Si seleccionó "Otra" variedad, por favor especifique cuál.');
             return;
        }
        if (formData.conoceNumPlantas === 'si' && !formData.cantidadPlantas) {
             setError('Si conoce la cantidad de plantas, por favor seleccione un rango.');
             return;
        }

      
        const dataToSend = [];

     
        ['inicioOperaciones', 'cosechoUltimoCiclo', 'extensionParcela', 'produccionKgSeco', 'edadCafeto', 'conoceNumPlantas', 'cantidadPlantas'].forEach(key => {
            if (formData[key] !== null && formData[key] !== '' && PREGUNTA_IDS[key]) {
                dataToSend.push({ pregunta_id: PREGUNTA_IDS[key], respuesta: String(formData[key]) });
            }
        });

       
        const selectedVariedades = Object.entries(formData.variedadesCultivadas)
            .filter(([_, isSelected]) => isSelected)
            .map(([name, _]) => name);

        if (selectedVariedades.length > 0) {
            let respuestaVariedades = selectedVariedades.join(', ');
            if (formData.variedadesCultivadas.Otra && formData.variedadOtraCual) {
                respuestaVariedades = respuestaVariedades.replace('Otra', `Otra: ${formData.variedadOtraCual}`);
            }
            dataToSend.push({ pregunta_id: PREGUNTA_IDS.variedadesCultivadas, respuesta: respuestaVariedades });
        }


        console.log('Datos a enviar (VariedadCafe):', dataToSend);
        setIsLoading(true);

         try {
            const response = await axios.post(API_ENDPOINT, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('API Response (VariedadCafe):', response.data);
            navigate('/siembracaracteristicas'); 

        } catch (err) {
            console.error('API Error (VariedadCafe):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const variedadesOptions = [
        'Caturra', 'Catimor', 'MundoNovo', 'CostaRica95', 'Tipica', 'Geisha', 'Bourbon', 'CafeOro', 'Otra', 'Desconoce', 'Mezcla'
    ];
    const produccionOptions = ['Menos de 100 kg', '101 – 500 kg', '501 – 1000 kg', '1001 – 1500 kg', 'Mas de 1500 kg'];
    const edadOptions = ['1 año', '2 a 4 años', '5 a mas'];
    const cantidadPlantasOptions = ['Menos de 100', '101 – 500', '501 – 1000', '1001 – 1500', 'Mas de 1500'];


    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '75%' }}>
                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                    <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización de la Variedad de Café
                    </h4>

                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                             <div className="col-md-6">
                                 <label htmlFor="inicioOperaciones" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.inicioOperaciones}.- Año de inicio de Operaciones:</label>
                                 <input type="number" className="form-control" id="inicioOperaciones" name="inicioOperaciones" value={formData.inicioOperaciones} onChange={handleChange} disabled={isLoading} placeholder="Ej: 2010" min="1900" max={new Date().getFullYear()} />
                             </div>
                             <div className="col-md-6">
                                 <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.cosechoUltimoCiclo}.- Cosechó café en último ciclo:</label>
                                 <div className="form-check form-check-inline">
                                     <input className="form-check-input" type="radio" name="cosechoUltimoCiclo" id="cosechoSi" value="si" checked={formData.cosechoUltimoCiclo === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor="cosechoSi">SI</label>
                                 </div>
                                 <div className="form-check form-check-inline">
                                     <input className="form-check-input" type="radio" name="cosechoUltimoCiclo" id="cosechoNo" value="no" checked={formData.cosechoUltimoCiclo === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor="cosechoNo">NO</label>
                                 </div>
                             </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="extensionParcela" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.extensionParcela}.- Extensión en m² de la parcela:</label>
                            <input type="number" className="form-control" id="extensionParcela" name="extensionParcela" value={formData.extensionParcela} onChange={handleChange} disabled={isLoading} placeholder="Ej: 5000" min="0" />
                        </div>

                        <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.variedadesCultivadas}.- Variedades de Café cultivada: (Señale)</label>
                             <div className="row">
                                 {variedadesOptions.map(variedad => (
                                     <div className="col-md-4 col-sm-6" key={variedad}>
                                         <div className="form-check">
                                             <input
                                                 className="form-check-input"
                                                 type="checkbox"
                                                 name={variedad}
                                                 id={`variedad_${variedad}`}
                                                 checked={formData.variedadesCultivadas[variedad]}
                                                 onChange={handleCheckboxChange}
                                                 disabled={isLoading}
                                             />
                                             <label className="form-check-label" htmlFor={`variedad_${variedad}`}>{variedad === 'MundoNovo' ? 'Mundo Novo' : (variedad === 'CostaRica95' ? 'Costa Rica 95' : variedad)}</label>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                             {formData.variedadesCultivadas.Otra && (
                                <div className="mt-2">
                                     <input type="text" className="form-control form-control-sm" name="variedadOtraCual" value={formData.variedadOtraCual} onChange={handleChange} placeholder="¿Cuál otra variedad?" disabled={isLoading} />
                                </div>
                             )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="produccionKgSeco" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.produccionKgSeco}.- En el último año, ¿Qué cantidad de producción obtuvo en kg (Seco)?</label>
                            <select className="form-select" id="produccionKgSeco" name="produccionKgSeco" value={formData.produccionKgSeco} onChange={handleChange} disabled={isLoading}>
                                <option value="" disabled>Seleccione...</option>
                                {produccionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                             </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="edadCafeto" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.edadCafeto}.- Edad aproximada del cafeto: (Señala)</label>
                            <select className="form-select" id="edadCafeto" name="edadCafeto" value={formData.edadCafeto} onChange={handleChange} disabled={isLoading}>
                                 <option value="" disabled>Seleccione...</option>
                                 {edadOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                             </select>
                        </div>

                        <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.conoceNumPlantas}.- ¿Conoce usted cuántas plantas (Cafetos) tiene usted?</label>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="conoceNumPlantas" id="conoceSi" value="si" checked={formData.conoceNumPlantas === 'si'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="conoceSi">Si</label>
                             </div>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="conoceNumPlantas" id="conoceNo" value="no" checked={formData.conoceNumPlantas === 'no'} onChange={handleRadioChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="conoceNo">No</label>
                             </div>
                        </div>

                        {formData.conoceNumPlantas === 'si' && (
                             <div className="mb-3">
                                 <label htmlFor="cantidadPlantas" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.cantidadPlantas}.- Cantidad:</label>
                                  <select className="form-select" id="cantidadPlantas" name="cantidadPlantas" value={formData.cantidadPlantas} onChange={handleChange} disabled={isLoading}>
                                     <option value="" disabled>Seleccione...</option>
                                     {cantidadPlantasOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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

export default VariedadCafe;