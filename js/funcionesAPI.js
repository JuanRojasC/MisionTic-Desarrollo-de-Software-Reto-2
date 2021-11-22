async function listarTodos(baseUrl){
    const response = await fetch(baseUrl + "all");
    const objects = await response.json();
    return await objects;
}

async function crearObjecto(baseUrl, object){
    const response = await fetch(baseUrl + "save", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(object)
    });
    const json = await response.json();
    return await json;
}

async function buscarObjeto(baseUrl, id){
    const response = await fetch(baseUrl + id);
    const object = await response.json();
    return await object;
}

async function actualizarObjecto(baseUrl, object){
    const response = await fetch(baseUrl + "update", {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(object)
    });
    const json = await response.json();
    return await json;
}

async function eliminarObjecto(baseUrl, id){
    const response = await fetch(baseUrl + id, {
        method: "DELETE"
    })
    const status = await response.status;
    return status;
}