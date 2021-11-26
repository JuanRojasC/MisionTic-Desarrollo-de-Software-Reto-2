const baseUrl = 'http://132.226.254.141:8080//api/Category/'

window.onload = async function(){

	const tableData = document.querySelector(".table_body")
	const formCategories = document.querySelector(".formulario_categorias");
	var categoriesEditOption = [];
	var categoriessDeleteOption = [];
	var categoriesViewOption = [];
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
        updateCategoriesOptions();
	}

	/*Crea un nueva categoria*/
	async function createCategory(e){
		e.preventDefault();
		e.stopPropagation();

		const data = {
			name: e.target.category_name.value,
			description: e.target.category_description.value
		}

		const response = await crearObjecto(baseUrl, data);

		if(await response != null){
			e.target.reset();
			document.querySelector(".without_results").style.display = "none";
			tableData.innerHTML += formatRowTable(await response);
			updateCategoriesOptions();
		}

	}
	/*Listener para crear una nueva categoria*/
	formCategories.addEventListener("submit", createCategory)

	/*Agrega los datos de la categoria al formulario para poder ser modificados*/
	async function updateCategory(id){
		formOptionActive = true;
		const data = await buscarObjeto(baseUrl, id);
		assignValuesInputs(await data.name, await data.description);
		var submit_btn = formCategories.querySelector(".submit_btn");
		var cancel_btn = formCategories.querySelector(".cancel_btn");
		var title_form = formCategories.querySelector(".form_title");
		if(submit_btn){
			submit_btn.innerHTML = "Actualizar";
			submit_btn.classList.replace("submit_btn", "btn_disabled");
			cancel_btn.style.display = "inline-block";
		}
		if(title_form){
			title_form.innerHTML = "Actualizar Categoria"
		}
		formCategories.querySelectorAll(".entry_form").forEach(entry => {
			entry.addEventListener("focus", () => submit_btn.classList.replace("btn_disabled", "submit_btn"))
		});
		
		/*Actualiza los datos de una categoria*/
		formCategories.removeEventListener("submit", createCategory);
		formCategories.addEventListener("submit", updateCategoryAPI);

		/*Cancela la actualizacion y resetea el form a su estado original*/
		cancel_btn.addEventListener("click", resetForm)

		async function updateCategoryAPI(e){
			e.preventDefault();
			e.stopPropagation();

			const data = {
				id: parseInt(id),
                name: e.target.category_name.value,
                description: e.target.category_description.value
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
			title_form.innerHTML = "Registro de Categorias";
			formCategories.reset();
			formCategories.removeEventListener("submit", updateCategoryAPI)
			formCategories.addEventListener("submit", createCategory);
			cancel_btn.removeEventListener("click", resetForm);
			cancel_btn.style.display = "none";
			submit_btn.innerHTML = "Registrar";
			formOptionActive = false;
		}
	}

	/*Eliminar categoria*/
	async function deleteCategory(id){
		if(confirm("Seguro que desea eliminar esta categoria")){
			const response = await eliminarObjecto(baseUrl, id);
			if(await response === 204){
				updateTable(tableData);
			}
		}
	}

	/*Vista detalle de la categoria*/
	async function viewDetails(id){
		formOptionActive = true;
		const data = await buscarObjeto(baseUrl, id);
		if(data != null){
			const submit_btn = formCategories.querySelector(".submit_btn")
			submit_btn.style.display = "none";

			var title_form = formCategories.querySelector(".form_title");
			title_form !== null? title_form.innerHTML = "Categoria" : "";
			
			var cancel_btn = formCategories.querySelector(".cancel_btn");
			cancel_btn !== null? cancel_btn.innerHTML = "Cerrar" : "";
			cancel_btn.style.display = "inline-block";

			assignValuesInputs(data.name, data.description);
			
			const fieldForms = document.querySelectorAll(".field_form");
			fieldForms.forEach((field, index) => {
                if(index === 0){
                    field.classList.add("field_form_view");
                    field.querySelector("input").classList.replace("input_form", "form_data_view");
                }else if (index === 1){
                    field.classList.add("field_form_view_text_area");
                }
			})

			cancel_btn.addEventListener("click", resetForm);

			/*Reseteo del formulario*/
			function resetForm(){
				title_form.innerHTML = "Registro de Categorias";
				assignValuesInputs("", "");
                fieldForms.forEach((field, index) => {
                    if(index === 0){
                        field.classList.remove("field_form_view");
                        field.querySelector("input").classList.replace("form_data_view", "input_form");
                    }else if (index === 1){
                        field.classList.remove("field_form_view_text_area");
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
			<td class="columna-id-tabla-categorias column_id">${data.id}</td>
			<td class="columna-name-tabla-categorias">${data.name}</td>
			<td class="columna-description-tabla-categorias">${data.description}</td>
			<td class="columna-options-tabla-categorias">
				<i class="far fa-edit vista-icon icon edit_category" data-id="${data.id}"></i>
				<i class="fas fa-trash-alt eliminar_icon icon delete_category" data-id="${data.id}"></i>
				<i class="far fa-window-maximize view_icon icon view_category" data-id="${data.id}"></i>
			</td>
		</tr>
		`
	}

	/*Mantiene actualizado el numero de botones de actualizar y eliminar de cada categoria*/
	function updateCategoriesOptions(){
		categoriesEditOption = document.querySelectorAll(".edit_category");
		categoriessDeleteOption = document.querySelectorAll(".delete_category");
		categoriesViewOption = document.querySelectorAll(".view_category");
		categoriesEditOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : updateCategory(btn.getAttribute("data-id"))));
		categoriessDeleteOption.forEach(btn => btn.addEventListener("click", () => deleteCategory(btn.getAttribute("data-id"))));
		categoriesViewOption.forEach(btn => btn.addEventListener("click", () => formOptionActive? "" : viewDetails(btn.getAttribute("data-id"))));
	}

	/*asign values to form inputs*/
	function assignValuesInputs(name, description){
        formCategories.category_name.value = name;
        formCategories.category_description.value = description;
	}

}