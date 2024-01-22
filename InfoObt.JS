// Función para obtener parámetros de la URL por nombre
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // Obtiene el código de la mascota de los parámetros de la URL
  const codigoMascota = getParameterByName("codigoMascota");

  // Verifica si se proporcionó el código de la mascota en la URL
  if (codigoMascota) {
    // Realiza una solicitud a tu API para obtener los datos de la mascota
    const apiUrl =
      "https://ginfinity.xyz/MyPets_Admin/servicios/prc/prc_mascota.php?accion=C&estado=A&codigo=" + codigoMascota;

      console.log(apiUrl);

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
          // Aquí puedes actualizar el contenido de tu página con los datos de la mascota
          const nombreMascota = data.info[0].mascota.nmasc;
          const fechanacimiento = data.info[0].mascota.nacim;
          const Departamento = data.info[0].mascota.depto;
          const Municipio = data.info[0].mascota.muni;
          const direcciones = data.info[0].mascota.direccion;
          const tel = data.info[0].mascota.telefono;
          const mails = data.info[0].mascota.mail;
          const estadoDireccion = data.info[0].mascota.estadodir;

          // Actualiza el contenido de tu página con el nombre de la mascota u otros datos necesarios
          document.getElementById("Nom").innerText = nombreMascota;
          document.getElementById("cod").innerText = codigoMascota;
          document.getElementById("Fech").innerText = fechanacimiento;
          document.getElementById("Dep").innerText = Departamento;
          document.getElementById("Mun").innerText = Municipio;
          document.getElementById("Direc").innerText = direcciones;
          document.getElementById("Contc").innerText = tel;
          document.getElementById("Ema").innerText = mails;

          const direccionElement = document.getElementById("Direc");

          if (estadoDireccion === "I") {
            direccionElement.textContent = "Pendiente";
          } else {
            // Si no es "I", muestra la dirección normalmente
            direccionElement.textContent = direcciones;
          }

          // Obtén la referencia al cuerpo de la tabla
          const tbody = document.querySelector('.container tbody');

          if (data.info[0].vacuna && (Array.isArray(data.info[0].vacuna) || typeof data.info[0].vacuna === "object")) {
            // Si es un objeto, conviértelo en un array
            var vacunas = Array.isArray(data.info[0].vacuna) ? data.info[0].vacuna : [data.info[0].vacuna];

            // Itera sobre las vacunas
            vacunas.forEach(function (vacuna) {
              var newRow = tbody.insertRow();
              var vacunaCell = newRow.insertCell(0);
              var fechaColocCell = newRow.insertCell(1);

              vacunaCell.textContent = vacuna.nombrevacuna || "N/A";
              fechaColocCell.textContent = vacuna.fecha_creacion || "N/A";
            });
          } else {
            console.error("El campo 'vacuna' no es un array u objeto en la respuesta de la API.");
          }

          // Verifica si la respuesta contiene la URL de la imagen
          const imagenBase64 = data.info[0].mascota.foto;

          // Obtén la referencia a la imagen en tu página
          const dogImage = document.getElementById("dog-image");

          // Establece el atributo src con la imagen codificada en base64
          dogImage.src = `data:image/png;base64, ${imagenBase64}`;
        } else {
          alert("Error al obtener los datos de la mascota.");
        }
      })
      .catch(error => {
        console.error("Error al obtener datos", error);
      });
  } else {
    alert("Código de mascota no proporcionado en la URL.");
  }