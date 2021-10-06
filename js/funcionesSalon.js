// Remplazar con su nombre terminado en 'an' y Añadir la url de su base de datos en links.
// const baseUrl = ian.UrlBase;
const baseUrl = 'https://g9acbb495f01cb2-reto2frontend.adb.sa-saopaulo-1.oraclecloudapps.com';

window.onload = function(e){

  function agregarSalon(){
    $.ajax({
      url: `${baseUrl}/ords/admin/partyroom/partyroom`,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        id: $("#id_salon").val(),
        owner: $('#propietario_salon').val(),
        capacity: $("#capacity_salon").val(),
        category_id: $("#category_salon").val(),
        name: $("#name_salon").val()
      }),
      statusCode: {
        201: () => listarSalones()
      }
    })
  }

  // AL ENVIAR EL FORMULARIO DE REGISTRO DE SALONES
  let node = document.querySelector("#formulario-salones");
  node.addEventListener("submit", function(e){
    e.preventDefault();
    agregarSalon();
  })
  
}

function listarSalones(){
  let table = `
    <tr>
      <td class="columna-id-tabla-salones header-id-tabla-salones header-tabla-salones">Id</td>
      <td class="columna-owner-tabla-salones header-owner-tabla-salones header-tabla-salones">Propietario</td>
      <td class="columna-capacity-tabla-salones header-capacity-tabla-salones header-tabla-salones">Capacidad</td>
      <td class="columna-category-tabla-salones header-category-tabla-salones header-tabla-salones">Categoria</td>
      <td class="columna-name-tabla-salones header-id-tabla-salones header-tabla-salones">Nombre</td>
      <td class="columna-options-tabla-salones header-id-tabla-salones header-tabla-salones">Opciones</td>
    </tr>`
  $('.tabla_salones').empty();
  $('.tabla_salones').append(table + '</table>')
  $.ajax({
    url: `${baseUrl}/ords/admin/partyroom/partyroom`,
    type: 'GET',
    datatype: 'JSON',
    contentType: "application/json",
    success: respuesta => {
      respuesta.items.forEach((salon) => {
        table += `
          <tr>
            <td class="columna-id-tabla-salones">${salon.id}</td>
            <td class="columna-owner-tabla-salones">${salon.owner}</td>
            <td class="columna-capacity-tabla-salones">${salon.capacity}</td>
            <td class="columna-category-tabla-salones">${salon.category_id}</td>
            <td class="columna-name-tabla-salones">${salon.name}</td>
            <td class="columna-options-tabla-salones">
              <i class="fas fa-trash-alt eliminar-icon icon" onclick="eliminarSalon(${salon.id})"></i>
              <i class="fas fa-envelope-open-text vista-icon icon" onclick="leerSalon(${salon.id})"></i> 
            </td>
          </tr>`
      })
    $('.tabla_salones').empty();
    $('.tabla_salones').append(table + '</table>')
    },
    error: respuesta => {
      console.log(respuesta)
    }
  })
}

listarSalones();

function eliminarSalon(id) {
  $.ajax({
    url: `${baseUrl}/ords/admin/partyroom/partyroom`,
    type: 'DELETE',
    data: JSON.stringify({ id: id }),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    statusCode: {
      204: () => listarSalones()
    }
  })
}