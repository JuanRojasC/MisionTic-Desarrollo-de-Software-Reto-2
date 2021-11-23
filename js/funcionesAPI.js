async function listarTodos(baseUrl){
    try{
        const response = await fetch(baseUrl + "all");
        const objects = await response.json();
        return await objects;
    } catch (error) {
        console.log("FALLO COMUNICACION CON API " + error)
    }
}

async function crearObjecto(baseUrl, object){
    try{
        const response = await fetch(baseUrl + "save", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(object)
        });
        const json = await response.json();
        return await json;
    } catch (error) {
        console.log("FALLO COMUNICACION CON API " + error)
    }
}

async function buscarObjeto(baseUrl, id){
    try{
        const response = await fetch(baseUrl + id);
        const object = await response.json();
        return await object;
    } catch (error) {
        console.log("FALLO COMUNICACION CON API " + error)
    }
}

async function actualizarObjecto(baseUrl, object){
    try{
        const response = await fetch(baseUrl + "update", {
            method: "PUT",
            headers: {
            "Content-type": "application/json"
            },
            body: JSON.stringify(object)
        });
        const json = await response.json();
        return await json;
    } catch (error) {
        console.log("FALLO COMUNICACION CON API " + error)
    }
}

async function eliminarObjecto(baseUrl, id){
    try{
        const response = await fetch(baseUrl + id, {
            method: "DELETE"
        })
        return await response.status;
    } catch (error) {
        console.log("FALLO COMUNICACION CON API " + error)
    }
}