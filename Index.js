function iniciarEscaneo() {
    var scanner = new Instascan.Scanner({ video: document.createElement('canvas') }); // Utiliza un elemento de Canvas en lugar de video
    scanner.addListener('scan', function (contenidoQR) {
        // Una vez que se escanea el código QR, se envían los datos a Google Sheets
        enviarDatosAGoogleSheets(contenidoQR);
        scanner.stop(); // Detener el escaneo después de un código QR exitoso
    });

    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            var cameras = devices.filter(device => device.kind === 'videoinput');
            var selectedCamera = cameras.length > 1 ? cameras[1].deviceId : cameras[0].deviceId;

            navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
                        facingMode: 'environment' // Intenta usar la cámara trasera si está disponible
                    }
                })
                .then(stream => {
                    scanner.start(stream);
                })
                .catch(error => {
                    console.error('Error al acceder a la cámara:', error);
                    alert('Error al acceder a la cámara: ' + error);
                });
        })
        .catch(error => {
            console.error('Error al enumerar los dispositivos de medios:', error);
            alert('Error al enumerar los dispositivos de medios: ' + error);
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
