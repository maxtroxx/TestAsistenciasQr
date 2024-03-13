// Función para iniciar el escaneo del código QR
function iniciarEscaneo() {
    var scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (contenidoQR) {
        // Una vez que se escanea el código QR, se envían los datos a Google Sheets
        enviarDatosAGoogleSheets(contenidoQR);
        scanner.stop(); // Detener el escaneo después de un código QR exitoso
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]); // Iniciar el escaneo con la primera cámara disponible
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
