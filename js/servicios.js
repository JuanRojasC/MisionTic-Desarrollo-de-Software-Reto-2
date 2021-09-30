// Añadir en esta variable la url de su base de datos
const baseUrl = ''

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
      id: $('#messages table tr').length + 1,
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
