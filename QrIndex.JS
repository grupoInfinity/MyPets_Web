// crea elemento
const video = document.createElement("video");

// nuestro canvas
let canvasElement = document.getElementById("qr-canvas");

// referencia a la imagen de fondo
const fondoElement = document.getElementById("fondo-imagen");

// función para encender la cámara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      if (canvasElement) {
        if (window.innerWidth) {
          canvasElement.style.display = "block";
        } else {
          canvasElement.style.display = "block";
        }
      }
      if (fondoElement) {
        fondoElement.style.display = "none";
      }
      const canvas = canvasElement.getContext("2d");
      video.setAttribute("playsinline", true);
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};
// funciones para levantar las funciones de encendido de la cámara
function tick() {
  if (canvasElement) {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    const canvas = canvasElement.getContext("2d");
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  }

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    // Si hay un error al decodificar, simplemente vuelve a llamar a la función de escaneo después de un breve intervalo
    setTimeout(scan, 300);
  }
}

// apagar la cámara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  if (canvasElement) canvasElement.style.display = "none";
  if (fondoElement) {
    fondoElement.style.display = "block"; // Muestra la imagen de fondo
  }
  //encenderCamara(); // Vuelve a encender la cámara automáticamente después de apagarla
};

// callback cuando termina de leer el código QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    // Obtén el código de la mascota desde la respuesta del código QR
    const codigoMascota = respuesta;

    // Realiza una solicitud a tu API para verificar si el código de la mascota existe
    const apiUrl =
      "https://ginfinity.xyz/MyPets_Admin/servicios/prc/prc_mascota.php?accion=C&estado=A&codigo=" + codigoMascota;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // Verifica si la respuesta de la API es verdadera
        if (data.status === 1) {
          // Redirige a la siguiente página con el código de la mascota como parámetro
          window.location.href = `index1.html?codigoMascota=${encodeURIComponent(codigoMascota)}`;
        }else {
          console.log("Código de mascota no válido.");
          Swal.fire("Error", "Código de mascota no valido o inactivo", "error");
          encenderCamara();
        }
      })
      .catch(error => {
        console.error("Error al verificar el código de la mascota:", error);
      });
  }
};

// evento para mostrar la cámara
window.addEventListener('load', (e) => {
  console.log("Página cargada, esperando evento táctil para encender la cámara...");
  // Encender la cámara cuando se toque en algún lugar de la pantalla
  document.body.addEventListener('click', clicEncenderCamara, { once: true });
});