// utils/localCartUtils.js

export function getLocalCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveLocalCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addLocalCartItem(newItem) {
    const cart = getLocalCart();
    const existingIndex = cart.findIndex(item => item.productId === newItem.productId);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += newItem.quantity;
    } else {
        cart.push(newItem);
    }

    saveLocalCart(cart);
    return cart;
}

export function updateLocalCartQuantity(productId, quantity) {
    const cart = getLocalCart();
    const updatedCart = cart.map(item =>
        item.productId === productId ? {...item, quantity } : item
    );
    saveLocalCart(updatedCart);
    return updatedCart;
}

export function deleteLocalCartItem(productId) {
    const cart = getLocalCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    saveLocalCart(updatedCart);
    return updatedCart;
}