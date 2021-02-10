$('.modal').hide();

const btnRun = $("#ejecutar_algoritmo");
let tipoGrafo = 1;
let ponderado = false;
let autonombrar = false;
let tiempoPaso = 500;

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
    $(".grupo-opciones .deshabilitado:not(#paso_atras, #paso_adelante, #pausar_ejecucion, #detener_ejecucion)").removeClass("deshabilitado");

    // Cerrar modal
    $("#configuracion_cancelar").trigger("click");
});

// EJECUTAR EL ALGORITMO SELECCIONADO
btnRun.click(function () {
    // Avisar que tiene que seleccionar el nodo de incio
    showModal($("#modal_informacion_ejecutar"), null, null, () => {

        // Seleccionar nodo de inicio
        // evitar que se inicie el proceso de creacion de aristas
        elemento = 3;
        $(".nodo").addClass("nodoarista");

        let idStartNodo = "";
        canvas.find(".nodo").on("click", function (node) {
            idStartNodo = $(node.target).attr("id");
            if (algoritmo == 1)
                BFS(idStartNodo);
            else if (algoritmo == 2)
                DFS(idStartNodo);
            canvas.find(".nodo").off("click");
        });

    });
});

// NO VOLVER A MOSTRAR MENSAJE ANTES DE EJECUTAR
$('#informar_antes_ejecutar').click(function() {
    if ($("#informar_ejecutar:checked").val() != undefined) {
        // crear la cookie para ya no volver a preguntar
    }
});