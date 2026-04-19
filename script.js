let cart = [];

function loadCart(){
    let stored = sessionStorage.getItem("cart");
    if (!stored || stored === "") {
        cart = [];
        return;
    }

    cart = [];
    let entries = stored.split(",");

    for(let i = 0; i < entries.length; i++){
        let parts = entries[i].split("|");
        if (parts.length === 3) {
            cart.push({
                name: parts[0],
                price: Number(parts[1]),
                qty: Number(parts[2])
            });
        }
    }
}

//Save cart details to sessionStorage as simple plain string
function saveCart(){
    let entries = [];
    for (let i = 0; i < cart.length; i++) {
        entries.push(cart[i].name + "|" + cart[i].price + "|" + cart[i].qty);
    }
    sessionStorage.setItem("cart", entries.join(","));
}

//Add items to cart
function addToCart(name, price){

    let found = false;

    for(let i = 0; i < cart.length; i++){
        if(cart[i].name === name){
            cart[i].qty += 1;
            found = true;
            break;
        }
    }

    if(!found){
        cart.push({ name: name, price: price, qty: 1 });
    }

    saveCart();
    alert(name + " added to cart!");
    updateCartBadge();
}

//Remove item from cart
function removeFromCart(name){
    let newCart = [];
    for(let i = 0; i < cart.length; i++){
        if (cart[i].name !== name){
            newCart.push(cart[i]);
        }
    }
    cart = newCart;
    saveCart();
    displayCart();
    updateCartBadge();
}

//Change qty.
function changeQty(name, delta){
    for(let i = 0; i < cart.length; i++){
        if(cart[i].name === name){
            cart[i].qty += delta;
            if(cart[i].qty <= 0){
                removeFromCart(name);
                return;
            }
            break;
        }
    }
    saveCart();
    displayCart();
    updateCartBadge();
}

//Display cart
function displayCart(){

    let list = document.getElementById("cartList");
    let total = 0;

    if (!list) return;

    if(cart.length === 0){
        list.innerHTML = "<h3>Your cart is empty.</h3>";
        return;
    }

    let table = `<table border="1" style="margin:auto; text-align:center;">
                    <tr>
                        <th>Product</th>
                        <th>Price (₹)</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>`;

    for(let i = 0; i < cart.length; i++){

        let item = cart[i];
        let subtotal = item.price * item.qty;

        table += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>
                    <button onclick="changeQty('${item.name}', -1)">-</button>
                    ${item.qty}
                    <button onclick="changeQty('${item.name}', 1)">+</button>
                </td>
                <td>${subtotal}</td>
                <td>
    <button onclick="removeFromCart('${item.name}')">Remove</button>
    <button onclick="buyItem('${item.name}', ${item.qty})">Buy</button>
</td>
            </tr>
        `;

        total += subtotal;
    }

    table += `</table>`;

    let gst = total * 0.18;
    let finalTotal = total + gst;

    list.innerHTML = table + `
        <h3>Total: ₹${total}</h3>
        <h3>GST (18%): ₹${gst.toFixed(2)}</h3>
        <h2>Final Amount: ₹${finalTotal.toFixed(2)}</h2>
        <button onclick="clearCart()">Clear Cart</button>
    `;
}

//Cart number badge
function updateCartBadge(){
    let badge = document.getElementById("cartBadge");
    if (!badge) return;

    let totalQty = 0;
    for(let i = 0; i < cart.length; i++){
        totalQty += cart[i].qty;
    }

    badge.innerText = totalQty;
    badge.style.display = totalQty > 0 ? "inline" : "none";
}

//Clear cart
function clearCart(){
    sessionStorage.removeItem("cart");
    cart = [];
    displayCart();
    updateCartBadge();
}

//Form validation
function validateForm(){
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();

    if(!/^[A-Za-z ]+$/.test(name)){
        alert("Name must contain only letters");
        return false;
    }

    if(!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)){
        alert("Invalid Email");
        return false;
    }

    if(!/^[0-9]{10}$/.test(phone)){
        alert("Phone must be 10 digits");
        return false;
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters");
        return false;
    }

    alert("Form Submitted Successfully!");
    return true;
}

//Run on page load
loadCart();
document.addEventListener("DOMContentLoaded", function (){
    displayCart();
    updateCartBadge();
});

function openCategory(category){

    //hide category cards
    document.getElementById("categorySection").style.display = "none";

    //show selected category
    document.getElementById(category).style.display = "flex";
}

function goBack(){

    //show categories again
    document.getElementById("categorySection").style.display = "flex";

    //hide all product sections
    let categories = document.getElementsByClassName("category");

    for(let i = 0; i < categories.length; i++){
        categories[i].style.display = "none";
    }
}

function buyItem(name, qty){

    fetch(`/buy?item=${name}&qty=${qty}`)
        .then(res => res.text())
        .then(data => {

            if(data === "OUT_OF_STOCK"){
                alert("Not enough stock.");
                return;
            }

            alert("Purchase successful!");

            removeFromCart(name);
        });
}