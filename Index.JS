function obtenerDatosYRedirigir() {
  // Obtiene el valor del input con id="texto"
  const codigoMascota = document.getElementById("texto").value;

  // Verifica si el campo de texto está vacío
  if (codigoMascota.trim() === "") {
    Swal.fire({
      title: "Error",
      text: "Campo vacio",
      icon: "error",
      confirmButtonClass: "small-swal-btn", // Nueva clase para el botón
    });
    return; // No realiza la solicitud si el campo está vacío
  }

  const style = document.createElement("style");
  style.innerHTML = ".small-swal-btn { padding: 0.2em 1em; font-size: 0.8em; }";
  document.head.appendChild(style);

  //const apiUrl = "http://192.168.1.22/MyPets_Admin/servicios/prc/prc_mascota.php?accion=C&estado=A&codigo=" + codigoMascota;
  const apiUrl = "https://ginfinity.xyz/MyPets_Admin/servicios/prc/prc_mascota.php?accion=C&estado=A&codigo=" + codigoMascota;

  // Realiza la solicitud a la API utilizando fetch
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // Verifica si la respuesta de la API es verdadera
		
	  //console.log(data.status);
      if (data.status === 1) {
        // Redirige a la página deseada
        redirigirConCodigoMascota(codigoMascota);
      } else {
        Swal.fire({
          title: "Error",
          text: "Codigo de la mascota no valido o inactivo.",
          icon: "error",
          confirmButtonClass: "small-swal-btn", // Nueva clase para el botón
        });
      }
    })
    .catch(error => {
      console.error("Error al obtener datos", error);
    });
}

function redirigirConCodigoMascota(codigoMascota) {
  const url = `index1.html?codigoMascota=${encodeURIComponent(codigoMascota)}`;

  // Redirige a la otra página
  window.location.href = url;
}