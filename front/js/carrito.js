document.addEventListener("DOMContentLoaded",()=>{
    const productosEnCarrito = JSON.parse(localStorage.getItem("carrito"));

    /* muestra los productos del carrito */
    const contenidoCarrito = document.querySelector("#contenidoCarrito");
    productosEnCarrito.forEach(p=>{
        contenidoCarrito.innerHTML +=
        `<li class="d-flex justify-content-around border border-primary rounded m-1 p-1">
            <p>${p.nombre}</p>
            <p>$${p.precio}</p>
            <div>
                <button class="btn btn-outline-primary" id="btnRestar${p.id}">&lsaquo;</button>
                <input class="cantidad text-center" type="number" id="cantidad${p.id}" value="${p.cantidad}">
                <button class="btn btn-outline-primary" id="btnSumar${p.id}">&rsaquo;</button>
            </div>
            <button class="btn btn-danger" id="btnQuitar${p.id}">quitar</button>
        </li>`;
    });
    
    /* Muestra los productos a modo de pre ticket */
    const preTicket = document.querySelector("#preTicket");
    productosEnCarrito.forEach(p=>{/* lo pongo denuevo para distiguirlo */
        preTicket.innerHTML +=
        `<li class="producto-preTicket d-flex">
            <p class="me-auto">${p.nombre}</p>
            <p class="justify-content-end">$${p.precio}</p>
            <p class="justify-content-end">x${p.cantidad}</p>
        </li>`;
    })

    /* Actualiza la notificacion al lado del enlace a la pagina del carrito */
    const actualizarNotificacion=()=>{
        if(productosEnCarrito.length>0){
            document.querySelector("#carrito").innerHTML = `Carrito<spamn class="notificacion">${productosEnCarrito.length}</spamn>`;
        }
        else{
            document.querySelector("#carrito").innerHTML = `Carrito`;
        }
    }
    actualizarNotificacion();
});