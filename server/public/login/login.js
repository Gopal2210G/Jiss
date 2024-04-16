const wrap= document.querySelector('.wrap');
const loginLink=document.querySelector('.login-link');
const registerLink=document.querySelector('.register-link');
const LoginPop=document.querySelector('.btn-pop');
const close=document.querySelector('.close');


registerLink.addEventListener('click',()=>{
    wrap.classList.add('active');
});

loginLink.addEventListener('click',()=>{
    wrap.classList.remove('active');
});

LoginPop.addEventListener('click',()=>{
    wrap.classList.add('active-popup');
});

close.addEventListener('click',()=>{
    wrap.classList.remove('active-popup');
});
