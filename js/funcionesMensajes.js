const baseUrl = 'http://150.230.92.110:8080//api/Message/'

window.onload = async function() {

    const tableData = document.querySelector(".table_body")
    const formMessage = document.querySelector(".formulario_messages");
    const selectClients = document.querySelector("#message_client");
    const selectPartyrooms = document.querySelector("#message_partyroom");
    var messageEditOptions = [];
    var messageDeleteOptions = [];
    var messageViewOptions = [];
    var formOptionActive = false;

    updateTable(tableData)

    /*Actualizar la tabla de registro*/
    async function updateTable(table) {
        const data = await listarTodos(baseUrl);
        if (Symbol.iterator in Object(data) && data.length > 0) {
            document.querySelector(".without_results").style.display = "none";
            table.innerHTML = "";
            for (var obj of await data) {
                table.innerHTML += formatRowTable(obj);
            }
        } else {
            table.innerHTML = ""
            document.querySelector(".without_results").style.display = "block";
        }
        updateMessageOptions();
        updateSelectClients();
        updateSelectPartyrooms();
    }

    /*Actualizar las opciones del select de mensajes*/
    async function updateSelectClients() {
        const options = await listarTodos('http://150.230.92.110:8080//api/Client/');
        if (Symbol.iterator in Object(options) && options.length > 0) {
            options.forEach(option => {
                selectClients.innerHTML += `<option value="${option.idClient}">${option.name}</option>`
            })
        }
    }

    /*Actualizar las opciones del select de salones*/
    async function updateSelectPartyrooms() {
        const options = await listarTodos('http://150.230.92.110:8080/api/Partyroom/');
        if (Symbol.iterator in Object(options) && options.length > 0) {
            options.forEach(option => {
                selectPartyrooms.innerHTML += `<option value="${option.id}">${option.name}</option>`
            })
        }
    }

    /*Crea un nuevo salon*/
    async function createMessage(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            client: {
                idClient: parseInt(e.target.message_client.value)
            },
            partyroom: {
                id: parseInt(e.target.message_partyroom.value)
            },
            messageText: e.target.message_message.value
        }

        const response = await crearObjecto(baseUrl, data);

        if (await response !== null && await response !== undefined) {
            document.querySelector(".without_results").style.display = "none";
            response.client.name = e.target.message_client.options[e.target.message_client.selectedIndex].text
            response.partyroom.name = e.target.message_partyroom.options[e.target.message_partyroom.selectedIndex].text
            tableData.innerHTML += formatRowTable(response);
            e.target.reset()
            updateMessageOptions();
        }

    }
    /*Listener para crear un nuevo usuario*/
    formMessage.addEventListener("submit", createMessage)

    /*Agrega los datos del usuario al formulario para poder ser modificados*/
    async function updateMessage(id) {
        formOptionActive = true;
        const data = await buscarObjeto(baseUrl, id);
        assignValuesInputs(await data.client, await data.partyroom, await data.messageText);
        var submit_btn = formMessage.querySelector(".submit_btn");
        var cancel_btn = formMessage.querySelector(".cancel_btn");
        var title_form = formMessage.querySelector(".form_title");
        if (submit_btn) {
            submit_btn.innerHTML = "Actualizar";
            submit_btn.classList.replace("submit_btn", "btn_disabled");
            cancel_btn.style.display = "inline-block";
        }
        if (title_form) {
            title_form.innerHTML = "Actualizar Mensaje"
        }
        formMessage.querySelectorAll(".entry_form").forEach(entry => {
            entry.addEventListener("focus", () => submit_btn.classList.replace("btn_disabled", "submit_btn"))
        });

        /*Actualiza los datos de un usuario*/
        formMessage.removeEventListener("submit", createMessage);
        formMessage.addEventListener("submit", updateMessageAPI);

        /*Cancela la actualizacion y resetea el form a su estado original*/
        cancel_btn.addEventListener("click", resetForm)

        async function updateMessageAPI(e) {
            e.preventDefault();
            e.stopPropagation();

            const data = {
                idMessage: parseInt(id),
                client: {
                    idClient: parseInt(e.target.message_client.value)
                },
                partyroom: {
                    id: parseInt(e.target.message_partyroom.value)
                },
                messageText: e.target.message_message.value
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
            title_form.innerHTML = "Registro de Salones";
            formMessage.reset();
            formMessage.removeEventListener("submit", updateMessageAPI)
            formMessage.addEventListener("submit", createMessage);
            cancel_btn.removeEventListener("click", resetForm);
            cancel_btn.style.display = "none";
            submit_btn.innerHTML = "Registrar";
            formOptionActive = false;
        }
    }

    /*Eliminar mensaje*/
    async function deletePartyroom(id) {
        if (confirm("Seguro que desea eliminar este mensaje")) {
            const response = await eliminarObjecto(baseUrl, id);
            if (await response === 204) {
                updateTable(tableData);
            }
        }
    }

    /*Vista detalle del mensaje*/
    async function viewDetails(id) {
        formOptionActive = true;
        const data = await buscarObjeto(baseUrl, id);
        if (data != null) {
            const submit_btn = formMessage.querySelector(".submit_btn")
            submit_btn.style.display = "none";

            var title_form = formMessage.querySelector(".form_title");
            title_form !== null ? title_form.innerHTML = "Detalles del Mensaje" : "";

            var cancel_btn = formMessage.querySelector(".cancel_btn");
            cancel_btn !== null ? cancel_btn.innerHTML = "Cerrar" : "";
            cancel_btn.style.display = "inline-block";

            assignValuesInputs(data.client, data.partyroom, data.messageText);

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
            function resetForm() {
                title_form.innerHTML = "Registro de Mensajes";
                assignValuesInputs("", "", "");
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
    function formatRowTable(data) {
        return `
		<tr>
			<td class="columna-id-tabla-partyrooms column_id">${data.idMessage}</td>
			<td class="columna-client-tabla-partyrooms">${data.client.name}</td>
			<td class="columna-partyroom-tabla-partyrooms">${data.partyroom.name}</td>
			<td class="columna-message-tabla-partyrooms">${data.messageText}</td>
			<td class="columna-options-tabla-partyrooms">
				<i class="far fa-edit vista-icon icon edit_partyroom" data-id="${data.idMessage}"></i>
				<i class="fas fa-trash-alt eliminar_icon icon delete_partyroom" data-id="${data.idMessage}"></i>
				<i class="far fa-window-maximize view_icon icon view_partyroom" data-id="${data.idMessage}"></i>
			</td>
		</tr>
		`
    }

    /*Mantiene actualizado el numero de botones de actualizar y eliminar de cada mensaje*/
    function updateMessageOptions() {
        messageEditOptions = document.querySelectorAll(".edit_partyroom");
        messageDeleteOptions = document.querySelectorAll(".delete_partyroom");
        messageViewOptions = document.querySelectorAll(".view_partyroom");
        messageEditOptions.forEach(btn => btn.addEventListener("click", () => formOptionActive ? "" : updateMessage(btn.getAttribute("data-id"))));
        messageDeleteOptions.forEach(btn => btn.addEventListener("click", () => deletePartyroom(btn.getAttribute("data-id"))));
        messageViewOptions.forEach(btn => btn.addEventListener("click", () => formOptionActive ? "" : viewDetails(btn.getAttribute("data-id"))));
    }

    /*asign values to form inputs*/
    function assignValuesInputs(client, partyroom, message) {
        formMessage.message_client.value = client.idClient;
        formMessage.message_partyroom.value = partyroom.id;
        formMessage.message_message.value = message;
        formMessage.message_client_input.value = client.name;
        formMessage.message_partyroom_input.value = partyroom.name;
    }

}