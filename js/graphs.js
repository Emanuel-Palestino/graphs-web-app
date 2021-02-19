const btnNodo = $("#dibujar_nodo");
const btnArista = $("#dibujar_arista");
const canvas = $("#canvas");

let elemento = 0;
let aristaFlag = 0;

let x0 = y0 = x1 = y1 = 0;
let idNodo1 = idNodo2 = 0;

let nodos = [];
let aristas = [];
let listaAdyacencias = {};

let margenCanvas = canvas.offset();

// Identificar que tipo de elemento se va a crear en el lienzo
btnNodo.click(function () {
    elemento = 1;
    aristaFlag = 0;
    // clase para cambiar la vista del cursor
    $(".nodo").removeClass(["nodoarista"]);
});
btnArista.click(function () {
    elemento = 2;
    aristaFlag = 0;
    $(".boton-selected").removeClass("boton-selected");
    btnArista.addClass("boton-selected");
    // clase para cambiar la vista del cursor
    $(".nodo").addClass("nodoarista");
});

// Crear un nodo dentro del lienzo
canvas.click(function (event) {
    let cursorX = parseFloat(event.clientX - margenCanvas.left).toFixed(3);
    let cursorY = parseFloat(event.clientY - margenCanvas.top + $(document).scrollTop()).toFixed(3);
    if (elemento == 1 && !$(event.target).hasClass("nodo")) {

        if (!autonombrar) {
            // Nombrar al nodo
            let inputName = $("#nombre_nodo");
            showModal($("#modal_nombrar_nodo"), null, () => {
                inputName.focus();
            }, () => {
                inputName.val("");
                $("#modal_nombrar_nodo").off("submit");
            });

            $("#nombrar_formulario").on('submit', function (e) {
                e.preventDefault();
                let name = inputName.val();
                if (name != '') {
                    // Se crea el HTML para el nodo
                    let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                    g.setAttribute("class", "full-nodo");

                    let nodeName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    nodeName.setAttribute("x", cursorX);
                    nodeName.setAttribute("y", cursorY - 26);
                    nodeName.setAttribute("for-node", name);

                    let newNodo = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                    newNodo.setAttribute("class", "nodo");
                    newNodo.setAttribute("id", name);
                    newNodo.setAttribute("style", `cx: ${cursorX}px; cy: ${cursorY}px;`);

                    nodeName.textContent = name;
                    g.appendChild(newNodo);
                    g.appendChild(nodeName);
                    // Añadir nodo al DOM y definir sus coordenas
                    canvas.append(g);

                    // Registrar nodo en el programa
                    let nodo = {
                        id: name,
                        estado: "no visitado",
                        distancia: Infinity,
                        finalizado: 0,
                        predecesor: null,
                        aristas: []
                    }
                    nodos.push(nodo);

                    // cerrar modal
                    $("#nombrar_cancelar").trigger("click");
                    $("#nombrar_formulario").off("submit");
                }
            });
        } else {
            // Se crea el HTML para el nodo
            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            g.setAttribute("class", "full-nodo");

            let nodeName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            nodeName.setAttribute("x", cursorX);
            nodeName.setAttribute("y", cursorY - 26);
            nodeName.setAttribute("for-node", contadorNodos);

            let newNodo = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            newNodo.setAttribute("class", "nodo");
            newNodo.setAttribute("id", contadorNodos);
            newNodo.setAttribute("style", `cx: ${cursorX}px; cy: ${cursorY}px;`);

            nodeName.textContent = contadorNodos;
            g.appendChild(newNodo);
            g.appendChild(nodeName);
            // Añadir nodo al DOM y definir sus coordenas
            canvas.append(g);

            // Registrar nodo en el programa
            let nodo = {
                id: contadorNodos,
                estado: "no visitado",
                distancia: Infinity,
                finalizado: 0,
                predecesor: null,
                aristas: []
            }
            nodos.push(nodo);
            contadorNodos++;
        }
    }
});

// Click en un nodo (Sirve para mover nodo o para crear una arista)
canvas.on("mousedown", ".nodo", function () {
    // Obtener algunas propiedades del nodo
    let nodo = $(this);
    let idCurrentNodo = nodo.attr("id");
    let indexNodo = nodos.findIndex(nodo => nodo.id == idCurrentNodo);
    let nodoX = parseFloat(nodo.css("cx").slice(0, -2)).toFixed(3); // solo necesito las coordenadas, y el .css devuelve #px
    let nodoY = parseFloat(nodo.css("cy").slice(0, -2)).toFixed(3);

    if (elemento == 1) {
        // Obtener las aristas asociadas al nodo
        let currentAristas = nodos[indexNodo].aristas.map(arista => {
            let currentArista = $("#arista" + arista.id);
            let contentD = currentArista.attr("d").split(" ");
            let indexContent = [];
            let secondNode = [];
            let deg = undefined;
            // conseguir los grados de rotacion del peso (funciona en dos lineas ya que el peso solo tiene dos estados)
            if (currentArista.next().css("transform") != undefined) {
                let values = currentArista.next().css("transform").split('(')[1].split(')')[0].split(',');
                deg = (values[0] == "1") ? 0 : 180;
            }

            // identificar que coordenadas se van a modificar
            contentD.forEach((segment, i) => {
                if (segment.length > 2) {
                    let coordenadas = segment.split(",");
                    if (parseFloat(coordenadas[0]) == nodoX && parseFloat(coordenadas[1]) == nodoY) {
                        indexContent.push(i);
                    } else
                        secondNode = i;
                }
            });
            let aristaTemplate = {
                id: arista.id,
                content: contentD,
                index: indexContent,
                indexSecondNode: secondNode,
                movingRightNode: (parseFloat(contentD[secondNode].split(",")) < nodoX) ? true : false,
                degrees: deg
            };
            return aristaTemplate;
        });


        // Obtener el nombre del nodo
        let name = $("text[for-node='" + idCurrentNodo + "']");

        canvas.on("mousemove", function (event) {
            let currentX = parseFloat(event.clientX - margenCanvas.left).toFixed(3);
            let currentY = parseFloat(event.clientY - margenCanvas.top + $(document).scrollTop()).toFixed(3);
            // Mover nodo
            nodo.css({
                cx: currentX,
                cy: currentY
            });

            // Mover aristas
            if (currentAristas.length > 0) {
                currentAristas.forEach(arista => {
                    let aristaDOM = $("#arista" + arista.id);
                    if (arista.index.length < 3) {
                        arista.index.forEach(i => {
                            // se modfica el atributo 'd' del path
                            arista.content[i] = currentX + "," + currentY;
                            let otherNodeC = arista.content[arista.indexSecondNode].split(",");
                            aristaDOM.attr("d", arista.content.join(' '));
                            // actualizar el punto medio de la arista / eje de rotacion del peso
                            let c = ((parseFloat(otherNodeC[0]) + parseFloat(currentX)) / 2).toFixed(2) + "px " + ((parseFloat(otherNodeC[1]) + parseFloat(currentY)) / 2).toFixed(2) + "px";
                            aristaDOM.next().css("transform-origin", c);

                            // Mover el peso de la arista
                            if (arista.movingRightNode) {
                                if (parseFloat(currentX) < parseFloat(otherNodeC[0])) {
                                    arista.movingRightNode = false;
                                    aristaDOM.next().css("transform", (arista.degrees == 0) ? `rotate(${arista.degrees = 180}deg)` : `rotate(${arista.degrees = 0}deg)`);
                                }
                            } else {
                                if (parseFloat(currentX) > parseFloat(otherNodeC[0])) {
                                    arista.movingRightNode = true;
                                    aristaDOM.next().css("transform", (arista.degrees == 0) ? `rotate(${arista.degrees = 180}deg)` : `rotate(${arista.degrees = 0}deg)`);
                                }
                            }
                        });
                    } else {
                        aristaDOM.attr("d", `M ${currentX},${currentY} C ${currentX - 70},${currentY - 75} ${parseFloat(currentX) + 70},${currentY - 75} ${currentX},${currentY} M ${currentX},${currentY}`);
                    }
                });
            }

            // Mover nombre
            name.attr("x", currentX).attr("y", currentY - 26);
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
                let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                let newArista = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                if (idNodo1 == idNodo2) {
                    // creando un ciclo
                    newArista.setAttribute("d", `M ${x0},${y0} C ${parseFloat(x0 - 70).toFixed(3)},${parseFloat(y0 - 75).toFixed(3)} ${parseFloat(parseFloat(x0) + 70).toFixed(3)},${parseFloat(y0 - 75).toFixed(3)} ${x0},${y0} M ${x0},${y0}`);
                } else {
                    newArista.setAttribute("d", `M ${x0},${y0} L ${x1},${y1}`);
                    if (tipoGrafo == 2)
                        newArista.setAttribute("marker-end", 'url(#arrowhead)');
                }
                newArista.setAttribute("class", "arista");
                newArista.setAttribute("id", "arista" + contadorAristas);
                // Indicar de que nodo hacia que nodo va la arista
                newArista.setAttribute("fromNode", idNodo1);
                newArista.setAttribute("toNode", idNodo2);
                g.setAttribute("class", "full-edge");

                let arista = {
                    id: contadorAristas,
                    peso: null
                };


                // Preguntar por el peso de la arista
                if (ponderado) {
                    let inputWeight = $("#peso_arista");
                    showModal($("#modal_peso_arista"), null, () => {
                        inputWeight.focus();
                    }, () => {
                        inputWeight.val("");
                        $("#peso_arista_formulario").off("submit");
                    });

                    let thisx0 = parseFloat(x0),
                        thisx1 = parseFloat(x1),
                        thisy0 = parseFloat(y0),
                        thisy1 = parseFloat(y1);

                    $("#peso_arista_formulario").on("submit", function (e) {
                        e.preventDefault();
                        let weight = parseInt(inputWeight.val());
                        if (!isNaN(weight)) {
                            // Dibujar Arista
                            g.appendChild(newArista);
                            canvas.prepend(g);
                            // Dibujar peso
                            let edge = $("#arista" + contadorAristas);
                            let weightLabel = edge.next().children();
                            $("#template-textPath").children().clone().appendTo(edge.parent());
                            edge.next().children().text(weight).attr("href", "#arista" + contadorAristas);
                            // Definir coordenadas del centro de rotacion para el peso
                            let c = ((thisx0 + thisx1) / 2).toFixed(2) + "px " + ((thisy0 + thisy1) / 2).toFixed(2) + "px";
                            edge.next().css("transform-origin", c);
                            // Posicionar Peso
                            if (thisx1 < thisx0)
                                edge.next().css("transform", "rotate(180deg)");
                            else {
                                edge.next().css("transform", "rotate(0deg)");
                            }
                            // agregar peso en la Lista de Adyacencias
                            arista.peso = weight;

                            // Registar arista
                            aristas.push(arista);

                            // Actualizar LISTA ADYACENCIAS 
                            // Grafo Dirigido o Normal
                            if (idNodo1 in listaAdyacencias)
                                listaAdyacencias[idNodo1][idNodo2] = (arista.peso == null) ? 1 : arista.peso;
                            else {
                                listaAdyacencias[idNodo1] = {};
                                listaAdyacencias[idNodo1][idNodo2] = (arista.peso == null) ? 1 : arista.peso;
                            }
                            // Solo si es un grafo normal
                            if (tipoGrafo == 1) {
                                if (idNodo2 in listaAdyacencias)
                                    listaAdyacencias[idNodo2][idNodo1] = (arista.peso == null) ? 1 : arista.peso;
                                else {
                                    listaAdyacencias[idNodo2] = {};
                                    listaAdyacencias[idNodo2][idNodo1] = (arista.peso == null) ? 1 : arista.peso;
                                }
                            }

                            // Asociar a los nodos
                            indexNodo1 = nodos.findIndex(nodo => nodo.id == idNodo1);
                            indexNodo2 = nodos.findIndex(nodo => nodo.id == idNodo2);
                            if (indexNodo1 != indexNodo2)
                                nodos[indexNodo1].aristas.push(arista);
                            nodos[indexNodo2].aristas.push(arista);

                            // cerrar modal
                            $("#peso_arista_cancelar").trigger("click");
                            $("#peso_arista_formulario").off("submit");
                        }
                    });
                } else {
                    // Dibujar Arista
                    g.appendChild(newArista);
                    canvas.prepend(g);

                    // Registar arista
                    aristas.push(arista);

                    // Actualizar LISTA ADYACENCIAS 
                    // Grafo Dirigido o Normal
                    if (idNodo1 in listaAdyacencias)
                        listaAdyacencias[idNodo1][idNodo2] = (arista.peso == null) ? 1 : arista.peso;
                    else {
                        listaAdyacencias[idNodo1] = {};
                        listaAdyacencias[idNodo1][idNodo2] = (arista.peso == null) ? 1 : arista.peso;
                    }
                    // Solo si es un grafo normal
                    if (tipoGrafo == 1) {
                        if (idNodo2 in listaAdyacencias)
                            listaAdyacencias[idNodo2][idNodo1] = (arista.peso == null) ? 1 : arista.peso;
                        else {
                            listaAdyacencias[idNodo2] = {};
                            listaAdyacencias[idNodo2][idNodo1] = (arista.peso == null) ? 1 : arista.peso;
                        }
                    }

                    // Asociar a los nodos
                    indexNodo1 = nodos.findIndex(nodo => nodo.id == idNodo1);
                    indexNodo2 = nodos.findIndex(nodo => nodo.id == idNodo2);
                    if (indexNodo1 != indexNodo2)
                        nodos[indexNodo1].aristas.push(arista);
                    nodos[indexNodo2].aristas.push(arista);
                }
            }

            // reiniciar contadores de las aristas
            aristaFlag = 0;
            x0 = y0 = x1 = y1 = 0;
        }
    }
});