"use strict";

const login = document.getElementById('btnSubmit');
const user = document.getElementById('user');
const pass = document.getElementById('pass');


function autentic(user, pass) {
    let admin= "admin";
    let password = "root";
    if (admin === user && password === pass) {
        return '/Vistas/dash.html';
    }else {
       return alert('Credenciales Incorrectas')
    }
}


login.addEventListener('click', (e) => {
    e.preventDefault();
    const response = autentic(user.value, pass.value);
    window.location.href = response;
    console.log(response)
})