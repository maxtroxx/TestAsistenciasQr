// Función para detectar si es un dispositivo móvil
function esDispositivoMovil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Función para inicializar la cámara
function iniciarCamara() {
    if (esDispositivoMovil()) { // Si es un dispositivo móvil
        document.getElementById('camera-container').style.display = 'block'; // Mostrar el container de la cámara
        document.getElementById('preview').style.display = 'none'; // Ocultar la etiqueta de video
    } else { // Si es de escritorio
        document.getElementById('camera-container').style.display = 'none'; // Ocultar el container de la cámara
        document.getElementById('preview').style.display = 'block'; // Mostrar la etiqueta de video
    }
}

// Función para iniciar el escaneo del código QR
function iniciarEscaneo() {
    if (esDispositivoMovil()) { // Si es un dispositivo móvil
        document.getElementById('capture').click(); // Hacer clic en el input para abrir la cámara
    } else { // Si es de escritorio
        var scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        var hoja = document.getElementById('hoja').value;
        scanner.addListener('scan', function (contenidoQR) {
            // Una vez que se escanea el código QR, se envían los datos a Google Sheets
            enviarDatosAGoogleSheets(contenidoQR, hoja);
            scanner.stop(); // Detener el escaneo después de un código QR exitoso
        });
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                // Buscar la cámara trasera y usarla si está disponible
                var camera = cameras.find(function (camera) {
                    return camera.name.toLowerCase().includes('back') || camera.name.toLowerCase().includes('rear');
                });
                scanner.start(camera || cameras[0]); // Iniciar el escaneo con la cámara seleccionada
            } else {
                alert('No se detectó ninguna cámara en el dispositivo.');
            }
        }).catch(function (e) {
            console.error(e);
            alert('Error al acceder a la cámara: ' + e);
        });
    }
}

// Función para enviar datos a Google Sheets
function enviarDatosAGoogleSheets(contenidoQR, hoja) {
    var url = 'https://script.google.com/macros/s/AKfycbzUxm2pYX0Be634Ia0ZXNjY_6BoLZv8KpIHGnCET9A2GW7IIA6dSTvRP00Vj3WK6AmwgA/exec';
    var datos = "qr_data=" + encodeURIComponent(contenidoQR) + "&sheet=" + encodeURIComponent(hoja);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: datos
    })
    .then(function(response) {
        if (response.ok) {
            alert('Datos enviados correctamente a Google Sheets.');
        } else {
            console.log("Hola1");
            alert('Error al enviar datos a Google Sheets.');
        }
    })
    .catch(function(error) {
        console.log("Hola2");
        console.error('Error:', error);
        alert('Error al enviar datos a Google Sheets.');
    });
}

// Función para manejar la selección de la imagen (código QR) en dispositivos móviles
document.getElementById('capture').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var contenidoQR = e.target.result;
        var hoja = document.getElementById('hoja').value;
        enviarDatosAGoogleSheets(contenidoQR, hoja);
    };
    reader.readAsDataURL(file);
});

// Llamar a la función para inicializar la cámara cuando se carga el DOM
document.addEventListener('DOMContentLoaded', iniciarCamara);
