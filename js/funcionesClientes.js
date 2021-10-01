function imprimir(){
	console.log("hola");
	$.ajax({    
    url : 'https://g546b155922178d-dbreto1.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/client/client',
	data: '{}',
    type : 'GET',
    dataType : 'json',
    contentType: 'application/json; charset=utf-8',
	success:function(respuesta){
		let tabla = '<table>';
		for(i=0; i<respuesta.items.length; i++){
			tabla += '<tr>';              
			tabla += '<td>'+respuesta.items[i].id+'</td>';
			tabla += '<td>'+respuesta.items[i].name+'</td>';
			tabla += '<td>'+respuesta.items[i].email+'</td>';
			tabla += '<td>'+respuesta.items[i].age+'</td>';
			tabla +='</tr>';			
		}		
		tabla +='</table>';
			$("#datos").append(tabla);
	},
	
	error: function(xhr,status){
		console.log('error' + status);
	}
	}
	
	)
}

