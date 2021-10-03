// Remplazar con su nombre terminado en 'an' y Añadir la url de su base de datos en links.
const baseUrl = ian.UrlBase;

function listarMensajes() {
  $.ajax({
    url: `${baseUrl}/ords/admin/message/message`,
    type: 'GET',
    datatype: 'JSON',
    success: respuesta => {
      $('#messages').empty()

      let table = '<table>'

      respuesta.items.forEach(({ id, messagetext }) => {
        table += `
          <tr>
            <td>${messagetext}</td>
            <td><button onclick="eliminarMensaje(${id})">Eliminar</button></td>
            <td><button onclick="leerMensaje(${id})">Leer</button></td>
          </tr>
      `
      })

      $('#messages').append(table + '</table>')
    },
  })
}

function añadirMensaje() {
  $.ajax({
    url: `${baseUrl}/ords/admin/message/message`,
    type: 'POST',
    data: JSON.stringify({
      id: Math.floor(Math.random() * (9999999 - 1)) + 1,
      messagetext: $('#messagetext').val(),
    }),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    statusCode: {
      201: () => {
        $('#messagetext').val('')
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

listarMensajes()


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
