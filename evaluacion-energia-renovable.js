document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Folio Automático para este formulario (independiente)
    const folioElement = document.getElementById('folio-number');
    
    const findHighestFolio = () => {
        let maxFolio = parseInt(localStorage.getItem('lastRenovableFolio') || 500);
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('renovableBorrador_')) {
                const folioFromKey = parseInt(key.replace('renovableBorrador_', ''));
                if (!isNaN(folioFromKey) && folioFromKey > maxFolio) {
                    maxFolio = folioFromKey;
                }
            }
        }
        return maxFolio;
    };

    let currentFolio = findHighestFolio();
    
    if (!sessionStorage.getItem('renovableBorradorCargado')) {
        currentFolio += 1;
        localStorage.setItem('lastRenovableFolio', currentFolio);
    }
    folioElement.textContent = currentFolio;

    window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('renovableBorradorCargado');
    });

    // 2. Lógica para Cargar Datos de Electromovilidad
    const form = document.getElementById('energia-renovable-form');
    const cargarElectroBtn = document.getElementById('cargarElectroBtn');
    const folioElectroInput = document.getElementById('folioElectro');
    
    cargarElectroBtn.addEventListener('click', () => {
        const folioElectro = folioElectroInput.value;
        if (!folioElectro) {
            alert('Por favor, ingresa el número de folio de Electromovilidad.');
            return;
        }

        const borradorKey = `evaluacionBorrador_${folioElectro}`;
        const borrador = localStorage.getItem(borradorKey);

        if (borrador) {
            const data = JSON.parse(borrador);
            document.getElementById('nombre').value = data.nombre || '';
            document.getElementById('direccion').value = data.direccion || '';
            document.getElementById('comuna').value = data.comuna || '';
            document.getElementById('region').value = data.region || '';
            document.getElementById('rut').value = data.rut || '';
            document.getElementById('email').value = data.email || '';
            
            // Si el formulario de electromovilidad tenía el tipo de propiedad, cárgalo
            if (data.tipoPropiedad) {
                 document.getElementById('tipoPropiedad').value = data.tipoPropiedad;
            }

            alert(`Datos del cliente del folio ${folioElectro} cargados exitosamente.`);
        } else {
            alert(`No se encontró ningún borrador de electromovilidad con el folio ${folioElectro}.`);
        }
    });

    // 3. Lógica para Guardar y Cargar Borrador de este formulario
    const guardarBtn = document.getElementById('guardarBtn');
    const cargarBorradorBtn = document.getElementById('cargarBorradorBtn');
    const folioToLoadInput = document.getElementById('folioToLoad');
    
    guardarBtn.addEventListener('click', () => {
        const currentFolio = folioElement.textContent;
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem(`renovableBorrador_${currentFolio}`, JSON.stringify(data));
        alert(`Borrador del folio ${currentFolio} guardado exitosamente.`);
    });

    cargarBorradorBtn.addEventListener('click', () => {
        const folioToLoad = folioToLoadInput.value;
        if (!folioToLoad) {
            alert('Por favor, ingresa un número de folio para cargar.');
            return;
        }
        
        const borrador = localStorage.getItem(`renovableBorrador_${folioToLoad}`);
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
            sessionStorage.setItem('renovableBorradorCargado', 'true');
            
            alert(`Borrador del folio ${folioToLoad} cargado exitosamente.`);
        } else {
            alert(`No se encontró ningún borrador para el folio ${folioToLoad}.`);
        }
    });

    // 4. Lógica de Enviar (simulación)
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const destinatarios = ['gmartinez@emeingenieria.cl', 'jmartinez@emeingenieria.cl'];
        if (data.email) {
            destinatarios.push(data.email);
        }

        const mensaje = `Reporte de Energía Renovable del folio ${folioElement.textContent} enviado con éxito a:\n- ${destinatarios.join('\n- ')}`;
        alert(mensaje);
        
        console.log('Datos del Formulario de Energía Renovable:', data);
    });
});
