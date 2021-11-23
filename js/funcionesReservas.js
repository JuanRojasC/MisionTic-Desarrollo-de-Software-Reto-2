const baseUrl = 'http://localhost:8080/api/Reservation/'

window.onload = async function(){

	const tableData = document.querySelector(".table_body")
	const formReservation = document.querySelector(".formulario_reservas");
	const selectClients = document.querySelector("#booking_client");
	const selectPartyrooms = document.querySelector("#booking_partyroom");
	var bookingsEditOption = [];
	var bookingsDeleteOption = [];
	var bookingsViewOption = [];
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
        updateReservationsOptions();
    	updateSelectClients();
      	updateSelectPartyrooms();
	}

	/*Actualizar las opciones del select de mensajes*/
	async function updateSelectClients(){
		const options = await listarTodos('http://localhost:8080/api/Client/');
		if(Symbol.iterator in Object(options) && options.length > 0){
			options.forEach(option=>{
			selectClients.innerHTML += `<option value="${option.idClient}">${option.name}</option>`
			})
		}
	}
		
		/*Actualizar las opciones del select de salones*/
		async function updateSelectPartyrooms(){
		const options = await listarTodos('http://localhost:8080/api/Partyroom/');
		if(Symbol.iterator in Object(options) && options.length > 0){
			options.forEach(option=>{
			selectPartyrooms.innerHTML += `<option value="${option.id}">${option.name}</option>`
			})
		}
	}

	/*Crea un nuevo usuario*/
	async function createReservation(e){
		e.preventDefault();
		e.stopPropagation();

		const data = {
			startDate: e.target.booking_start_date.value,
			devolutionDate: e.target.booking_finish_date.value,
			client: {
				idClient: parseInt(e.target.booking_client.value)
			},
			partyroom: {
				id: parseInt(e.target.booking_partyroom.value)
			}
		}

		const response = await crearObjecto(baseUrl, data);

		if(await response != null){
			document.querySelector(".without_results").style.display = "none";
			response.client.name = e.target.booking_client.options[e.target.booking_client.selectedIndex].text
			response.partyroom.name = e.target.booking_partyroom.options[e.target.booking_partyroom.selectedIndex].text
			tableData.innerHTML += formatRowTable(response);
			e.target.reset();
			updateReservationsOptions();
		}

	}
	/*Listener para crear un nuevo usuario*/
	formReservation.addEventListener("submit", createReservation)

	/*Agrega los datos del usuario al formulario para poder ser modificados*/
	async function updateReservation(id) {
		formOptionActive = true;
		const data = await buscarObjeto(baseUrl, id);
		assignValuesInputs(await data.startDate, await data.devolutionDate, await data.client, await data.partyroom);
		var submit_btn = formReservation.querySelector(".submit_btn");
		var cancel_btn = formReservation.querySelector(".cancel_btn");
		var title_form = formReservation.querySelector(".form_title");
		if (submit_btn) {
			submit_btn.innerHTML = "Actualizar";
			submit_btn.classList.replace("submit_btn", "btn_disabled");
			cancel_btn.style.display = "inline-block";
		}
		if (title_form) {
			title_form.innerHTML = "Actualizar Reserva"
		}
		formReservation.querySelectorAll(".entry_form").forEach(entry => {
			entry.addEventListener("focus", () => submit_btn.classList.replace("btn_disabled", "submit_btn"))
		});

		/*Actualiza los datos de un usuario*/
		formReservation.removeEventListener("submit", createReservation);
		formReservation.addEventListener("submit", updateReservationAPI);

		/*Cancela la actualizacion y resetea el form a su estado original*/
		cancel_btn.addEventListener("click", resetForm)

		async function updateReservationAPI(e) {
			e.preventDefault();
			e.stopPropagation();

			const data = {
				idReservation: parseInt(id),
				startDate: e.target.booking_start_date.value,
				devolutionDate: e.target.booking_finish_date.value,
				client: {
					idClient: parseInt(e.target.booking_client.value)
				},
				partyroom: {
					id: parseInt(e.target.booking_partyroom.value)
				}
			}

			const response = await actualizarObjecto(baseUrl, data)

			if (await response.id !== null) {
				/*Restablece el formulario*/
				resetForm();
				updateTable(tableData);
			}
		}

		/*Reseteo del formulario*/
		function resetForm() {
			title_form.innerHTML = "Registro de Reservas";
			formReservation.reset();
			formReservation.removeEventListener("submit", updateReservationAPI)
			formReservation.addEventListener("submit", createReservation);
			cancel_btn.removeEventListener("click", resetForm);
			cancel_btn.style.display = "none";
			submit_btn.innerHTML = "Registrar";
			formOptionActive = false;
		}
	}

	/*Eliminar cliente*/
	async function deleteBooking(id){
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
			const submit_btn = formReservation.querySelector(".submit_btn")
			submit_btn.style.display = "none";

			var title_form = formReservation.querySelector(".form_title");
			title_form !== null? title_form.innerHTML = "Reserva No. " + data.idReservation : "";
			
			var cancel_btn = formReservation.querySelector(".cancel_btn");
			cancel_btn !== null? cancel_btn.innerHTML = "Cerrar" : "";
			cancel_btn.style.display = "inline-block";

			assignValuesInputs(data.startDate, data.devolutionDate, data.client, data.partyroom);
			
			const fieldForms = document.querySelectorAll(".field_form");
            fieldForms.forEach(field => {
                if (field.querySelector("textarea")) {
                    field.classList.add("field_form_view_text_area");
                    field.querySelector("textarea").readOnly = true;
                }
                if (field.querySelector("input")) {
                    field.classList.add("field_form_view");
                    field.querySelector("input").classList.replace("input_form", "form_data_view");
                    field.querySelector("input").readOnly = true;
                }
                if (field.querySelector("select")) {
                    field.classList.add("field_form_view");
                    field.querySelector("select").style.display = "none";
                    field.querySelector("input").style.display = "block";
                }
            })

			cancel_btn.addEventListener("click", resetForm);

			/*Reseteo del formulario*/
			function resetForm(){
				title_form.innerHTML = "Registro de Clientes";
				assignValuesInputs("", "", "", "");
				fieldForms.forEach(field => {
                    if (field.querySelector("textarea")) {
                        field.classList.remove("field_form_view_text_area");
                        field.querySelector("textarea").readOnly = false;
                    }
                    if (field.querySelector("input")) {
                        field.classList.remove("field_form_view");
                        field.querySelector("input").classList.replace("form_data_view", "input_form");
                        field.querySelector("input").readOnly = false;
                    }
                    if (field.querySelector("select")) {
                        field.classList.remove("field_form_view");
                        field.querySelector("select").style.display = "block";
                        field.querySelector("input").value = "";
                        field.querySelector("input").style.display = "none"
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
			<td class="columna-id-tabla-bookings column_id">${data.idReservation}</td>
			<td class="columna-start_time-tabla-bookings">${(data.startDate).split("T")[0] /*+ " " + data.startDate.split(":00.")[0].split("T")[1]*/}</td>
			<td class="columna-finish_time-tabla-bookings">${(data.devolutionDate).split("T")[0] /*+ " " + data.devolutionDate.split(":00.")[0].split("T")[1]*/}</td>
			<td class="columna-partyroom-tabla-bookings">${data.partyroom.name}</td>
			<td class="columna-client-tabla-bookings">${data.client.name}</td>
			<td class="columna-status-tabla-bookings">${data.status}</td>
			<td class="columna-options-tabla-bookings">
				<i class="far fa-edit vista-icon icon edit_client" data-id="${data.idReservation}"></i>
				<i class="fas fa-trash-alt eliminar_icon icon delete_client" data-id="${data.idReservation}"></i>
				<i class="far fa-window-maximize view_icon icon view_client" data-id="${data.idReservation}"></i>
			</td>
		</tr>
		`
	}

	/*Mantiene actualizado el numero de botones de actualizar y eliminar de cada cliente*/
	function updateReservationsOptions(){
		bookingsEditOption = document.querySelectorAll(".edit_client");
		bookingsDeleteOption = document.querySelectorAll(".delete_client");
		bookingsViewOption = document.querySelectorAll(".view_client");
		bookingsEditOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : updateReservation(btn.getAttribute("data-id"))));
		bookingsDeleteOption.forEach(btn => btn.addEventListener("click", () => deleteBooking(btn.getAttribute("data-id"))));
		bookingsViewOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : viewDetails(btn.getAttribute("data-id"))));
	}

	/*asign values to form inputs*/
	function assignValuesInputs(startDate, devolutionDate, client, partyroom){
		formReservation.booking_start_date.value = startDate.split(":00.")[0];
		formReservation.booking_finish_date.value = devolutionDate.split(":00.")[0];
		formReservation.booking_client.value = client.idClient;
		formReservation.booking_partyroom.value = partyroom.id;
		formReservation.booking_client_input.value = client.name;
		formReservation.booking_partyroom_input.value = partyroom.name;
	}

}