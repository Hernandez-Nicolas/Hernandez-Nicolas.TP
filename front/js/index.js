document.addEventListener("DOMContentLoaded",()=>{
    const form = document.querySelector("#login");
    form.addEventListener("submit",(event)=>{
        event.preventDefault();
        if(form.checkValidity()){
            event.stopPropagation();
        }
        form.classList.add("was-validated");
        const entradas = document.querySelectorAll(":invalid");
        if(entradas.length===0){
            localStorage.setItem("name",document.querySelector("#nombre").value);
            localStorage.setItem("carrito",[]);
            window.location.href="../pages/productos.html";
        }
        entradas.forEach(entrada => {
            if(entrada !== entradas[0]&&!entrada.validity.valid){
                const div = document.querySelector(`#${entrada.id}Error`);
                div.innerHTML = "Debe ingresar un nombre";
            }
        });
    });
});

/* muestra el titulo con el nombre del comercio y el form donde el usuario debe ingresar su nombre*/
window.addEventListener("load",()=>{
    document.querySelector(".login").classList.add("show");
    document.querySelector("h1").classList.add("show")
});