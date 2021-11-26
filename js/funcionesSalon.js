const baseUrl = 'http://150.230.92.110:8080/api/Partyroom/'

window.onload = async function(){

	const tableData = document.querySelector(".table_body")
	const formPartyroom = document.querySelector(".formulario_partyrooms");
  	const selectCategories = document.querySelector("#partyroom_category");
	var partyroomEditOptions = [];
	var partyroomDeleteOptions = [];
	var partyroomViewOptions = [];
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
    	updatePartyroomOptions();
    	updateSelectCategories();
	}

	/*Actualizar las opciones del select*/
	async function updateSelectCategories(){
	const options = await listarTodos('http://150.230.92.110:8080/api/Category/');
	if(Symbol.iterator in Object(options) && options.length > 0){
		options.forEach(option=>{
			selectCategories.innerHTML += `<option value="${option.id}">${option.name}</option>`
		})
	}
	}

	/*Crea un nuevo salon*/
	async function createPartyroom(e){
		e.preventDefault();
		e.stopPropagation();

		const data = {
			name: e.target.partyroom_name.value,
			owner: e.target.partyroom_owner.value,
			capacity: e.target.partyroom_capacity.value,
			category: {
       			 id: parseInt(e.target.partyroom_category.value)
     		},
     		 description: e.target.partyroom_description.value
		}

		const response = await crearObjecto(baseUrl, data);
		
		if(await response != null){
			document.querySelector(".without_results").style.display = "none";
			response.category.name = e.target.partyroom_category.options[e.target.partyroom_category.selectedIndex].text
			tableData.innerHTML += formatRowTable(response);
			e.target.reset()
			updatePartyroomOptions();
		}

	}
	/*Listener para crear un nuevo usuario*/
	formPartyroom.addEventListener("submit", createPartyroom)

	/*Agrega los datos del usuario al formulario para poder ser modificados*/
	async function updatePartyroom(id){
		formOptionActive = true;
		const data = await buscarObjeto(baseUrl, id);
		assignValuesInputs(await data.name, await data.owner, await data.capacity, await data.category.id, await data.description);
		var submit_btn = formPartyroom.querySelector(".submit_btn");
		var cancel_btn = formPartyroom.querySelector(".cancel_btn");
		var title_form = formPartyroom.querySelector(".form_title");
		if(submit_btn){
			submit_btn.innerHTML = "Actualizar";
			submit_btn.classList.replace("submit_btn", "btn_disabled");
			cancel_btn.style.display = "inline-block";
		}
		if(title_form){
			title_form.innerHTML = "Actualizar Salon"
		}
		formPartyroom.querySelectorAll(".entry_form").forEach(entry => {
			entry.addEventListener("focus", () => submit_btn.classList.replace("btn_disabled", "submit_btn"))
		});
		
		/*Actualiza los datos de un usuario*/
		formPartyroom.removeEventListener("submit", createPartyroom);
		formPartyroom.addEventListener("submit", updatePartyroomAPI);

		/*Cancela la actualizacion y resetea el form a su estado original*/
		cancel_btn.addEventListener("click", resetForm)

		async function updatePartyroomAPI(e){
			e.preventDefault();
			e.stopPropagation();

			const data = {
				id: parseInt(id),
				name: e.target.partyroom_name.value,
				owner: e.target.partyroom_owner.value,
				capacity: parseInt(e.target.partyroom_capacity.value),
				category: {
					id: parseInt(e.target.partyroom_category.value)
				},
				description: e.target.partyroom_description.value
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
			title_form.innerHTML = "Registro de Salones";
			formPartyroom.reset();
			formPartyroom.removeEventListener("submit", updatePartyroomAPI)
			formPartyroom.addEventListener("submit", createPartyroom);
			cancel_btn.removeEventListener("click", resetForm);
			cancel_btn.style.display = "none";
			submit_btn.innerHTML = "Registrar";
			formOptionActive = false;
		}
	}

	/*Eliminar cliente*/
	async function deletePartyroom(id){
		if(confirm("Seguro que desea eliminar este salon")){
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
			const submit_btn = formPartyroom.querySelector(".submit_btn")
			submit_btn.style.display = "none";

			var title_form = formPartyroom.querySelector(".form_title");
			title_form !== null? title_form.innerHTML = "Detalles del Salon" : "";
			
			var cancel_btn = formPartyroom.querySelector(".cancel_btn");
			cancel_btn !== null? cancel_btn.innerHTML = "Cerrar" : "";
			cancel_btn.style.display = "inline-block";

			assignValuesInputs(data.name, data.owner, data.capacity, data.category.id, data.description);
			
			const fieldForms = document.querySelectorAll(".field_form");
			fieldForms.forEach((field, index) => {
				if(index === 4){
					field.classList.add("field_form_view_text_area");
					field.querySelector("textarea").readOnly = true;
				}else{
					field.classList.add("field_form_view");
					if(field.querySelector("input")){
						field.querySelector("input").classList.replace("input_form", "form_data_view");
						field.querySelector("input").readOnly = true;
					}
					if(field.querySelector("select")){
						field.querySelector("select").style.display = "none";
						field.querySelector("input").value = data.category.name;
						field.querySelector("input").style.display = "block"
					}
				}
      		})

			cancel_btn.addEventListener("click", resetForm);

			/*Reseteo del formulario*/
			function resetForm(){
				title_form.innerHTML = "Registro de Salones";
				assignValuesInputs("", "", "", "","");
				fieldForms.forEach((field, index) => {
					if(index === 4){
						field.classList.remove("field_form_view_text_area");
						field.querySelector("textarea").readOnly = false;
					}else{
						field.classList.remove("field_form_view");
						if(field.querySelector("input")){
							field.querySelector("input").classList.replace("form_data_view", "input_form");
							field.querySelector("input").readOnly = false;
						}
						if(field.querySelector("select")){
							field.querySelector("select").style.display = "block";
							field.querySelector("input").value = "";
							field.querySelector("input").style.display = "none"
						}
					}
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
			<td class="columna-id-tabla-partyrooms column_id">${data.id}</td>
			<td class="columna-name-tabla-partyrooms">${data.name}</td>
			<td class="columna-owner-tabla-partyrooms">${data.owner}</td>
			<td class="columna-category-tabla-partyrooms">${data.category.name}</td>
			<td class="columna-description-tabla-partyrooms">${data.description}</td>
			<td class="columna-capacity-tabla-partyrooms">${data.capacity}</td>
			<td class="columna-options-tabla-partyrooms">
				<i class="far fa-edit vista-icon icon edit_partyroom" data-id="${data.id}"></i>
				<i class="fas fa-trash-alt eliminar_icon icon delete_partyroom" data-id="${data.id}"></i>
				<i class="far fa-window-maximize view_icon icon view_partyroom" data-id="${data.id}"></i>
			</td>
		</tr>
		`
	}

	/*Mantiene actualizado el numero de botones de actualizar y eliminar de cada cliente*/
	function updatePartyroomOptions(){
		partyroomEditOptions = document.querySelectorAll(".edit_partyroom");
		partyroomDeleteOptions = document.querySelectorAll(".delete_partyroom");
		partyroomViewOptions = document.querySelectorAll(".view_partyroom");
		partyroomEditOptions.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : updatePartyroom(btn.getAttribute("data-id"))));
		partyroomDeleteOptions.forEach(btn => btn.addEventListener("click", () => deletePartyroom(btn.getAttribute("data-id"))));
		partyroomViewOptions.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : viewDetails(btn.getAttribute("data-id"))));
	}

	/*asign values to form inputs*/
	function assignValuesInputs(name, owner, capacity, category, description){
		formPartyroom.partyroom_name.value = name;
		formPartyroom.partyroom_owner.value = owner;
		formPartyroom.partyroom_capacity.value = capacity;
		formPartyroom.partyroom_category.value = category
		formPartyroom.partyroom_description.value = description
	}

}