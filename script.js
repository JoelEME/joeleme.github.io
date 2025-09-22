document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Folio Automático
    const folioElement = document.getElementById('folio-number');
    let lastFolio = localStorage.getItem('lastFolio') || 249;
    lastFolio = parseInt(lastFolio) + 1;
    folioElement.textContent = lastFolio;

    // 2. Lógica de Capitalización de Palabras
    const capitalizeWords = (str) => {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    };

    const nombreInput = document.getElementById('nombre');
    const direccionInput = document.getElementById('direccion');
    const comunaInput = document.getElementById('comuna');
    const regionInput = document.getElementById('region');

    nombreInput.addEventListener('input', (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = capitalizeWords(e.target.value);
        e.target.setSelectionRange(start, end);
    });
    direccionInput.addEventListener('input', (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = capitalizeWords(e.target.value);
        e.target.setSelectionRange(start, end);
    });
    comunaInput.addEventListener('input', (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = capitalizeWords(e.target.value);
        e.target.setSelectionRange(start, end);
    });
    regionInput.addEventListener('input', (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = capitalizeWords(e.target.value);
        e.target.setSelectionRange(start, end);
    });
    
    // 3. Lógica de Formato de RUT
    const rutInput = document.getElementById('rut');
    rutInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\./g, '').replace('-', '').toUpperCase();
        if (value.length > 1) {
            let body = value.slice(0, -1);
            let dv = value.slice(-1);

            if (body.length > 3) {
                body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
            e.target.value = `${body}-${dv}`;
        }
    });

    // 4. Lógica de campos dinámicos
    const tipoPropiedadSelect = document.getElementById('tipoPropiedad');
    const casaFields = document.getElementById('casa-fields');
    const deptoFields = document.getElementById('departamento-fields');
    const canalizacionCasaFields = document.getElementById('canalizacion-casa');
    const canalizacionDeptoFields = document.getElementById('canalizacion-depto');

    tipoPropiedadSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        casaFields.classList.add('hidden');
        deptoFields.classList.add('hidden');
        canalizacionCasaFields.classList.add('hidden');
        canalizacionDeptoFields.classList.add('hidden');

        if (selectedValue === 'casa') {
            casaFields.classList.remove('hidden');
            canalizacionCasaFields.classList.remove('hidden');
        } else if (selectedValue === 'departamento') {
            deptoFields.classList.remove('hidden');
            canalizacionDeptoFields.classList.remove('hidden');
        }
    });

    // 5. Lógica de Amperaje
    const amperajeCasaSelect = document.getElementById('amperajeCasa');
    const amperajeDeptoSelect = document.getElementById('amperajeDepto');
    const amperajeValueCasaSelect = document.getElementById('amperaje-value-casa');
    const amperajeValueDeptoSelect = document.getElementById('amperaje-value-depto');

    const opcionesAmperaje = {
        monofasico: ['16A', '20A', '25A', '32A', '40A', '63A'],
        trifasico: ['10A', '16A', '32A', '40A', '63A']
    };

    const updateAmperajeOptions = (selectElement, valueSelectElement) => {
        const tipo = selectElement.value;
        valueSelectElement.innerHTML = '';
        opcionesAmperaje[tipo].forEach(amperaje => {
            const option = document.createElement('option');
            option.value = amperaje;
            option.textContent = amperaje;
            valueSelectElement.appendChild(option);
        });
    };

    amperajeCasaSelect.addEventListener('change', () => updateAmperajeOptions(amperajeCasaSelect, amperajeValueCasaSelect));
    amperajeDeptoSelect.addEventListener('change', () => updateAmperajeOptions(amperajeDeptoSelect, amperajeValueDeptoSelect));
    
    updateAmperajeOptions(amperajeCasaSelect, amperajeValueCasaSelect);
    updateAmperajeOptions(amperajeDeptoSelect, amperajeValueDeptoSelect);

    // 6. Lógica de Total de Metros de Canalización
    const canalizacionLengths = document.querySelectorAll('.canalizacion-length');
    
    const updateTotalMetros = () => {
        let totalCasa = 0;
        let totalDepto = 0;
        
        canalizacionLengths.forEach(input => {
            if (input.dataset.type === 'casa' && !input.closest('.hidden')) {
                totalCasa += parseFloat(input.value) || 0;
            } else if (input.dataset.type === 'depto' && !input.closest('.hidden')) {
                totalDepto += parseFloat(input.value) || 0;
            }
        });
        
        const pisoDesde = parseFloat(document.getElementById('pisoDesde').value) || 0;
        const pisoHasta = parseFloat(document.getElementById('pisoHasta').value) || 0;
        if (pisoDesde > 0 && pisoHasta > 0 && pisoHasta > pisoDesde) {
            totalDepto += (pisoHasta - pisoDesde) * 3;
        }

        document.getElementById('totalMetrosCasa').textContent = totalCasa;
        document.getElementById('totalMetrosDepto').textContent = totalDepto;
    };
    
    canalizacionLengths.forEach(input => input.addEventListener('input', updateTotalMetros));
    document.getElementById('pisoDesde').addEventListener('input', updateTotalMetros);
    document.getElementById('pisoHasta').addEventListener('input', updateTotalMetros);
    
    // 7. Lógica de "Otro" en Cargador
    const cargadorSelect = document.getElementById('cargador');
    const otroCargadorDiv = document.getElementById('otro-cargador');
    
    cargadorSelect.addEventListener('change', () => {
        if (cargadorSelect.value === 'Otro') {
            otroCargadorDiv.classList.remove('hidden');
        } else {
            otroCargadorDiv.classList.add('hidden');
        }
    });

    // 8. Lógica para Guardar y Cargar Borrador
    const form = document.getElementById('evaluacion-form');
    const guardarBtn = document.getElementById('guardarBtn');
    const cargarBtn = document.getElementById('cargarBtn');
    const folioToLoadInput = document.getElementById('folioToLoad');
    
    guardarBtn.addEventListener('click', () => {
        const currentFolio = folioElement.textContent;
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem(`evaluacionBorrador_${currentFolio}`, JSON.stringify(data));
        alert(`Borrador del folio ${currentFolio} guardado exitosamente.`);
    });

    cargarBtn.addEventListener('click', () => {
        const folioToLoad = folioToLoadInput.value;
        if (!folioToLoad) {
            alert('Por favor, ingresa un número de folio para cargar.');
            return;
        }
        
        const borrador = localStorage.getItem(`evaluacionBorrador_${folioToLoad}`);
        if (borrador) {
            const data = JSON.parse(borrador);
            for (const key in data) {
                const input = form.elements[key];
                if (input) {
                    if (input.type === 'file') {
                        // Los archivos no se pueden cargar de esta forma por seguridad
                        console.warn(`El campo de archivo '${key}' no puede ser cargado desde el borrador.`);
                    } else if (input.type === 'checkbox') {
                        input.checked = data[key] === 'on';
                    } else if (input.type === 'radio') {
                        input.checked = input.value === data[key];
                    } else {
                        input.value = data[key];
                    }
                }
            }
            // Disparar los eventos de cambio para los campos dinámicos
            tipoPropiedadSelect.dispatchEvent(new Event('change'));
            amperajeCasaSelect.dispatchEvent(new Event('change'));
            amperajeDeptoSelect.dispatchEvent(new Event('change'));
            cargadorSelect.dispatchEvent(new Event('change'));

            // Recalcular el total de metros si es necesario
            updateTotalMetros();
            
            alert(`Borrador del folio ${folioToLoad} cargado exitosamente.`);
        } else {
            alert(`No se encontró ningún borrador para el folio ${folioToLoad}.`);
        }
    });

    // 9. Lógica del Botón de Enviar (Simulación)
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        localStorage.setItem('lastFolio', lastFolio);

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const destinatarios = ['gmartinez@emeingenieria.cl', 'jmartinez@emeingenieria.cl'];
        
        if (data.email) {
            destinatarios.push(data.email);
        }

        const mensaje = `Reporte del folio ${folioElement.textContent} enviado con éxito a:\n- ${destinatarios.join('\n- ')}`;
        alert(mensaje);
        
        console.log('Datos del Formulario:', data);
    });

});
