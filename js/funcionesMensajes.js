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
    }
  })
}

listarMensajes();

function añadirMensaje() {
  $.ajax({
    url: `${baseUrl}/ords/admin/message/message`,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      id: Math.floor(Math.random() * (9999 - 1)) + 1,
      messagetext: $('#messagetext').val()
    }),
    statusCode: {
      201: () => {
        listarMensajes()
      },
    },
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

function leerMensaje(id){
  $.ajax({
    url: `${baseUrl}/ords/admin/message/message/${id}`,
    type: 'GET',
    datatype: 'JSON',
    success: respuesta => {
      let mensaje = respuesta.items[0];
      console.log(mensaje)
      $("#message-detail").html(`
          <h2>Mensaje</h2>
          <button class="boton-cerrar" id="boton-cerrar" onclick="cerrarDetalle()" >X</button>
          <div>
            <h3>Id: </h3>
            <p class="id-text">${mensaje.id}</p>
          </div>
          <div>
            <h3>Contenido: </h3>
            <p class="message-text">${mensaje.messagetext}</p>
          </div>
      `)
    },
    error: e => {
        console.log(e)
    }   
  })
}

function cerrarDetalle(){
  $("#boton-cerrar").click(function(){
    $("#message-detail").empty()
  })
}
