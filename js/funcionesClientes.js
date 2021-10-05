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
		let clientes = respuesta.items.reverse()
		for(i=0; i<clientes.length; i++){
			tabla += '<tr>';              
			tabla += '<td class="columna-id-tabla-clientes">'+respuesta.items[i].id+'</td>';
			tabla += '<td class="columna-name-tabla-clientes">'+respuesta.items[i].name+'</td>';
			tabla += '<td class="columna-email-tabla-clientes">'+respuesta.items[i].email+'</td>';
			tabla += '<td class="columna-age-tabla-clientes">'+respuesta.items[i].age+'</td>';
			tabla += `<td class="columna-options-tabla-clientes"><i class="fas fa-trash-alt eliminar-icon icon" onclick="eliminarCliente(${respuesta.items[i].id})"></i><i class="fas fa-envelope-open-text vista-icon icon" onclick="verCliente(${respuesta.items[i].id})"></i></td>`;
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
			201: () => listarClientes()
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

// VISTA DETALLE DE CLIENTES
function verCliente(id){
	$.ajax({
		url: `${baseUrl}/ords/admin/client/client`,
		data: '{}',
		type : 'GET',
		dataType : 'json',
		contentType: 'application/json; charset=utf-8',
		success:function(respuesta){
			let cliente;
			let clientes = respuesta.items;
			for(i=0; i<clientes.length; i++){
				if(respuesta.items[i].id == id) {
					cliente = respuesta.items[i];
					$(".container-data").empty();
					$(".container-data").append(`
						<h1>Cliente</h1>
						<label for="id_cliente" class="label-clientes label-data-cliente">ID: <span class="user-data"> ${cliente.id}</span></label>
						<label for="name_cliente" class="label-clientes label-data-cliente">Nombre: <span class="user-data"> ${cliente.name}</span></label>
						<label for="email_cliente" class="label-clientes label-data-cliente">Email:  <span class="user-data"> ${cliente.email}</span></label>
						<label for="age_cliente" class="label-clientes label-data-cliente">Edad:  <span class="user-data"> ${cliente.age}</span></label>
						<button class="cerrar-data-boton" onclick="cerrarData()">Cerrar</button>
		
					`)
					break;
				}		
			}
		},
		error: function(xhr,status){
			console.log('error' + status);
		}
		})
}


function cerrarData(){
	location.reload(true);
}
  

