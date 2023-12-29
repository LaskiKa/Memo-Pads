const btn = document.querySelector('.add-memopadbox-sign');
const memopadbox = document.querySelector('.addMemoPadModalBox');
const closebtn = document.querySelector('.close');

btn.onclick = () => {
    memopadbox.style.display = 'flex';
}

closebtn.onclick = () => {
    memopadbox.style.display = 'none';
}