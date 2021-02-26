let pseudocodigoBFS = `
<p>BFS(grafo G, nodo_fuente s) {</p>
<div class="bloque">
    <p>for u ∈ V[G] do {</p>
    <div class="bloque">
        <div paso="1">
            <p>estado[u] = NO_VISITADO;</p>
            <p>distancia[u] = INFINITO;</p>
            <p>padre[u] = NULL;</p>
        </div>
    </div>
    <p>}</p>
    
    <div paso="2">
        <p>estado[s] = VISITADO;</p>
        <p>distancia[s] = 0;</p>
        <p>padre[s] = NULL;</p>
    </div>
    <p>CrearCola(Q);</p>
    <p paso="3">Encolar(Q, s);</p>
    <p>while !vacía(Q) do {</p>
    <div class="bloque">
        <p paso="4">u = extraer(Q);</p>
        
        <p>for v ∈ adyacencia[u] do {</p>
        <div class="bloque">
            <p>if estado[v] == NO_VISITADO then {</p>
            <div class="bloque">
                <div paso="5">
                    <p>estado[v] = VISITADO;</p>
                    <p>distancia[v] = distancia[u] + 1;</p>
                    <p>padre[v] = u;</p>
                </div>
                
                <p paso="6">Encolar(Q, v);</p>
            </div>
            <p>}</p>
        </div>
        <p>}</p>
        
        <p paso="7">estado[u] = FINALIZADO;</p>
    </div>
    <p>}</p>
</div>
<p>}</p>`;

async function BFS(start) {
    try {
        // La inicializacion de los atributos ya ha sido realizada
        await paso(1, () => {});
    
        // Iniciamos el nodo de inicio
        let indexNode;
        await paso(2, () => {
            indexNode = nodos.findIndex(nodo => nodo.id == start);
            nodos[indexNode].estado = "visitado";
            nodos[indexNode].distancia = 0;
            // Pintar el nodo inicial
            $("#" + start).addClass("start");
        });
    
        // Se crea la cola vacia
        let Q = [];
    
        // Ingresar nodo de inicio en la cola
        await paso(3, () => {
            Q.push(nodos[indexNode]);
        });
    
        // Iniciar recorrido
        while (Q.length > 0) {
            // extrer el nodo de la cola
            let u;
            await paso(4, () => {
                u = Q.shift();
            });
    
            // Recorrer cada nodo adyacente al nodo U
            for (idNode in listaAdyacencias[u.id]) {
                // obtener el index dentro de la lista de nodos
                let index = nodos.findIndex(nodo => nodo.id == idNode);
                if (nodos[index].estado == "no visitado") {
                    // paso 5
                    await paso(5, () => {
                        nodos[index].estado = "visitado";
                        nodos[index].distancia = u.distancia + 1;
                        nodos[index].predecesor = u.id;
        
                        // Pintar nodo y camino seleccionados
                        $("#" + idNode).addClass("visited");
                        let edge = $(`.arista[fromNode="${u.id}"][toNode="${idNode}"]`)[0] || $(`.arista[fromNode="${idNode}"][toNode="${u.id}"]`)[0];
                        $(edge).addClass("path");
                    });
    
                    // paso 6
                    await paso(6, () => {
                        Q.push(nodos[index]);
                    });
                }
            }
    
            // paso 7
            await paso(7, () => {
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