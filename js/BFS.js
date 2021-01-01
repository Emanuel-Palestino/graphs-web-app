function BFS(start) {
    // La inicializacion de los atributos ya ha sido realizada
    // Se procede a hacer el recorrido
    let indexNode = nodos.findIndex(nodo => nodo.id == start);
    // Pintar el nodo inicial
    $("#" + start).addClass("start");

    // Iniciamos el nodo de inicio
    nodos[indexNode].estado = "visitado";
    nodos[indexNode].distancia = 0;

    // Se crea la cola vacia
    let Q = [];
    // Ingresar nodo de inicio en la cola
    Q.push(nodos[indexNode]);

    // Iniciar recorrido
    while (Q.length > 0) {
        // extrer el nodo de la cola
        let u = Q.pop();
        // Recorrer cada nodo adyacente al nodo U
        for (idNode in listaAdyacencias[u.id]) {
            // obtener el index dentro de la lista de nodos
            let index = nodos.findIndex(nodo => nodo.id == idNode);
            if (nodos[index].estado == "no visitado") {
                nodos[index].estado = "visitado";
                nodos[index].distancia = u.distancia + 1;
                nodos[index].predecesor = u.id;

                // Pintar nodo y camino seleccionados
                $("#" + idNode).addClass("visited");
                let edge = $(`.arista[fromNode="${u.id}"][toNode="${idNode}"]`)[0] || $(`.arista[fromNode="${idNode}"][toNode="${u.id}"]`)[0];
                $(edge).addClass("path");

                Q.push(nodos[index]);
            }
        }
        u.estado = "finalizado";
    }
}