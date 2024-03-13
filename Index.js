function iniciarEscaneo() {
    var scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (contenidoQR) {
        // Una vez que se escanea el código QR, se envían los datos a Google Sheets
        enviarDatosAGoogleSheets(contenidoQR);
        scanner.stop(); // Detener el escaneo después de un código QR exitoso
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        var selectedCamera = cameras.length > 1 ? cameras[1] : cameras[0]; // Si hay más de una cámara, selecciona la segunda; de lo contrario, selecciona la primera
        if (selectedCamera) {
            scanner.start(selectedCamera); // Iniciar el escaneo con la cámara seleccionada
        } else {
            alert('No se detectó ninguna cámara en el dispositivo.');
        }
    }).catch(function (e) {
        console.error(e);
        alert('Error al acceder a la cámara: ' + e);
    });
}

// Función para enviar los datos a Google Sheets
function enviarDatosAGoogleSheets(contenidoQR) {
    console.log(contenidoQR);
    var url = 'https://script.google.com/macros/s/AKfycbyHiJx7CgRquwuU3v_eGLZbtyZ2Up7jvkVPFiEGWz0DytBDHuETMp84o-rIGG_Uo1rD/exec';
    var datos = "qr_data=" + encodeURIComponent(contenidoQR);

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
            alert('Error al enviar datos a Google Sheets.');
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('Error al enviar datos a Google Sheets.');
    });
}
