$('.t-modal').hide();

// MODAL
function showModal(modal, title = null, closing = null, showed = null) {
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

    // After showing
    if (showed) {
        setTimeout(function () {
            showed();
        }, 200);
    }

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

const btnRun = $("#run");
// Seleccionar nodo de inicio
btnRun.click(function() {
    // evitar que se inicie el proceso de creacion de aristas
    elemento = 3;
    $(".nodo").removeClass("nodoarista");

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