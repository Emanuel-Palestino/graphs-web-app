function DFS(start) {
    // La inicializacion de los atributos ya ha sido realizada
    // Se procede a hacer el recorrido
    let time = [0];

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

    // Mostrar la tabla de resultados
    $('#resultados table').append('<tr></tr>');
    let filaNodos = $("#resultados table tr:nth-child(1)");
    let filaDistancia = $("#resultados table tr:nth-child(2)");
    let filaFinalizado = $("#resultados table tr:nth-child(3)");
    let filaPredecesor = $("#resultados table tr:nth-child(4)");

    // Imprimir Encabezados
    filaNodos.append('<th>NODO(v)</th>');
    filaDistancia.append('<th>DISTANCIA(d)</th>');
    filaFinalizado.append('<th>FINALIZADO(f)</th>');
    filaPredecesor.append('<th>PREDECESOR(π)</th>');

    nodos.forEach(nodo => {
        filaNodos.append(`<td>${nodo.id}</td>`);
        filaDistancia.append(`<td>${nodo.distancia}</td>`);
        filaFinalizado.append(`<td>${nodo.finalizado}</td>`);
        filaPredecesor.append(`<td>${nodo.predecesor}</td>`);
    });
}

function DFS_Visit(node, time) {
    node.estado = "visitado";
    time[0]++;
    node.distancia = time[0];
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
    time[0]++;
    node.finalizado = time[0];
}