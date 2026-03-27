document.addEventListener('DOMContentLoaded',()=>{
    /* hacer un fetch de productoController para traer todos los productos */
    const datos = fetch('http://localhost:3000/producto').then(res => res.json());

    datos.forEach(producto => {
        let li = document.createElement('li');
        li.style='display: flex';
        li.innerHTML=`
            <p>id:${producto.id} nombre:${producto.nombre} categoria:${producto.categoria} precio:${producto.precio}</p>
            <button id="modificar">modificar</button>
            <button id="baja">dar de baja</button>
        `;
        let ul = document.querySelector("#productos");
        ul.appendChild(li);
    });
});