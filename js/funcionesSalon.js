
function imprimir(){
	console.log("test");
	$.ajax({    
    url : '***',
	data: '{}',
    type : 'GET',
    dataType : 'json',
    contentType: 'application/json; charset=utf-8',
	success:function(respuesta){
		let tabla = '<table>';
		for(i=0; i<respuesta.items.length; i++){
			tabla += '<tr>';              
			tabla += '<td>'+respuesta.items[i].id+'</td>';
			tabla += '<td>'+respuesta.items[i].f_owner+'</td>';
			tabla += '<td>'+respuesta.items[i].f_capacity+'</td>';
			tabla += '<td>'+respuesta.items[i].F_category+'</td>';
            tabla += '<td>'+respuesta.items[i].f_name+'</td>';
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