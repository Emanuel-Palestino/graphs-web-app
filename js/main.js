$('.modal').hide();

const btnEjecutar = $("#ejecutar_algoritmo");
const btnLimpiarGrafo = $("#limpiar_grafo");

let tipoGrafo = 1;
let ponderado = false;
let autonombrar = false;
let tiempoPaso = 500;

let algoritmo = 1;
let contadorAristas = -1;
let contadorNodos = 1;
let pausa = false;
let detener = false;

// MODAL
function showModal(modal, title = null, showed = null, closing = null) {
    // Modificar el titulo si se especifica
    if (title)
        modal.find('.modal-header p').html(title);

    // Mostrar el modal
    modal.css('opacity', '1').fadeIn(400);
    modal.children().eq(0).css('margin-top', '0');

    // Modificar el cuerpo de la pagina de ser necesario
    let body = $('body');
    if (body.height() > $(window).height() && screen.width > 1024) {
        body.css('padding-right', '17px');
    }
    body.addClass('no-scroll');

    // Hacer algo despues de mostrar el modal
    if (showed) {
        setTimeout(function () {
            showed();
        }, 100);
    }

    // Cerrar modal
    modal.on('click', '.modal-header button , .modal-footer .cerrar-modal', function () {
        modal.children().removeAttr('style');
        modal.fadeOut(400);
        body.removeClass('no-scroll').removeAttr('style');

        // hacer algo despues de cerrar el modal
        if (closing)
            closing();

        modal.off('click');
    });
}

// BOTONES SELECCIONADOS
$('.boton-menu').click(function () {
    $('.boton-menu').removeClass('activo');
    $(this).addClass('activo');
});

// DESPLEGAR MENU DE OPCIONES
$('#opciones').click(function () {
    $('#opciones_menu').slideToggle(200, function () {
        if ($('#opciones_menu').attr('style') == 'display: none;')
            $('#opciones').removeClass('activo');
    });
});

// OCULTAR MENU DE OPCIONES
$('body').on("click", function (element) {
    let opciones = $('#opciones');
    if (element.target != opciones[0]) {
        $('#opciones_menu').slideUp(200, function () {
            opciones.removeClass('activo');
        });
    }
});

// CHECAR SI EL LIENZO ESTÁ VACIO
function lienzoVacio() {
    if (!$("#canvas").find(".nodo").length)
        return true;
    else
        return false;
}

// LIMPIAR TABLA DE RESULTADOS
function limpiarTabla() {
    $("#resultados table").empty();
}

// LIMPIAR EL GRAFO
btnLimpiarGrafo.click(function () {
    $(".full-nodo, .full-edge").remove();
    pausa = false;
    contadorAristas = -1;
    contadorNodos = 1;
    elemento = aristaFlag = 0;
    x0 = y0 = x1 = y1 = 0;
    idNodo1 = idNodo2 = 0;

    nodos = [];
    aristas = [];
    listaAdyacencias = {};
    limpiarTabla();
});

// CONFIGURACION INICIAL
$('#nuevo_grafo').click(function () {
    showModal($('#modal_configuracion_inicial'), null, () => {
        // Limpiar los inputs
        $("#grafo").val(1);
        $("#ponderado, #autonombrar").prop("checked", false);
        $("#tiempo_paso").val("");
    });
});

// FINALIZAR CONFIGURACION
$("#configuracion_formulario").submit(function (e) {
    e.preventDefault();

    // Detectar que tipo de grafo se va a dibujar
    tipoGrafo = parseInt($("#grafo").val());

    // Saber si es ponderado o no
    ponderado = $("#ponderado:checked").val() != undefined ? true : false;

    // Saber si se nombrará automaticamente
    autonombrar = $("#autonombrar:checked").val() != undefined ? true : false;

    // Obtener el tiempo de cada paso para la ejecucion
    tiempoPaso = $("#tiempo_paso").val() != "" ? parseInt($("#tiempo_paso").val()) : 500;

    // Habilitar botones del menu
    $(".grupo-opciones .deshabilitado:not(#pausar_ejecucion, #detener_ejecucion, #limpiar_ejecucion)").removeClass("deshabilitado");

    // Limpiar grafo
    btnLimpiarGrafo.trigger("click");
    // Cerrar modal
    $("#configuracion_cancelar").trigger("click");
});

// TIPO DE ALGORITMO A EJECUTAR
$("#algoritmo").change(function () {
    algoritmo = parseInt($(this).val());
});

// EJECUTAR EL ALGORITMO SELECCIONADO
btnEjecutar.click(function () {
    $("#ejecutar_algoritmo").addClass("deshabilitado");
    if (pausa) {
        pausa = false;
        $(this).addClass("deshabilitado").removeClass("activo");
    } else {
        $("#limpiar_ejecucion").trigger("click");

        $("#algoritmo").parent().addClass("deshabilitado");
        $("#dibujar_nodo, #dibujar_arista").addClass("deshabilitado");
        // Mostrar o no la informacion antes de ejecutar
        if (localStorage.getItem("informar_antes_ejecutar") != "false") {
            // Avisar que tiene que seleccionar el nodo de incio
            showModal($("#modal_informacion_ejecutar"));
        }
        // Seleccionar nodo de inicio
        // evitar que se inicie el proceso de creacion de aristas
        elemento = 3;
        $(".nodo").addClass("nodoarista");
        
        $(".nodo").on("click", function (node) {
            // desmarcar boton de ejecucion
            $(".activo").removeClass("activo").addClass("deshabilitado");
            // habilitar boton de pausa y detener
            $("#pausar_ejecucion, #detener_ejecucion").removeClass("deshabilitado");
            let = idStartNodo = $(node.target).attr("id");
            $(".nodo").off("click");
            switch(algoritmo) {
                case 1:
                    BFS(idStartNodo);
                    break;
                case 2:
                    DFS(idStartNodo);
                    break;
            }
        });
    }
});

// NO VOLVER A MOSTRAR MENSAJE ANTES DE EJECUTAR
$('#informar_antes_ejecutar').submit(function (e) {
    e.preventDefault();
    if ($("#informar_ejecutar:checked").val() != undefined)
        localStorage.setItem('informar_antes_ejecutar', "false");
});

// PROMESA PARA LA EJECUCION DE UN PASO DEL ALGORITMO
async function paso(codigo) {
    let step = new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, tiempoPaso);
    });

    await step;

    if(pausa) {
        for(let i = 0; i <= 1e7; i++){
            await cadaSegundo();
            if(!pausa || detener)
                break;
        }
    }
    if(detener)
        throw new Error('Detener');
    codigo();
};

function cadaSegundo() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

// PAUSAR EJECUCION DEL ALGORITMO
$('#pausar_ejecucion').click(function() {
    pausa = true;
    $("#ejecutar_algoritmo").removeClass("deshabilitado");
});

// EJECUCION DE ALGORITMO TERMINADO
function ejecucionFinalizada() {
    $("#algoritmo").parent().removeClass("deshabilitado");
    $("#ejecutar_algoritmo, #dibujar_nodo, #dibujar_arista, #limpiar_ejecucion").removeClass("deshabilitado");
    $("#pausar_ejecucion, #detener_ejecucion").addClass("deshabilitado");
}

$("#detener_ejecucion").click(function() {
    detener = true;
    $("#limpiar_ejecucion").trigger("click");
    $("#detener_ejecucion, #pausar_ejecucion").addClass("deshabilitado");
    $("#ejecutar_algoritmo, #dibujar_nodo, #dibujar_arista").removeClass("deshabilitado");
    $("#algoritmo").parent().removeClass("deshabilitado");
});

// LIMPIAR RASTRO DE EJECUCION
$("#limpiar_ejecucion").click(function() {
    $(this).removeClass("activo").addClass("deshabilitado");

    $(".nodo").removeClass(["nodoarista", "start", "visited"]);
    $(".arista").removeClass("path");

    // Limpiar resultados
    limpiarTabla();
    nodos.forEach(nodo => {
        nodo.distancia = Infinity;
        nodo.estado = "no visitado";
        nodo.finalizado = 0;
        nodo.predecesor = null;
    });
});