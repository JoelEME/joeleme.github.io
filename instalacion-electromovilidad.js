document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Folio Automático para este formulario
    const folioElement = document.getElementById('folio-number');
    
    const findHighestFolio = () => {
        let maxFolio = parseInt(localStorage.getItem('lastInstalacionFolio') || 100);
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
    const cargarBtn = document.getElementById('cargarBtn');
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

    cargarBtn.addEventListener('click', () => {
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

    // 3. Lógica del Botón de Enviar (simulación)
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
