const btn = document.querySelector('.add-memopadbox-sign');
const memopadbox = document.querySelector('.addMemoPadModalBox');
const closebtn = document.querySelector('.close');
const selectCategory = document.querySelector("#category-select")
const categoryInput = document.querySelector('#category-input')

btn.onclick = () => {
    memopadbox.style.display = 'flex';
}

closebtn.onclick = () => {
    memopadbox.style.display = 'none';
}

selectCategory.addEventListener('change', () => {
    if (selectCategory.value == 'addNewCategory') {
        categoryInput.style.display = 'flex';
        categoryInput.required = true;
    } else {
        categoryInput.style.display = 'none';
        categoryInput.required = false;
    }
})