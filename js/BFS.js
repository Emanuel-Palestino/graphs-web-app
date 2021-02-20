async function BFS(start) {
    try {
        // La inicializacion de los atributos ya ha sido realizada
        await paso(() => {
            console.log("Paso 1");
        });
    
        // Iniciamos el nodo de inicio, paso 2
        let indexNode;
        await paso(() => {
            indexNode = nodos.findIndex(nodo => nodo.id == start);
            nodos[indexNode].estado = "visitado";
            nodos[indexNode].distancia = 0;
            // Pintar el nodo inicial
            $("#" + start).addClass("start");
        });
    
        // Se crea la cola vacia
        let Q = [];
    
        // Ingresar nodo de inicio en la cola, paso 3
        await paso(() => {
            Q.push(nodos[indexNode]);
        });
    
        // Iniciar recorrido
        while (Q.length > 0) {
            // extrer el nodo de la cola, paso 4
            let u;
            await paso(() => {
                u = Q.shift();
            });
    
            // Recorrer cada nodo adyacente al nodo U
            for (idNode in listaAdyacencias[u.id]) {
                // obtener el index dentro de la lista de nodos
                let index = nodos.findIndex(nodo => nodo.id == idNode);
                if (nodos[index].estado == "no visitado") {
                    // paso 5
                    await paso(() => {
                        nodos[index].estado = "visitado";
                        nodos[index].distancia = u.distancia + 1;
                        nodos[index].predecesor = u.id;
        
                        // Pintar nodo y camino seleccionados
                        $("#" + idNode).addClass("visited");
                        let edge = $(`.arista[fromNode="${u.id}"][toNode="${idNode}"]`)[0] || $(`.arista[fromNode="${idNode}"][toNode="${u.id}"]`)[0];
                        $(edge).addClass("path");
                    });
    
                    // paso 6
                    await paso(() => {
                        Q.push(nodos[index]);
                    });
                }
            }
    
            // paso 7
            await paso(() => {
                u.estado = "finalizado";
            });
        }
    
        ejecucionFinalizada();
    
        // Mostrar la tabla de resultados
        $('#resultados table').append('<tr></tr>').append('<tr></tr>').append('<tr></tr>');
        let filaNodos = $("#resultados table tr:nth-child(1)");
        let filaDistancia = $("#resultados table tr:nth-child(2)");
        let filaPredecesor = $("#resultados table tr:nth-child(3)");
    
        // Imprimir Encabezados
        filaNodos.append('<th>NODO(v)</th>');
        filaDistancia.append('<th>DISTANCIA(d)</th>');
        filaPredecesor.append('<th>PREDECESOR(π)</th>');
    
        nodos.forEach(nodo => {
            filaNodos.append(`<td>${nodo.id}</td>`);
            filaDistancia.append(`<td>${nodo.distancia}</td>`);
            filaPredecesor.append(`<td>${nodo.predecesor}</td>`);
        });

    } catch (err) {
        console.log("Ejecucion Finalizada");
    }
}