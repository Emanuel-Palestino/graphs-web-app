const btnNodo = $("#nodo");
const btnArista = $("#arista");
const canvas = $("#canvas");
let tipoGrafo = 1;

var elemento = 0;
var contadorNodo = -1;
var contadorAristas = -1;
var aristaFlag = 0;

var x0 = y0 = x1 = y1 = 0;
var idNodo1 = idNodo2 = 0;

var nodos = [];
var aristas = [];
var listaAdyacencias = {};


btnNodo.click(function () {
    elemento = 1;
})

btnArista.click(function () {
    elemento = 2;
})

// Crear un nodo dentro del lienzo
canvas.click(function (event) {
    if (elemento == 1 && $(event.target).attr("class") != "nodo") {
        contadorNodo++;

        let newNodo = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        newNodo.setAttribute("class", "nodo");
        newNodo.setAttribute("id", "nodo" + contadorNodo);

        canvas[0].appendChild(newNodo);
        currentNodo = $("#nodo" + contadorNodo);
        currentNodo.css({ cx: event.clientX, "cy": event.clientY - 130 });

        // Nombrar
        

        // Registrar nodo
        let nodo = {
            id: contadorNodo,
            grado: 0,
            color: "white",
            distancia: 0,
            predecesor: null,
            aristas: []
        }
        nodos.push(nodo);
    }
});

// Click en un nodo
canvas.on("mousedown", ".nodo", function () {
    let nodo = $(this);
    let idCurrentNodo = nodo.attr("id").slice(4);
    let nodoX = nodo.css("cx").slice(0, -2);
    let nodoY = nodo.css("cy").slice(0, -2);

    if (elemento == 1) {
        // Aristas asociadas al nodo
        let currentAristas = nodos[idCurrentNodo].aristas.map(id => {
            let currentArista = $("#arista" + id);
            let x, y;
            if (currentArista.attr("x1") == nodoX && currentArista.attr("y1") == nodoY) {
                x = "x1";
                y = "y1";
            } else {
                x = "x2";
                y = "y2";
            }
            let aristaTemplate = {
                id: id,
                x: x,
                y: y
            };
            return aristaTemplate;
        });

        canvas.on("mousemove", function (event) {
            // Mover nodo
            nodo.css({ cx: event.clientX, cy: event.clientY - 130 });
            // Actualizar informacion

            // Mover aristas
            if (currentAristas.length > 0) {
                currentAristas.forEach(arista => {
                    let aristaDOM = $("#arista" + arista.id);
                    if (!aristaDOM.is("path")) {
                        aristaDOM.attr(arista.x, event.clientX);
                        aristaDOM.attr(arista.y, event.clientY - 130);
                    } else {
                        aristaDOM.attr("d", `M ${event.clientX} ${event.clientY - 130} C ${event.clientX - 50} ${event.clientY - 60 - 130}  ${event.clientX + 50} ${event.clientY - 60 - 130} ${event.clientX} ${event.clientY - 130} M ${event.clientX} ${event.clientY - 130} z`);
                    }
                });
            }
        });

        // Dejar nodo en el lugar
        canvas.on("mouseup", function () {
            canvas.off("mousemove");
            canvas.off("mouseup");
        });

    } else if (elemento == 2) {

        // Crear arista
        aristaFlag++;

        if (aristaFlag == 1) {
            // Primer nodo
            x0 = parseInt(nodo.css("cx").slice(0, -2));
            y0 = parseInt(nodo.css("cy").slice(0, -2));
            idNodo1 = nodo.attr("id").slice(4);
        } else {
            contadorAristas++;
            // Segundo nodo
            x1 = parseInt(nodo.css("cx").slice(0, -2));
            y1 = parseInt(nodo.css("cy").slice(0, -2));
            idNodo2 = nodo.attr("id").slice(4);

            if (listaAdyacencias[idNodo1] == undefined || (listaAdyacencias[idNodo1] != undefined && listaAdyacencias[idNodo1][idNodo2] == undefined)) {
                // Crear Arista
                let newArista;
                if (idNodo1 == idNodo2) {
                    newArista = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    newArista.setAttribute("d", `M ${x0} ${y0} C ${x0 - 50} ${y0 - 60}  ${x0 + 50} ${y0 - 60} ${x0} ${y0} M ${x0} ${y0} z`);
                } else {
                    newArista = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                    newArista.setAttribute("x1", x0);
                    newArista.setAttribute("y1", y0);
                    newArista.setAttribute("x2", x1);
                    newArista.setAttribute("y2", y1);
                }
                newArista.setAttribute("class", "arista");
                newArista.setAttribute("id", "arista" + contadorAristas);

                // Dibujar Arista
                canvas[0].prepend(newArista);
                // Registar arista
                let arista = {
                    id: contadorAristas,
                    tipo: 1,
                    peso: null
                };
                aristas.push(arista);

                // Actualizar lista Adyacencias 
    
                // Grafo Normal
                if (idNodo1 in listaAdyacencias)
                    listaAdyacencias[idNodo1][idNodo2] = 1;
                else {
                    listaAdyacencias[idNodo1] = {};
                    listaAdyacencias[idNodo1][idNodo2] = 1;
                }
                if (idNodo2 in listaAdyacencias)
                    listaAdyacencias[idNodo2][idNodo1] = 1;
                else {
                    listaAdyacencias[idNodo2] = {};
                    listaAdyacencias[idNodo2][idNodo1] = 1;
                }
    
                // Asociar a los nodos
                idNodo1 = nodos.findIndex(nodo => nodo.id == idNodo1);
                idNodo2 = nodos.findIndex(nodo => nodo.id == idNodo2);
    
                nodos[idNodo1].aristas.push(contadorAristas);
                nodos[idNodo2].aristas.push(contadorAristas);
            }


            // reiniciar
            aristaFlag = 0;
            x0 = y0 = x1 = y1 = 0;
        }
    }
});
