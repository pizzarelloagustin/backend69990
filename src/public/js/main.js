const socket = io(); 

socket.on("products", (data) => {
    renderProducts(data);
})

const renderProducts = (data) => {
    const contProducts = document.getElementById("contProducts");
    contProducts.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");

        card.innerHTML = `  <p> ${item.id} </p>
                            <p> ${item.title} </p>
                            <p> ${item.description} </p>
                            <p> ${item.code} </p>
                            <p> ${item.price} </p>
                            <p> ${item.status} </p>
                            <p> ${item.stock} </p>
                            <p> ${item.category} </p>
                            <p> ${item.thumbnails} </p>
                            <button> Eliminar </button>
                        `
        contProducts.appendChild(card); 

        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id); 
        })
    })
}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id); 
}


document.getElementById("btnSend").addEventListener("click", () => {
    addProduct();
})


const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        status: document.getElementById("status").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        thumbnails: document.getElementById("thumbnails").value,
    }

    socket.emit("addProduct", product);
    console.log(product)
}