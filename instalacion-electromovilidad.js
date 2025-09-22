document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Folio Automático para este formulario
    const folioElement = document.getElementById('folio-number');
    const findHighestFolio = () => {
        let maxFolio = parseInt(localStorage.getItem('lastInstalacionFolio') || 249);
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('instalacionBorrador_')) {
                const folioFromKey = parseInt(key.replace('instalacionBorrador_', ''));
                if (!isNaN(folioFromKey) && folioFromKey > maxFolio) {
                    maxFolio = folioFromKey;
                }
            }
        }
        return maxFolio;
    };

    let currentFolio = findHighestFolio();
    
    if (!sessionStorage.getItem('instalacionBorradorCargado')) {
        currentFolio += 1;
        localStorage.setItem('lastInstalacionFolio', currentFolio);
    }
    folioElement.textContent = currentFolio;

    window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('instalacionBorradorCargado');
    });

    // 2. Lógica para Guardar y Cargar Borrador
    const form = document.getElementById('instalacion-form');
    const guardarBtn = document.getElementById('guardarBtn');
    const cargarBorradorBtn = document.getElementById('cargarBorradorBtn');
    const folioToLoadInput = document.getElementById('folioToLoad');
    
    guardarBtn.addEventListener('click', () => {
        const currentFolio = folioElement.textContent;
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            if (form.elements[key].type !== 'file') {
                 data[key] = value;
            }
        }
        localStorage.setItem(`instalacionBorrador_${currentFolio}`, JSON.stringify(data));
        alert(`Borrador del folio ${currentFolio} guardado exitosamente.`);
    });

    cargarBorradorBtn.addEventListener('click', () => {
        const folioToLoad = folioToLoadInput.value;
        if (!folioToLoad) {
            alert('Por favor, ingresa un número de folio para cargar.');
            return;
        }
        
        const borrador = localStorage.getItem(`instalacionBorrador_${folioToLoad}`);
        if (borrador) {
            const data = JSON.parse(borrador);
            for (const key in data) {
                const input = form.elements[key];
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = data[key] === 'on';
                    } else if (input.type === 'radio') {
                        input.checked = input.value === data[key];
                    } else {
                        input.value = data[key];
                    }
                }
            }
            
            folioElement.textContent = folioToLoad;
            sessionStorage.setItem('instalacionBorradorCargado', 'true');
            
            alert(`Borrador del folio ${folioToLoad} cargado exitosamente.`);
        } else {
            alert(`No se encontró ningún borrador para el folio ${folioToLoad}.`);
        }
    });

    // 3. Lógica para cargar datos de evaluación
    const cargarEvaluacionBtn = document.getElementById('cargarEvaluacionBtn');
    const folioEvaluacionToLoadInput = document.getElementById('folioEvaluacionToLoad');
    const tipoPropiedadSelect = document.getElementById('tipoPropiedad');
    const casaFields = document.getElementById('casa-fields');
    const deptoFields = document.getElementById('departamento-fields');
    const canalizacionCasa = document.getElementById('canalizacion-casa');
    const canalizacionDepto = document.getElementById('canalizacion-depto');

    cargarEvaluacionBtn.addEventListener('click', () => {
        const folioEvaluacion = folioEvaluacionToLoadInput.value;
        const evaluacionData = localStorage.getItem(`evaluacionBorrador_${folioEvaluacion}`);

        if (evaluacionData) {
            const data = JSON.parse(evaluacionData);
            
            // Cargar Datos del Cliente
            document.getElementById('nombre').value = data.nombre || '';
            document.getElementById('direccion').value = data.direccion || '';
            
            // Cargar Tipo de Propiedad
            if (data.tipoPropiedad) {
                tipoPropiedadSelect.value = data.tipoPropiedad;
                if (data.tipoPropiedad === 'casa') {
                    casaFields.style.display = 'block';
                    deptoFields.style.display = 'none';
                    canalizacionCasa.style.display = 'block';
                    canalizacionDepto.style.display = 'none';
                    document.getElementById('ubicacionCasa').value = data.ubicacionPropuesta || '';
                    document.getElementById('tipoConexionCasa').value = data.tipoConexionCasa || '';
                    document.getElementById('amperajeCasa').value = data.amperajeValueCasa || '';
                    document.getElementById('metrosCag').value = data.metrosCag || 0;
                    document.getElementById('metrosEmtCasa').value = data.metrosEmtCasa || 0;
                    document.getElementById('metrosSoterrado').value = data.metrosSoterrado || 0;
                    document.getElementById('metrosPreembutidoCasa').value = data.metrosPreembutidoCasa || 0;
                    document.getElementById('totalMetrosCasa').textContent = data.totalMetros || 0;
                } else if (data.tipoPropiedad === 'departamento') {
                    casaFields.style.display = 'none';
                    deptoFields.style.display = 'block';
                    canalizacionCasa.style.display = 'none';
                    canalizacionDepto.style.display = 'block';
                    document.getElementById('numEstacionamientos').value = data.numEstacionamientos || '';
                    document.getElementById('ubicacionDepto').value = data.ubicacionPropuesta || '';
                    document.getElementById('permisoAdmin').value = data.permisoAdmin || '';
                    document.getElementById('ubicacionConexionDepto').value = data.ubicacionConexionDepto || '';
                    document.getElementById('amperajeDepto').value = data.amperajeValueDepto || '';
                    document.getElementById('metrosEscalerilla').value = data.metrosEscalerilla || 0;
                    document.getElementById('metrosEmtDepto').value = data.metrosEmtDepto || 0;
                    document.getElementById('metrosPreembutidoDepto').value = data.metrosPreembutidoDepto || 0;
                    document.getElementById('totalMetrosDepto').textContent = data.totalMetros || 0;
                }
            }
            alert(`Datos de evaluación del folio ${folioEvaluacion} cargados exitosamente.`);
        } else {
            alert(`No se encontraron datos de evaluación para el folio ${folioEvaluacion}.`);
        }
    });

    // 4. Lógica de visibilidad del Registro Fotográfico
    const secCertSelect = document.getElementById('sec-cert-select');
    const secSiFotos = document.getElementById('sec-si-fotos');
    const secNoFotos = document.getElementById('sec-no-fotos');
    
    secCertSelect.addEventListener('change', () => {
        if (secCertSelect.value === 'si') {
            secSiFotos.style.display = 'block';
            secNoFotos.style.display = 'none';
        } else if (secCertSelect.value === 'no') {
            secSiFotos.style.display = 'none';
            secNoFotos.style.display = 'block';
        } else {
            secSiFotos.style.display = 'none';
            secNoFotos.style.display = 'none';
        }
    });

    // 5. Lógica del Botón de Enviar (simulación)
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const destinatarios = ['gmartinez@emeingenieria.cl', 'jmartinez@emeingenieria.cl'];
        
        const mensaje = `Reporte de instalación del folio ${folioElement.textContent} enviado con éxito.`;
        alert(mensaje);
        
        console.log('Datos del Formulario de Instalación:', data);
    });
});
