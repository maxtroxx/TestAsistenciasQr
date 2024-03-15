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
        var video = document.getElementById('preview');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var hoja = document.getElementById('hoja').value;

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                var scanner = new Instascan.Scanner({ video: video });
                scanner.addListener('scan', function (contenidoQR) {
                    // Una vez que se escanea el código QR, se envían los datos a Google Sheets
                    enviarDatosAGoogleSheets(contenidoQR, hoja);
                    scanner.stop(); // Detener el escaneo después de un código QR exitoso
                });

                // Obtener la cámara trasera
                var camera = cameras.find(function (camera) {
                    return camera.name.toLowerCase().includes('back') || camera.name.toLowerCase().includes('rear');
                });

                // Iniciar la cámara
                scanner.start(camera || cameras[0]);

                // Capturar el flujo de video y procesarlo con jsQR
                function capturarYProcesar() {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    var code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        // Si se detecta un código QR, enviar los datos a Google Sheets
                        enviarDatosAGoogleSheets(code.data, hoja);
                    }
                    requestAnimationFrame(capturarYProcesar);
                }

                requestAnimationFrame(capturarYProcesar);
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
            console.log("Error al enviar datos a Google Sheets.");
            alert('Error al enviar datos a Google Sheets.');
        }
    })
    .catch(function(error) {
        console.error('Error al enviar datos a Google Sheets:', error);
        alert('Error al enviar datos a Google Sheets.');
    });
}

// Función para detectar si es un dispositivo móvil
function esDispositivoMovil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Llamar a la función para inicializar la cámara cuando se carga el DOM
document.addEventListener('DOMContentLoaded', iniciarCamara);
