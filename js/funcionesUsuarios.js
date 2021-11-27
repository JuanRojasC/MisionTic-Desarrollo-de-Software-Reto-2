const baseUrl = 'http://150.230.92.110:8080/api/Admin/'

window.onload = async function(){

	const tableData = document.querySelector(".table_body")
	const formUser = document.querySelector(".formulario_users");
	var usersEditOption = [];
	var usersDeleteOption = [];
	var usersViewOption = [];
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
        updateUsersOptions();
	}

	/*Crea un nuevo usuario*/
	async function createUser(e){
		e.preventDefault();
		e.stopPropagation();

		const data = {
			name: e.target.user_name.value,
            email: e.target.user_email.value,
            password: e.target.user_password.value
		}

		const response = await crearObjecto(baseUrl, data);

		if(await response != null){
			document.querySelector(".without_results").style.display = "none";
			tableData.innerHTML += formatRowTable(response);
			e.target.reset();
			updateUsersOptions();
		}

	}
	/*Listener para crear un nuevo usuario*/
	formUser.addEventListener("submit", createUser)

	/*Agrega los datos del usuario al formulario para poder ser modificados*/
	async function updateUser(id) {
		formOptionActive = true;
		const data = await buscarObjeto(baseUrl, id);
		assignValuesInputs(await data.name, await data.email, await data.password);
		var submit_btn = formUser.querySelector(".submit_btn");
		var cancel_btn = formUser.querySelector(".cancel_btn");
		var title_form = formUser.querySelector(".form_title");
		if (submit_btn) {
			submit_btn.innerHTML = "Actualizar";
			submit_btn.classList.replace("submit_btn", "btn_disabled");
			cancel_btn.style.display = "inline-block";
		}
		if (title_form) {
			title_form.innerHTML = "Actualizar Reserva"
		}
		formUser.querySelectorAll(".entry_form").forEach(entry => {
			entry.addEventListener("focus", () => submit_btn.classList.replace("btn_disabled", "submit_btn"))
		});

		/*Actualiza los datos de un usuario*/
		formUser.removeEventListener("submit", createUser);
		formUser.addEventListener("submit", updateUserAPI);

		/*Cancela la actualizacion y resetea el form a su estado original*/
		cancel_btn.addEventListener("click", resetForm)

		async function updateUserAPI(e) {
			e.preventDefault();
			e.stopPropagation();

            const data = {
                idAdmin: parseInt(id),
                name: e.target.user_name.value,
                email: e.target.user_email.value,
                password: e.target.user_password.value
            }

			const response = await actualizarObjecto(baseUrl, data)

			if (await response !== null && await response !== undefined) {
				/*Restablece el formulario*/
				resetForm();
				updateTable(tableData);
			}
		}

		/*Reseteo del formulario*/
		function resetForm() {
			title_form.innerHTML = "Registro de Usuarios";
			formUser.reset();
			formUser.removeEventListener("submit", updateUserAPI)
			formUser.addEventListener("submit", createUser);
			cancel_btn.removeEventListener("click", resetForm);
			cancel_btn.style.display = "none";
			submit_btn.innerHTML = "Registrar";
			formOptionActive = false;
		}
	}

	/*Eliminar cliente*/
	async function deleteBooking(id){
		if(confirm("Seguro que desea eliminar este usuario")){
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
			const submit_btn = formUser.querySelector(".submit_btn")
			submit_btn.style.display = "none";

			var title_form = formUser.querySelector(".form_title");
			title_form !== null? title_form.innerHTML = "Reserva No. " + data.idAdmin : "";
			
			var cancel_btn = formUser.querySelector(".cancel_btn");
			cancel_btn !== null? cancel_btn.innerHTML = "Cerrar" : "";
			cancel_btn.style.display = "inline-block";

			assignValuesInputs(data.name, data.email, data.password);
			
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
				title_form.innerHTML = "Registro de Usuarios";
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
			<td class="columna-id-tabla-users column_id">${data.idAdmin}</td>
			<td class="columna-name-tabla-users">${data.name}</td>
			<td class="columna-email-tabla-users">${data.email}</td>
			<td class="columna-options-tabla-users">
				<i class="far fa-edit vista-icon icon edit_user" data-id="${data.idAdmin}"></i>
				<i class="fas fa-trash-alt eliminar_icon icon delete_user" data-id="${data.idAdmin}"></i>
				<i class="far fa-window-maximize view_icon icon view_user" data-id="${data.idAdmin}"></i>
			</td>
		</tr>
		`
	}

	/*Mantiene actualizado el numero de botones de actualizar y eliminar de cada cliente*/
	function updateUsersOptions(){
		usersEditOption = document.querySelectorAll(".edit_user");
		usersDeleteOption = document.querySelectorAll(".delete_user");
		usersViewOption = document.querySelectorAll(".view_user");
		usersEditOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : updateUser(btn.getAttribute("data-id"))));
		usersDeleteOption.forEach(btn => btn.addEventListener("click", () => deleteBooking(btn.getAttribute("data-id"))));
		usersViewOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : viewDetails(btn.getAttribute("data-id"))));
	}

	/*asign values to form inputs*/
	function assignValuesInputs(name, email, password){
		formUser.user_name.value = name;
		formUser.user_email.value = email;
        formUser.user_password.value = password
	}

}