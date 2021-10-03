function listarClientes(){
	$.ajax({    
    url : 'https://g9acbb495f01cb2-reto2frontend.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/client/client',
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
			tabla +='</tr>';			
		}		
		$("#clientes_registrados").append(tabla);
	},
	
	error: function(xhr,status){
		console.log('error' + status);
	}
	}
	
	)
}

listarClientes();

function agregarCliente(e){
		$.ajax({
			url : 'https://g9acbb495f01cb2-reto2frontend.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/client/client',
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
			  id: $("#id_cliente").val(),
			  name: $("#name_cliente").val(),
			  email: $("#email_cliente").val(),
			  age: $("#age_cliente").val()
			}),
			success:function(respuesta){
				alert("Cliente Registrado")
			},
			error: function(xhr,status){
				alert("El cliente no pudo ser registrado")
			}
		  })
}

