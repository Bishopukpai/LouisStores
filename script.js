const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close')
let listProductHTML = document.querySelector('.product-container')
let listCartHTML = document.querySelector('.listCart')
let iconCartSpan = document.querySelector('.icon-cart span')

let listProducts = [];
let carts = []


const close = document.getElementById('close');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', ()=> {
    body.classList.toggle('showCart')
})

if (bar) {
    bar.addEventListener('click', ()=>{
        nav.classList.add('active')
    })
}
if(close) {
    close.addEventListener('click', ()=>{
        nav.classList.remove('active')
    })
}  

const addDataToHTML = () => {
    listProductHTML.innerHTML = ''
    if(listProducts.length >0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item')
            newProduct.dataset.id = product.id
            newProduct.innerHTML = `
                <div class="product" data-id="${product.id}">
                <img src="${product.image}" alt="" >
                <div class="description">
                    <span>${product.name}</span>
                    <h5>${product.description}</h5>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h4>${product.price}</h4>
                </div>
                <button class="addCart">
                    Add to cart
                </button>
            </div>
            `
           
            listProductHTML.appendChild(newProduct);
        })
    }
}

listProductHTML.addEventListener('click', (event)=>{
    let positionClick = event.target

    if(positionClick.classList.contains('addCart')){
        let productID = event.target.closest(".product").dataset.id
        addToCart(productID)
    }    
})

const addToCart = (productID) => {
    let positionThisProductInCart = carts.findIndex((value) => value.productID == productID)
    if(carts.length <= 0) {
        carts = [{
            productID : productID,
            quantity: 1,

        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            productID : productID,
            quantity: 1,
        })
    }else {
        carts[positionThisProductInCart].quantity =  carts[positionThisProductInCart].quantity + 1
    }

    addCartToHTML();
    addCartToMemory()
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts))
    console.log("Updated carts:", carts)
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = ''
    let totalQuantity = 0
    if(carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity
            let newCart = document.createElement('div');
            newCart.classList.add('item')
            newCart.dataset.id = cart.productID
            let positionProduct = listProducts.findIndex((value) => value.id == cart.productID)
            let info = listProducts[positionProduct]
            newCart.innerHTML =`
                 <div class="image">
                    <img src="${info.image}" alt="" srcset="">
                </div>
                <div class="name">
                   ${info.name}
                </div>
                <div class="totalPrice">
                    ${info.price * cart.quantity}
                </div>
                <div class="quantity" data-id="1">
                    <span class="minus">-</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `
            listCartHTML.appendChild(newCart)
        })
    }
    iconCartSpan.innerText = totalQuantity
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let productID = positionClick.parentElement.parentElement.dataset.id

        console.log(productID)

        let type = 'minus'
        if(positionClick.classList.contains('plus')){
            type = 'plus'
        }
        changeQuantity(productID, type)
    }
})

const changeQuantity = (productID, type) => {
    let positionItemInCart = carts.findIndex((value) => value.productID == Number(productID));

    if(positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1
                break;
        
            default:
                let valueChange = carts[positionItemInCart].quantity -1

                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange
                }else {
                    carts.splice(positionItemInCart, 1)
                }
                break;
        }
    }
    addCartToMemory()
    addCartToHTML()
}

const initApp = () => {
    fetch('product.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data
        addDataToHTML();


        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'))
            addCartToHTML()
        }
    })
}

initApp()