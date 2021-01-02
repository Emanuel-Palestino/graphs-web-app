$('.modal').hide();

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

// EJECUTAR EL ALGORITMO SELECCIONADO
const btnRun = $("#run");
// Seleccionar nodo de inicio
btnRun.click(function() {
    // evitar que se inicie el proceso de creacion de aristas
    $(".boton-selected").removeClass("boton-selected");
    btnRun.addClass("boton-selected");
    elemento = 3;
    $(".nodo").addClass("nodoarista");

    let idStartNodo = "";
    canvas.find(".nodo").on("click", function(node) {
        idStartNodo = $(node.target).attr("id");
        if (algoritmo == 1)
            BFS(idStartNodo);
        else if (algoritmo == 2)
            DFS(idStartNodo);
        canvas.find(".nodo").off("click");
    });
});