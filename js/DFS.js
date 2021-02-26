let pseudocodigoDFS = `
<p>DFS(grafo G) {</p>
    <div class="bloque">
        <p>PARA CADA vértice u ∈ V[G] HACER</p>
            <div class="bloque" paso="1">
                <p>estado[u] ← NO_VISITADO</p>
                <p>padre[u] ← NULO</p>
            </div>
        <p>tiempo ← 0</p>
        <p>PARA CADA vértice u ∈ V[G] HACER</p>
            <div class="bloque">
                <p>SI estado[u] = NO_VISITADO ENTONCES</p>
                    <p class="bloque" paso="2">DFS_Visitar(u, tiempo)</p>
            </div>
    </div>
<p>}</p>
                
<p>DFS_Visitar(nodo u, int tiempo) {</p>
  <div class="bloque">
        <div paso="3">
            <p>estado[u] ← VISITADO</p>
            <p>tiempo ← tiempo + 1</p>
            <p>d[u] ← tiempo</p>
        </div>
      
        <p>PARA CADA v ∈ Vecinos[u] HACER</p>
            <div class="bloque">
                <p>SI estado[v] = NO_VISITADO ENTONCES</p>
                    <div class="bloque" paso="4">
                        <p>padre[v] ← u</p>
                        <p>DFS_Visitar(v, tiempo)</p>
                    </div>
            </div>
        <div paso="5">
            <p>estado[u] ← TERMINADO</p>
            <p>tiempo ← tiempo + 1</p>
            <p>f[u] ← tiempo</p>
        </div>
  </div>
<p>}</p>`;

async function DFS(start) {
    try {
        // La inicializacion de los atributos ya ha sido realizada
        await paso(1, () => {});
    
        let time = [0];
    
        // modificar el array para que inicie con el nodo seleccionado
        let indexStart = nodos.findIndex(nodo => nodo.id == start);
        let nodeS = nodos.find(nodo => nodo.id == start);
        nodos.splice(indexStart, 1);
        nodos.unshift(nodeS);
        // Pintar el nodo inicial
        $("#" + nodeS.id).addClass("start");
    
        // Iniciar el recorrido para cada vertice del grafo
        for(u of nodos) {
            if (u.estado == "no visitado") {
                await paso(2, async() => {
                    // paso 2
                    await DFS_Visit(u, time);
                });
            }
        }

    } catch (err) {
        console.log("Ejecucion Finalizada", err);
    }

    ejecucionFinalizada();

    // Resultados
    {
        $('#resultados table').append('<tr></tr>').append('<tr></tr>').append('<tr></tr>').append('<tr></tr>');
        let filaNodos = $("#resultados table tr:nth-child(1)");
        let filaDistancia = $("#resultados table tr:nth-child(2)");
        let filaFinalizado = $("#resultados table tr:nth-child(3)");
        let filaPredecesor = $("#resultados table tr:nth-child(4)");
        
        // Imprimir Encabezados
        filaNodos.append('<th>NODO(v)</th>');
        filaDistancia.append('<th>DISTANCIA(d)</th>');
        filaFinalizado.append('<th>FINALIZADO(f)</th>');
        filaPredecesor.append('<th>PREDECESOR(π)</th>');
        
        // Mostrar la tabla de resultados
        nodos.forEach(nodo => {
            filaNodos.append(`<td>${nodo.id}</td>`);
            filaDistancia.append(`<td>${nodo.distancia}</td>`);
            filaFinalizado.append(`<td>${nodo.finalizado}</td>`);
            filaPredecesor.append(`<td>${nodo.predecesor}</td>`);
        });
    }
}

async function DFS_Visit(node, time) {
    try {
        // paso 3
        await paso(3, () => {
            node.estado = "visitado";
            time[0]++;
            node.distancia = time[0];
        });
    
        for (idNode in listaAdyacencias[node.id]) {
            // obtener el index dentro de la lista de nodos
            let index = nodos.findIndex(nodo => nodo.id == idNode);
            if (nodos[index].estado == "no visitado") {
                // paso 4
                await paso(4, () => {
                    nodos[index].predecesor = node.id;
                });
    
                // Pintar nodo y camino seleccionados
                $("#" + idNode).addClass("visited");
                let edge = $(`.arista[fromNode="${node.id}"][toNode="${idNode}"]`)[0] || $(`.arista[fromNode="${idNode}"][toNode="${node.id}"]`)[0];
                $(edge).addClass("path");
    
                await DFS_Visit(nodos[index], time);
            }
        }

        await paso(5, () => {
            node.estado = "finalizado";
            time[0]++;
            node.finalizado = time[0];
        });
        
    } catch (err) {
        console.log("Ejecucion Finalizada", err);
    }
}