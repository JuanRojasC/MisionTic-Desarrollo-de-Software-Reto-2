const baseUrl = 'http://132.226.254.141:8080/api/Client/'

window.onload = async function(){

	const tableData = document.querySelector(".table_body")
	const formClient = document.querySelector(".formulario_clientes");
	var clientsEditOption = [];
	var clientsDeleteOption = [];
	var clientsViewOption = [];
	var formOptionActive = false;

	updateTable(tableData)
	
	/*Actualizar la tabla de registro*/
	async function updateTable(table){
		const data = await listarTodos(baseUrl);
		if(Symbol.iterator in Object(data) && data.length > 0){
			document.querySelector(".without_results").style.display = "none";
			table.innerHTML = "";
			for(var obj of await data){
				table.innerHTML += formatRowTable(obj);
			}
		}else{
            table.innerHTML = ""
            document.querySelector(".without_results").style.display = "block";
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

		if(await response != null){
			e.target.reset();
			document.querySelector(".without_results").style.display = "none";
			tableData.innerHTML += formatRowTable(await response);
			updateClientsOptions();
		}

	}
	/*Listener para crear un nuevo usuario*/
	formClient.addEventListener("submit", createClient)

	/*Agrega los datos del usuario al formulario para poder ser modificados*/
	async function updateClient(id){
		formOptionActive = true;
		const data = await buscarObjeto(baseUrl, id);
		assignValuesInputs(await data.name, await data.email, await data.age, await data.password);
		var submit_btn = formClient.querySelector(".submit_btn");
		var cancel_btn = formClient.querySelector(".cancel_btn");
		var title_form = formClient.querySelector(".form_title");
		if(submit_btn){
			submit_btn.innerHTML = "Actualizar";
			submit_btn.classList.replace("submit_btn", "btn_disabled");
			cancel_btn.style.display = "inline-block";
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

		/*Cancela la actualizacion y resetea el form a su estado original*/
		cancel_btn.addEventListener("click", resetForm)

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

			if(await response !== null && await response !== undefined){
				/*Restablece el formulario*/
				resetForm();
				updateTable(tableData);
			}
		}

		/*Reseteo del formulario*/
		function resetForm(){
			title_form.innerHTML = "Registro de Clientes";
			formClient.reset();
			formClient.removeEventListener("submit", updateClientAPI)
			formClient.addEventListener("submit", createClient);
			cancel_btn.removeEventListener("click", resetForm);
			cancel_btn.style.display = "none";
			submit_btn.innerHTML = "Registrar";
			formOptionActive = false;
		}
	}

	/*Eliminar cliente*/
	async function deleteClient(id){
		if(confirm("Seguro que desea eliminar este cliente")){
			const response = await eliminarObjecto(baseUrl, id);
			if(await response === 204){
				updateTable(tableData);
			}
		}
	}

	/*Vista detalle del cliente*/
	async function viewDetails(id){
		formOptionActive = true;
		const data = await buscarObjeto(baseUrl, id);
		if(data != null){
			const submit_btn = formClient.querySelector(".submit_btn")
			submit_btn.style.display = "none";

			var title_form = formClient.querySelector(".form_title");
			title_form !== null? title_form.innerHTML = "Cliente" : "";
			
			var cancel_btn = formClient.querySelector(".cancel_btn");
			cancel_btn !== null? cancel_btn.innerHTML = "Cerrar" : "";
			cancel_btn.style.display = "inline-block";

			assignValuesInputs(data.name, data.email, data.age, data.password);
			
			const fieldForms = document.querySelectorAll(".field_form");
			fieldForms.forEach(field => {
				field.classList.add("field_form_view");
				field.querySelector("input").classList.replace("input_form", "form_data_view");
			})

			cancel_btn.addEventListener("click", resetForm);

			/*Reseteo del formulario*/
			function resetForm(){
				title_form.innerHTML = "Registro de Clientes";
				assignValuesInputs("", "", "", "");
				fieldForms.forEach(field => {
					field.classList.remove("field_form_view");
					field.querySelector("input").classList.replace("form_data_view", "input_form");
				})
				cancel_btn.removeEventListener("click", resetForm);
				cancel_btn.style.display = "none";
				cancel_btn.innerHTML = "Cancelar";
				submit_btn.style.display = "inline-block";
				formOptionActive = false;
			}

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
				<i class="far fa-window-maximize view_icon icon view_client" data-id="${data.idClient}"></i>
			</td>
		</tr>
		`
	}

	/*Mantiene actualizado el numero de botones de actualizar y eliminar de cada cliente*/
	function updateClientsOptions(){
		clientsEditOption = document.querySelectorAll(".edit_client");
		clientsDeleteOption = document.querySelectorAll(".delete_client");
		clientsViewOption = document.querySelectorAll(".view_client");
		clientsEditOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : updateClient(btn.getAttribute("data-id"))));
		clientsDeleteOption.forEach(btn => btn.addEventListener("click", () => deleteClient(btn.getAttribute("data-id"))));
		clientsViewOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : viewDetails(btn.getAttribute("data-id"))));
	}

	/*asign values to form inputs*/
	function assignValuesInputs(name, email, age, password){
		formClient.name_cliente.value = name;
		formClient.email_cliente.value = email;
		formClient.age_cliente.value = age;
		formClient.password_cliente.value = password;
	}

}