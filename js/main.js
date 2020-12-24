$('.t-modal').hide();

const btnNodo = $("#nodo");
const btnArista = $("#arista");
const btnDelete = $("#delete");
const canvas = $("#canvas");
const btnRestart = $("#restart");
let tipoGrafo = 1;

var elemento = 0;
var contadorAristas = -1;
var aristaFlag = 0;

var x0 = y0 = x1 = y1 = 0;
var idNodo1 = idNodo2 = 0;

var nodos = [];
var aristas = [];
var listaAdyacencias = {};

let margenCanvas = canvas.offset();

// Identificar que tipo de elemento se va a crear en el lienzo
btnNodo.click(function () {
    elemento = 1;
    aristaFlag = 0;
    // clase para cambiar la vista del cursor
    $(".nodo").removeClass("nodoarista");
});
btnArista.click(function () {
    elemento = 2;
    aristaFlag = 0;
    // clase para cambiar la vista del cursor
    $(".nodo").addClass("nodoarista");
});

// Detectar que tipo de grafo se va a dibujar
$("#grafo").change(function () {
    tipoGrafo = parseInt($(this).val());
});

// Crear un nodo dentro del lienzo
canvas.click(function (event) {
    let cursorX = event.clientX;
    let cursorY = event.clientY;
    if (elemento == 1 && $(event.target).attr("class") != "nodo") {
        // Nombrar al nodo
        let inputName = $("#nodoName");
        inputName[0].focus();
        showModal($("#rename_modal"), null, () => {
            inputName.val("");
        });
        
        inputName.focus();
        
        $("#rename_form").on('submit', function (e) {
            e.preventDefault();
            let name = inputName.val();
            if (name != '') {
                // Se crea el HTML para el nodo
                let newNodo = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                newNodo.setAttribute("class", "nodo");
                newNodo.setAttribute("id", name);

                // Añadir nodo al DOM y definir sus coordenas
                canvas[0].appendChild(newNodo);
                currentNodo = $("#" + name);
                currentNodo.css({ cx: cursorX - margenCanvas.left, cy: cursorY - margenCanvas.top });

                // Registrar nodo en el programa
                let nodo = {
                    id: name,
                    color: "white",
                    distancia: 0,
                    predecesor: null,
                    aristas: []
                }
                nodos.push(nodo);
            }
            // cerrar modal
            $("#rename_cancel").trigger("click");
            $("#rename_form").off("submit");
        });
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
            let x = "x2", y = "y2";
            if (parseFloat(currentArista.attr("x1")).toFixed(3) == nodoX && parseFloat(currentArista.attr("y1")).toFixed(3) == nodoY) {
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
            let currentX = parseFloat(event.clientX - margenCanvas.left).toFixed(3);
            let currentY = parseFloat(event.clientY - margenCanvas.top).toFixed(3);
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
                indexNodo1 = nodos.findIndex(nodo => nodo.id == idNodo1);
                indexNodo2 = nodos.findIndex(nodo => nodo.id == idNodo2);
                if (indexNodo1 != indexNodo2)
                    nodos[indexNodo1].aristas.push(arista);
                nodos[indexNodo2].aristas.push(arista);
            }

            // reiniciar contadores de las aristas
            aristaFlag = 0;
            x0 = y0 = x1 = y1 = 0;
        }
    }
});

// Reiniciar Dibujo de Grafo
btnRestart.click(function () {
    window.location.reload();
});


// MODAL
function showModal(modal, title = null, closing = null) {
    if (title)
        modal.find('.t-modal-h p').html(title);
    modal.css('opacity', '1').fadeIn(400);
    modal.children().eq(0).css('margin-top', '0');
    let body = $('body');
    let header = $('header');
    if (body.height() > $(window).height() && screen.width > 1024) {
        body.css('padding-right', '17px');
        header.css('padding-right', '27px');
    }
    body.addClass('no-scroll');

    // Close Modal
    modal.on('click', '.t-modal-h button , .t-modal-f a:last-child()', function () {
        modal.children().removeAttr('style');
        modal.fadeOut(400);
        body.removeClass('no-scroll').removeAttr('style');
        header.removeAttr('style');
        if (closing)
            closing();
        modal.off('click');
    });
}