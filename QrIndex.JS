// crea elemento
const video = document.createElement("video");

// nuestro canvas
let canvasElement = document.getElementById("qr-canvas");

// lectura desactivada
let scanning = false;

// referencia al botón de escaneo
const btnScanQR = document.getElementById("btnscan");

// función para encender la cámara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      if (btnScanQR) btnScanQR.style.display = "none";
      if (canvasElement) canvasElement.style.display = "block", canvasElement.style.width= "200px", canvasElement.style.position = "absolute", canvasElement.style.left= "66%", canvasElement.style.top= "38%";
      const canvas = canvasElement.getContext("2d");
      video.setAttribute("playsinline", true); // required to tell iOS Safari we don't want fullscreen
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
    setTimeout(scan, 300);
  }
}

// apagar la cámara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  if (canvasElement) canvasElement.style.display = "none";
  if (btnScanQR) btnScanQR.style.display = "block";
  canvasElement.classList.add('active');
};

// callback cuando termina de leer el código QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    Swal.fire(respuesta);
    cerrarCamara();
  }
};

// evento para mostrar la cámara sin el botón
window.addEventListener('load', (e) => {
  encenderCamara();
});




