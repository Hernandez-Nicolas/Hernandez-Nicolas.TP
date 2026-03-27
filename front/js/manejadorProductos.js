class ManejadorProductos{

    constructor () {
        this.filtro = "todos";
        this.productos = [];
        this.categorias = [];
        this.paginaActiva = 1;
        this.init();
    }

    async init () {
        let res = await axios.get("http://localhost:3000/producto");/* pedido de ejemplo de los datos */
        this.productos = res.data;
        this.productos.forEach(producto => {
            /* se toma el userId a modo de categoria. Con los datos reales se usara producto.categoria */
            if(!this.categorias.includes(producto.categoria)){
                this.categorias.push(producto.categoria);
            }
        });
        /* cargo por primera vez los productos */
        this.filtrarProductos();
        
        this.agregarBotonesCategorias();

        this.actualizarNotificacion();
    }
    
    /* agrega los botones de las categorias y sus addEventListeners */
    agregarBotonesCategorias(){
        document.querySelector("#filtros").innerHTML = `<li><button class="btn btn-filtro btn-primary m-1" data-filtro="todos">todos</button></li>`;
        document.querySelector("#filtros").innerHTML += this.categorias.map(categoria=>
            `<li><button class="btn btn-filtro btn-primary m-1" data-filtro="${categoria}">${categoria}</button></li>`
        ).join('');
        document.querySelectorAll(".btn-filtro").forEach(boton => {
            boton.addEventListener("click",e=>{
                this.filtro = e.target.dataset.filtro;
                this.filtrarProductos();
            });
        });
    }

    /* Cambia el tipo de filtro de categoria y crea la paginacion de la lista filtrada */
    filtrarProductos(){
        this.paginaActiva = 1;
        let filtrado = this.productos;
        if(this.filtro!=="todos"){/* cambiar el producto.userId por producto.categoria cuando se traigan los datos reales */
            filtrado = this.productos.filter(producto=>producto.categoria==this.filtro);
        }
        this.crearPaginacion(filtrado);
    }

    crearPaginacion(productos){
        const ul = document.querySelector("#paginacion");
        const cantidadPorPagina = 16;
        const totalPaginas = Math.ceil(productos.length/cantidadPorPagina);/* calcula la cantidad de paginas */

        this.productosPaginaActual(productos,cantidadPorPagina);

        /* Crea los botones de la paginacion */
        ul.innerHTML =
        `<li class="page-item" id="liAnterior"><a href="#" class="page-link" hidden="true" id="btnAnterior">&lsaquo;</a></li>`;
        for(let i=0;i<totalPaginas;i++){
            ul.innerHTML +=
            `<li class="page-item ${this.paginaActiva==i+1?"active":""}" id="li${i+1}"><a href="#" class="page-link" id="btn${i+1}">${i+1}</a></li>`;
            /* document.querySelector(`#btn${i+1}`).addEventListener("click",()=>{console.log("no funciono")}) */
        }
        ul.innerHTML +=
        `<li class="page-item" id="liSiguiente"><a href="#" class="page-link" ${this.paginaActiva==totalPaginas?'hidden="true"':''} id="btnSiguiente">&rsaquo;</a></li>`;

        const btnAnterior = document.querySelector("#btnAnterior");
        const btnSiguiente = document.querySelector("#btnSiguiente");

        /* Si hago los addEventListener de los botones numerados en el otro for no funcionan */  
        for(let i=0;i<totalPaginas;i++){
            document.querySelector(`#btn${i+1}`).addEventListener("click",(e)=>{
                this.paginaActiva = parseInt(e.target.textContent);
                this.productosPaginaActual(productos,cantidadPorPagina);
                this.actualizarBarraPaginacion(totalPaginas);
            });
        }

        /* se agrega un evento click al boton anterior */
        btnAnterior.addEventListener("click",()=>{
            if(this.paginaActiva>1){
                this.paginaActiva--;
                this.productosPaginaActual(productos,cantidadPorPagina);
                this.actualizarBarraPaginacion(totalPaginas);
            }
        });

        /* Se agrega un evento click al boton siguiente */
        btnSiguiente.addEventListener("click",()=>{
            if(this.paginaActiva<totalPaginas){
                this.paginaActiva++;
                this.productosPaginaActual(productos,cantidadPorPagina);
                this.actualizarBarraPaginacion(totalPaginas);
            }
        });
    }
    
    /* Muestra que pagina esta activa y esconde o muestra los botones anterior/siguiente dependiendo de en que pagina se este */
    actualizarBarraPaginacion(totalPaginas){
        const btnAnterior = document.querySelector("#btnAnterior");
        const btnSiguiente = document.querySelector("#btnSiguiente");

        document.querySelectorAll(".active").forEach(activo=>{activo.classList.remove("active")});
        document.querySelector(`#li${this.paginaActiva}`).classList.add("active")

        this.paginaActiva==1?btnAnterior.setAttribute("hidden",true):btnAnterior.removeAttribute("hidden");
        this.paginaActiva==totalPaginas?btnSiguiente.setAttribute("hidden",true):btnSiguiente.removeAttribute("hidden");
    }

    /* Toma la lista filtrada y la cantidad por pagina. Renderiza los productos de la pagina actual */
    productosPaginaActual(productos,cantidadPorPagina){
        let index = (this.paginaActiva-1)*cantidadPorPagina;/* calcula en que indice va a iniciar el slice */
        let pagina = productos.slice(index,
            this.paginaActiva*cantidadPorPagina<productos.length?/* si la cantidad de productos hasta la pagina hactual es menor al largo del array, */
            this.paginaActiva*cantidadPorPagina:productos.length);/* toma esa canitad para marcar el limite de productos a traer, sino el limite es el largo del array*/
        this.renderProductos(pagina);
    }

    /* renderiza los productos filtrados */
    renderProductos (productos) {
        let enCarrito = JSON.parse(localStorage.getItem("carrito"));
        /* todos los id que hay en el carrito */
        const ids = enCarrito.map(producto=>producto.id);

        /* se va dato por dato creando su propio card. Debe rehacerse para acomodarse con los datos reales */
        document.querySelector("#productos").innerHTML = productos.map(producto=>
            `<div class="col">
                <div class="card text-center my-2">
                    <img src="${producto.imgURL}" class="card-img-top" alt="${producto.nombre}">
                    <div class="car-body">
                        <h5 class="car-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p >${producto.precio}</p>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex flex-row justify-content-center pb-1">
                            <button class="btn btn-outline-primary" id="btnRestar${producto.id}">&lsaquo;</button>
                            <input class="cantidad text-center" type="number" id="cantidad${producto.id}" value="1">
                            <button class="btn btn-outline-primary" id="btnSumar${producto.id}">&rsaquo;</button>
                        </div>
                        <p ${!ids.includes(producto.id)?'hidden="true"':''} id="cantidadCarrito${producto.id}">Cantidad en el carrito: 0</p>
                        <div class="d-flex flex-row justify-content-evenly">
                            <button class="btn btn-success" id="btnAgregar${producto.id}">agregar</button>
                            <button class="btn btn-danger" ${!ids.includes(producto.id)?'hidden="true"':''} id="btnQuitar${producto.id}">quitar</button>
                        </div>
                    </div>
                </div>
            </div>`
        ).join('');

        /* Agrego eventos a los botones */
        productos.forEach(producto => {
            let input = document.querySelector(`#cantidad${producto.id}`);
            let cantidadCarrito = document.querySelector(`#cantidadCarrito${producto.id}`);

            /* inicializo en un <p> la cantidad de ese producto en el carrito */
            enCarrito.forEach(p=>{
                if(p.id==producto.id){
                    cantidadCarrito.innerHTML = `Cantidad en el carrito: ${p.cantidad}`;
                }
            })

            /* impido poner valores negativos al input de cantidad */
            input.addEventListener("change",()=>{
                if(input.value<1){
                    input.value=1;
                }
            });

            /* agrego eventos a los botones para sumar y restar cantidad */
            document.querySelector(`#btnRestar${producto.id}`).addEventListener("click",()=>{
                if(input.value>1){
                    input.value--;
                }
            })
            document.querySelector(`#btnSumar${producto.id}`).addEventListener("click",()=>input.value++)

            /* Agrega productos al carrito en el localStorage */
            document.querySelector(`#btnAgregar${producto.id}`).addEventListener("click",()=>{
                enCarrito = JSON.parse(localStorage.getItem("carrito"));
                /* Agrega un producto nuevo */
                if(!enCarrito.map(producto=>producto.id).includes(producto.id)){
                    let agregado = {
                        id: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: parseInt(input.value)
                    };
                    enCarrito.push(agregado);
                    cantidadCarrito.innerHTML= `Cantidad en el carrito: ${agregado.cantidad}`;
                    cantidadCarrito.removeAttribute("hidden");
                    document.querySelector(`#btnQuitar${producto.id}`).removeAttribute("hidden");
                }
                else{/* Aumenta la cantidad de un producto */
                    enCarrito.forEach(p=>{
                        p.cantidad= p.id==producto.id?p.cantidad+parseInt(input.value):p.cantidad;
                        cantidadCarrito.innerHTML= `Cantidad en el carrito: ${p.cantidad}`;
                    });
                }
                input.value = 1;
                localStorage.setItem("carrito",JSON.stringify(enCarrito));
                this.actualizarNotificacion();
            });

            /* Evento del boton para quitar productos */
            document.querySelector(`#btnQuitar${producto.id}`).addEventListener("click",(e)=>{
                enCarrito = JSON.parse(localStorage.getItem("carrito"));
                enCarrito.forEach(p=>{
                    if(p.id==producto.id){
                        /* quita una cantidad espesifica */
                        if(p.cantidad>parseInt(input.value)){
                            p.cantidad -= parseInt(input.value);
                            cantidadCarrito.innerHTML= `Cantidad en el carrito: ${p.cantidad}`;
                        }
                        else{/* quita el prodcuto del carrito */
                            enCarrito.splice(enCarrito.indexOf(p),1);
                            cantidadCarrito.innerHTML= `Cantidad en el carrito: 0`;
                            cantidadCarrito.setAttribute("hidden",true);
                            e.target.setAttribute("hidden",true);
                        }
                    }
                });
                input.value = 1;
                localStorage.setItem("carrito",JSON.stringify(enCarrito));
                this.actualizarNotificacion();
            });
        });
    }

    /* Actualiza la notificacion al lado del enlace a la pagina del carrito */
    actualizarNotificacion(){
        const productosEnCarrito = JSON.parse(localStorage.getItem("carrito")).length;
        if(productosEnCarrito>0){
            document.querySelector("#carrito").innerHTML = `Carrito<spamn class="notificacion">${productosEnCarrito}</spamn>`;
        }
        else{
            document.querySelector("#carrito").innerHTML = `Carrito`;
        }
    }
}

window.ManejadorProductos = ManejadorProductos;