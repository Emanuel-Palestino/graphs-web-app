function DFS(start) {
    // La inicializacion de los atributos ya ha sido realizada
    // Se procede a hacer el recorrido
    let time = 0;

    // modificar el array para que inicie con el nodo seleccionado
    let indexStart = nodos.findIndex(nodo => nodo.id == start);
    let nodeS = nodos.find(nodo => nodo.id == start);
    // Pintar el nodo inicial
    $("#" + nodeS.id).addClass("start");
    nodos.splice(indexStart, 1);
    nodos.unshift(nodeS);


    // Iniciar el recorrido para cada vertice del grafo
    nodos.forEach(u => {
        if (u.estado == "no visitado")
            DFS_Visit(u, time);
    });
}

function DFS_Visit(node, time) {
    node.estado = "visitado";
    time++;
    node.distancia = time;
    for (idNode in listaAdyacencias[node.id]) {
        // obtener el index dentro de la lista de nodos
        let index = nodos.findIndex(nodo => nodo.id == idNode);
        if (nodos[index].estado == "no visitado") {
            nodos[index].predecesor = node.id;

            // Pintar nodo y camino seleccionados
            $("#" + idNode).addClass("visited");
            let edge = $(`.arista[fromNode="${node.id}"][toNode="${idNode}"]`)[0] || $(`.arista[fromNode="${idNode}"][toNode="${node.id}"]`)[0];
            $(edge).addClass("path");

            DFS_Visit(nodos[index], time);
        }
    }
    node.estado = "finalizado";
    time++;
    // node.f = time;
}