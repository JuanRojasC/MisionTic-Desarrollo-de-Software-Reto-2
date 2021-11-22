const baseUrl = 'http://localhost:8080/api/Client/'

window.onload = async function(){

	const tableData = document.querySelector(".tabla_clientes")
	const formClient = document.querySelector(".formulario_clientes");
	var clientsEditOption = [];
	var clientsDeleteOption = [];

	updateTable(tableData)
	
	/*Actualizar la tabla de registro*/
	async function updateTable(table){
		const data = await listarTodos(baseUrl);
		const headers = table.querySelector(".table_headers");
		table.innerHTML = "";
		table.appendChild(headers);
		for(var obj of await data){
			table.innerHTML += formatRowTable(obj);
		}
		updateClientsOptions();
	}

	/*Crea un nuevo usuario*/
	async function createClient(e){
		e.preventDefault();
		e.stopPropagation();

		const data = {
			name: e.target.name_cliente.value,
			email: e.target.email_cliente.value,
			age: e.target.age_cliente.value,
			password: e.target.password_cliente.value
		}

		const response = await crearObjecto(baseUrl, data);

		if(await response.idClient != null){
			tableData.innerHTML += formatRowTable(await response);
			updateClientsOptions();
		}

	}
	/*Listener para crear un nuevo usuario*/
	formClient.addEventListener("submit", createClient)

	/*Agrega los datos del usuario al formulario para poder ser modificados*/
	async function updateClient(id){
		const data = await buscarObjeto(baseUrl, id);
		formClient.name_cliente.value = await data.name;
		formClient.email_cliente.value = await data.email;
		formClient.age_cliente.value = await data.age;
		formClient.password_cliente.value = await data.password;
		var submit_btn = formClient.querySelector(".submit_btn");
		var title_form = formClient.querySelector(".form_title");
		if(submit_btn){
			submit_btn.innerHTML = "Actualizar";
			submit_btn.classList.replace("submit_btn", "btn_disabled");
		}
		if(title_form){
			title_form.innerHTML = "Actualizar Cliente"
		}
		formClient.querySelectorAll("input").forEach(input => {
			input.addEventListener("focus", () => submit_btn.classList.replace("btn_disabled", "submit_btn"))
		});
		
		/*Actualiza los datos de un usuario*/
		formClient.removeEventListener("submit", createClient);
		formClient.addEventListener("submit", updateClientAPI);

		async function updateClientAPI(e){
			e.preventDefault();
			e.stopPropagation();

			const data = {
				idClient: parseInt(id),
				name: e.target.name_cliente.value,
				email: e.target.email_cliente.value,
				age: e.target.age_cliente.value,
				password: e.target.password_cliente.value
			}

			const response = await actualizarObjecto(baseUrl, data)

			if(await response.id !== null){
				/*Restablece el formulario*/
				title_form.innerHTML = "Registro de Clientes";
				formClient.reset();
				formClient.removeEventListener("submit", updateClientAPI)
				formClient.addEventListener("submit", createClient);
				updateTable(tableData)
			}
		}
	}

	async function deleteClient(id){
		const response = await eliminarObjecto(baseUrl, id);
		if(response){
			alert("cliente eliminado");
			updateTable(tableData);
		}
	}

	/*Retorna el formato para un fila de la tabla*/
	function formatRowTable(data){
		return `
		<tr>
			<td class="columna-id-tabla-clientes column_id">${data.idClient}</td>
			<td class="columna-name-tabla-clientes">${data.name}</td>
			<td class="columna-email-tabla-clientes">${data.email}</td>
			<td class="columna-age-tabla-clientes">${data.age}</td>
			<td class="columna-options-tabla-clientes">
				<i class="far fa-edit vista-icon icon edit_client" data-id="${data.idClient}"></i>
				<i class="fas fa-trash-alt eliminar_icon icon delete_client" data-id="${data.idClient}"></i>
			</td>
		</tr>
		`
	}

	/*Mantiene actualizado el numero de botones de actualizar y eliminar de cada cliente*/
	function updateClientsOptions(){
		clientsEditOption = document.querySelectorAll(".edit_client");
		clientsDeleteOption = document.querySelectorAll(".delete_client");
		clientsEditOption.forEach(btn => btn.addEventListener("click", () => updateClient(btn.getAttribute("data-id"))));
		clientsDeleteOption.forEach(btn => btn.addEventListener("click", () => deleteClient(btn.getAttribute("data-id"))));
	}

}

// function listarClientes(){

// 	$.ajax({
// 	url: `${baseUrl}/ords/admin/client/client`,
// 	data: '{}',
//     type : 'GET',
//     dataType : 'json',
//     contentType: 'application/json; charset=utf-8',
// 	success:function(respuesta){
// 		let tabla;
// 		let clientes = respuesta.items
// 		for(i=0; i<clientes.length; i++){
// 			tabla += '<tr>';              
// 			tabla += '<td class="columna-id-tabla-clientes">'+respuesta.items[i].id+'</td>';
// 			tabla += '<td class="columna-name-tabla-clientes">'+respuesta.items[i].name+'</td>';
// 			tabla += '<td class="columna-email-tabla-clientes">'+respuesta.items[i].email+'</td>';
// 			tabla += '<td class="columna-age-tabla-clientes">'+respuesta.items[i].age+'</td>';
// 			tabla += `<td class="columna-options-tabla-clientes"><i class="fas fa-trash-alt eliminar-icon icon" onclick="eliminarCliente(${respuesta.items[i].id})"></i><i class="fas fa-envelope-open-text vista-icon icon" onclick="verCliente(${respuesta.items[i].id})"></i></td>`;
// 			tabla +='</tr>';			
// 		}
// 		$(".tabla_clientes").append(tabla);
// 	},
// 	error: function(xhr,status){
// 		console.log('error' + status);
// 	}
// 	}
	
// 	)
// }

// function agregarCliente(){
// 	$.ajax({
// 		url : `${baseUrl}/ords/admin/client/client`,
// 		type: 'POST',
// 		dataType: 'json',
// 		contentType: 'application/json; charset=utf-8',
// 		data: JSON.stringify({
// 			id: parseInt($("#id_cliente").val()),
// 			name: $("#name_cliente").val(),
// 			email: $("#email_cliente").val(),
// 			age: parseInt($("#age_cliente").val())
// 		}),
// 		statusCode: {
// 			201: () => listarClientes()
// 		}
// 	})
// }

// // AL ENVIAR EL FORMULARIO DE REGISTRO
// $(".formulario-clientes").submit(function(e){
// 	e.preventDefault();
// 	agregarCliente();
// })

// $(".registrar-clientes-boton").click(function(e){
// 	e.preventDefault();
// 	agregarCliente();
// })

// // ELIMINACION DE CLIENTES
// function eliminarCliente(id){
// 	$.ajax({
// 	  url: `${baseUrl}/ords/admin/client/client`,
// 	  type: 'DELETE',
// 	  data: JSON.stringify({ id: id }),
// 	  dataType: 'json',
// 	  contentType: 'application/json; charset=utf-8',
// 	  statusCode: {
// 		204: () => location.reload(true)
// 	  },
// 	})
// }

// // VISTA DETALLE DE CLIENTES
// function verCliente(id){
// 	$.ajax({
// 		url: `${baseUrl}/ords/admin/client/client`,
// 		data: '{}',
// 		type : 'GET',
// 		dataType : 'json',
// 		contentType: 'application/json; charset=utf-8',
// 		success:function(respuesta){
// 			let cliente;
// 			let clientes = respuesta.items;
// 			for(i=0; i<clientes.length; i++){
// 				if(respuesta.items[i].id == id) {
// 					cliente = respuesta.items[i];
// 					$(".container-data").empty();
// 					$(".container-data").append(`
// 						<h1>Cliente</h1>
// 						<i id="update-data" class="fas fa-user-cog update-data" onclick="vistaActualizarCliente()"></i>
// 						<label for="id_cliente" class="label-clientes label-data-cliente">Id: <span id="cliente_id" class="user-data"> ${cliente.id}</span></label>
// 						<label for="name_cliente" class="label-clientes label-data-cliente">Nombre: <span id="cliente_name" class="user-data"> ${cliente.name}</span></label>
// 						<label for="email_cliente" class="label-clientes label-data-cliente">Email:  <span id="cliente_email" class="user-data"> ${cliente.email}</span></label>
// 						<label for="age_cliente" class="label-clientes label-data-cliente">Edad:  <span id="cliente_age" class="user-data"> ${cliente.age}</span></label>
// 						<button class="cerrar-data-boton" onclick="cerrarData()">Cerrar</button>
// 					`)
// 					break;
// 				}		
// 			}
// 		},
// 		error: function(xhr,status){
// 			console.log('error' + status);
// 		}
// 		})
// }

// // CERRAR PANEL DE VISTA DETALLE DE CLIENTES
// function cerrarData(){
// 	location.reload(true);
// }

// // PASAR DE VISTA DETALLE A VISTA ACTUALIZACION
// function vistaActualizarCliente(){
// 	let cliente =  {id:$("#cliente_id").text(), name: $("#cliente_name").text(), email: $("#cliente_email").text(), age: parseInt($("#cliente_age").text())}
// 	$(".container-data").empty();
// 	$(".container-data").append(`
// 		<h1>Actualizar Cliente</h1>
// 		<label for="id_cliente" class="label-clientes label-data-cliente">Id: 
// 			<span id="cliente_id" class="user-data"> ${cliente.id}</span>
// 		</label>
// 		<label for="name_cliente" class="label-clientes label-data-cliente">Nombre: 
// 			<input type="text" id="name_cliente" name="name_cliente" class="input-clientes" value="${cliente.name}" required/>
// 		</label>
// 		<label for="email_cliente" class="label-clientes label-data-cliente">Email:  
// 			<input type="email" id="email_cliente" name="email_cliente" class="input-clientes" value="${cliente.email}" required/>
// 		</label>
// 		<label for="age_cliente" class="label-clientes label-data-cliente">Edad:  
// 			<input type="number" id="age_cliente" name="age_cliente" class="input-clientes" value="${cliente.age}" required/>
// 		</label>
// 		<button class="actualizar-data-boton" onclick="actualizarCliente()">Actualizar</button>
// 	`)
// }
  

// function actualizarCliente(){
// 	$.ajax({
// 		url : `${baseUrl}/ords/admin/client/client`,
// 		type: 'PUT',
// 		dataType: 'json',
// 		contentType: 'application/json; charset=utf-8',
// 		data: JSON.stringify({
// 			id: parseInt($("#cliente_id").text()),
// 			name: $("#name_cliente").val(),
// 			email: $("#email_cliente").val(),
// 			age: parseInt($("#age_cliente").val())
// 		}),
// 		statusCode: {
// 			201: () => {listarClientes();verCliente(parseInt($("#cliente_id").text()))}
// 		}
// 	})
// }

