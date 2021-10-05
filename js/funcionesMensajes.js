// Remplazar con su nombre terminado en 'an' y Añadir la url de su base de datos en links.
// const baseUrl = ian.UrlBase;
const baseUrl = 'https://g9acbb495f01cb2-reto2frontend.adb.sa-saopaulo-1.oraclecloudapps.com';

function listarMensajes() {
  $.ajax({
    url: `${baseUrl}/ords/admin/message/message`,
    type: 'GET',
    datatype: 'JSON',
    success: respuesta => {
      let headersTable = `
        <tr>
        <td class="columna-id-tabla-mensajes header-id-tabla-mensajes header-tabla-mensajes">Id</td>
        <td class="columna-message-tabla-mensajes header-message-tabla-mensajes header-tabla-mensajes">Mensaje</td>
          <td class="columna-options-tabla-mensajes header-options-tabla-mensajes header-tabla-mensajes">Opciones</td>
          </tr>`
      let table = headersTable;
      respuesta.items.forEach(({ id, messagetext }) => {
        table += `
          <tr>
          <td class="columna-id-tabla-mensajes">${id}</td>
            <td class="columna-message-tabla-mensajes">${messagetext}</td>
            <td class="columna-options-tabla-mensajes">
              <i class="fas fa-trash-alt eliminar-icon icon" onclick="eliminarMensaje(${id})"></i>
              <i class="fas fa-envelope-open-text vista-icon icon" onclick="leerMensaje(${id})"></i>
              </td>;
          </tr>
      `
    })
    $('.tabla_mensajes').empty();
      $('.tabla_mensajes').append(table + '</table>')
    },
    error: respuesta => {
      console.log(respuesta)
    }
  })
}

listarMensajes();

function agregarMensaje(){
  $.ajax({
    url: `${baseUrl}/ords/admin/message/message`,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      id: $("#message_id").val(),
      messagetext: $('#messagetext').val()
    }),
    error: function(respuesta){
      console.log(respuesta)
    },
    statusCode: {
      201: () => listarMensajes()
    }
  })
}

// AL ENVIAR EL FORMULARIO DE REGISTRO DE MENSAJES
window.onload = function(e){
  let node = document.querySelector("#formulario-mensajes");
  node.addEventListener("submit", function(e){
    e.preventDefault();
    agregarMensaje();
  })
}

function eliminarMensaje(id) {
  $.ajax({
    url: `${baseUrl}/ords/admin/message/message`,
    type: 'DELETE',
    data: JSON.stringify({ id: id }),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    statusCode: {
      204: () => listarMensajes(),
    },
  })
}
