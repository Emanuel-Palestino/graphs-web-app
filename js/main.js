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

// Identificar que tipo de elemento se va a crear en el lienzo
btnNodo.click(function () {
    elemento = 1;
    aristaFlag = 0;
});
btnArista.click(function () {
    elemento = 2;
    aristaFlag = 0;
});

// Detectar que tipo de grafo se va a dibujar
$("#grafo").change(function() {
    tipoGrafo = parseInt($(this).val());
});

// Crear un nodo dentro del lienzo
canvas.click(function (event) {
    if (elemento == 1 && $(event.target).attr("class") != "nodo") {
        contadorNodo++;

        // Se crea el HTML para el nodo
        let newNodo = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        newNodo.setAttribute("class", "nodo");

        // Nombrar al nodo

        newNodo.setAttribute("id", "nodo" + contadorNodo);

        // Añadir nodo al DOM y definir sus coordenas
        canvas[0].appendChild(newNodo);
        currentNodo = $("#nodo" + contadorNodo);
        currentNodo.css({ cx: event.clientX, "cy": event.clientY - 130 });

        // Registrar nodo en el programa
        let nodo = {
            id: contadorNodo,
            color: "white",
            distancia: 0,
            predecesor: null,
            aristas: []
        }
        nodos.push(nodo);
    }
});

// Click en un nodo (Sirve para mover nodo o para crear una arista)
canvas.on("mousedown", ".nodo", function () {
    // Obtener algunas propiedades del nodo
    let nodo = $(this);
    let idCurrentNodo = nodo.attr("id").slice(4); // slice porque por ahora todos se llaman nodo#
    let nodoX = parseInt(nodo.css("cx").slice(0, -2)); // solo necesito las coordenadas, y el .css devuelve #px
    let nodoY = parseInt(nodo.css("cy").slice(0, -2));

    if (elemento == 1) {
        // Obtener las aristas asociadas al nodo
        // tengo antes que encontrar el index del nodo dentro de mi lista de nodos
        let currentAristas = nodos[idCurrentNodo].aristas.map(arista => {
            let currentArista = $("#arista" + arista.id);
            let x = "x2", y = "y2";
            if (currentArista.attr("x1") == nodoX && currentArista.attr("y1") == nodoY) {
                x = "x1";
                y = "y1";
            }
            let aristaTemplate = {
                id: arista.id,
                x: x,
                y: y
            };
            return aristaTemplate;
        });

        canvas.on("mousemove", function (event) {
            let currentX = event.clientX;
            let currentY = event.clientY - 130;
            // Mover nodo
            nodo.css({
                cx: currentX,
                cy: currentY
            });

            // Mover aristas
            if (currentAristas.length > 0) {
                currentAristas.forEach(arista => {
                    let aristaDOM = $("#arista" + arista.id);
                    if (!aristaDOM.is("path")) {
                        aristaDOM.attr(arista.x, currentX);
                        aristaDOM.attr(arista.y, currentY);
                    } else
                        aristaDOM.attr("d", `M ${currentX} ${currentY} C ${currentX - 50} ${currentY - 60}  ${currentX + 50} ${currentY - 60} ${currentX} ${currentY} M ${currentX} ${currentY} Z`);
                });
            }
        });

        // Dejar nodo en el lugar cuando se suelte el mouse
        canvas.on("mouseup", function () {
            canvas.off("mousemove");
            canvas.off("mouseup");
        });

    } else if (elemento == 2) {
        // CREAR UNA ARISTA
        aristaFlag++;

        if (aristaFlag == 1) {
            // Primer nodo
            x0 = nodoX;
            y0 = nodoY;
            idNodo1 = idCurrentNodo;
        } else {
            // Segundo nodo
            x1 = nodoX;
            y1 = nodoY;
            idNodo2 = idCurrentNodo;

            // si aun no se ha creado una arista en el nodo, o si no se esta repitiendo la arista
            if (listaAdyacencias[idNodo1] == undefined || (listaAdyacencias[idNodo1] != undefined && listaAdyacencias[idNodo1][idNodo2] == undefined)) {
                // Crear Arista
                contadorAristas++;
                let newArista;
                // creando un ciclo
                if (idNodo1 == idNodo2) {
                    newArista = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    newArista.setAttribute("d", `M ${x0} ${y0} C ${x0 - 50} ${y0 - 60}  ${x0 + 50} ${y0 - 60} ${x0} ${y0} Z`);
                } else {
                    newArista = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                    newArista.setAttribute("x1", x0);
                    newArista.setAttribute("y1", y0);
                    newArista.setAttribute("x2", x1);
                    newArista.setAttribute("y2", y1);
                    if (tipoGrafo == 2)
                        newArista.setAttribute("marker-end", 'url(#arrowhead)');
                }
                newArista.setAttribute("class", "arista");
                newArista.setAttribute("id", "arista" + contadorAristas);

                // Dibujar Arista
                canvas[0].prepend(newArista);
                // Registar arista
                let arista = {
                    id: contadorAristas,
                    peso: null
                };
                
                // Preguntar por el peso de la arista
                
                aristas.push(arista);
                
                // Actualizar LISTA ADYACENCIAS 
                // Grafo Dirigido o Normal
                if (idNodo1 in listaAdyacencias)
                    listaAdyacencias[idNodo1][idNodo2] = 1;
                else {
                    listaAdyacencias[idNodo1] = {};
                    listaAdyacencias[idNodo1][idNodo2] = 1;
                }
                // Solo si es un grafo normal
                if (tipoGrafo == 1) {
                    if (idNodo2 in listaAdyacencias)
                        listaAdyacencias[idNodo2][idNodo1] = 1;
                    else {
                        listaAdyacencias[idNodo2] = {};
                        listaAdyacencias[idNodo2][idNodo1] = 1;
                    }
                }
    
                // Asociar a los nodos
                idNodo1 = nodos.findIndex(nodo => nodo.id == idNodo1);
                idNodo2 = nodos.findIndex(nodo => nodo.id == idNodo2);
                if (idNodo1 != idNodo2)
                    nodos[idNodo1].aristas.push(arista);
                nodos[idNodo2].aristas.push(arista);
            }

            // reiniciar contadores de las aristas
            aristaFlag = 0;
            x0 = y0 = x1 = y1 = 0;
        }
    }
});
