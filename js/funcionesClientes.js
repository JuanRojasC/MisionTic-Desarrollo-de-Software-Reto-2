const baseUrl = 'https://g9acbb495f01cb2-reto2frontend.adb.sa-saopaulo-1.oraclecloudapps.com'

function listarClientes(){
	$.ajax({
	url: `${baseUrl}/ords/admin/client/client`,
	data: '{}',
    type : 'GET',
    dataType : 'json',
    contentType: 'application/json; charset=utf-8',
	success:function(respuesta){
		let tabla;
		for(i=0; i<respuesta.items.length; i++){
			tabla += '<tr>';              
			tabla += '<td class="columna-id-tabla-clientes">'+respuesta.items[i].id+'</td>';
			tabla += '<td class="columna-name-tabla-clientes">'+respuesta.items[i].name+'</td>';
			tabla += '<td class="columna-email-tabla-clientes">'+respuesta.items[i].email+'</td>';
			tabla += '<td class="columna-age-tabla-clientes">'+respuesta.items[i].age+'</td>';
			tabla += `<td class="columna-options-tabla-clientes"><i class="fas fa-trash-alt eliminar-icon icon" onclick="eliminarCliente(${respuesta.items[i].id})"></i><i class="fas fa-envelope-open-text vista-icon icon"></i></td>`;
			tabla +='</tr>';			
		}
		$(".tabla_clientes").append(tabla);
	},
	error: function(xhr,status){
		console.log('error' + status);
	}
	}
	
	)
}

listarClientes();

function agregarCliente(){
	$.ajax({
		url : `${baseUrl}/ords/admin/client/client`,
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({
			id: parseInt($("#id_cliente").val()),
			name: $("#name_cliente").val(),
			email: $("#email_cliente").val(),
			age: parseInt($("#age_cliente").val())
		}),
		statusCode: {
			201: () => location.reload(true)
		},
		error: function(xhr,status){
			console.log(xhr)
			alert("El cliente no pudo ser registrado\n\nERROR: " + status)
		}
	})
}

// AL ENVIAR EL FORMULARIO DE REGISTRO
$(".formulario-clientes").submit(function(e){
	e.preventDefault();
	agregarCliente();
})

$(".registrar-clientes-boton").click(function(e){
	e.preventDefault();
	agregarCliente();
})

// ELIMINACION DE CLIENTES
function eliminarCliente(id){
	$.ajax({
	  url: `${baseUrl}/ords/admin/client/client`,
	  type: 'DELETE',
	  data: JSON.stringify({ id: id }),
	  dataType: 'json',
	  contentType: 'application/json; charset=utf-8',
	  statusCode: {
		204: () => location.reload(true)
	  },
	})
}
  

