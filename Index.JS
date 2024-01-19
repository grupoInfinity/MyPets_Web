function obtenerDatosYRedirigir() {
    // Obtiene el valor del input con id="texto"
    const codigoMascota = document.getElementById("texto").value;

    // Verifica si el campo de texto está vacío
    if (codigoMascota.trim() === "") {
      Swal.fire("Error","Por favor, ingresa el código de la mascota antes de continuar.", "error");
      return; // No realiza la solicitud si el campo está vacío
    }

    const apiUrl = "http://localhost/MyPets_Admin/servicios/prc/prc_mascota.php?accion=C&estado=A&codigo=" + codigoMascota;

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
        if (data.status === 1) {
          // Redirige a la página deseada
          redirigirConCodigoMascota(codigoMascota);
        } else {
          Swal.fire("Error", "Código de mascota no valido o inactivo", "error");
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