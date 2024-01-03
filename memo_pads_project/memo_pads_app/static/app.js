const btn = document.querySelector('.add-memopadbox-sign');
const memopadbox = document.querySelector('.addMemoPadModalBox');
const closebtn = document.querySelector('.close');
const selectCategory = document.querySelector("#category-select")
const categoryInput = document.querySelector('#category-input')
const image = document.querySelector(".memopadbox-details-image")
const galleryModalBox = document.querySelector('.galleryModalBox')
const galleryContent = document.querySelector('.galleryContent');
const galleryClose = document.querySelector('.galleryClose');
const modalImage = document.getElementById('modalImage');
// const images = document.querySelectorAll('.memopadbox-details-image');


document.addEventListener('DOMContentLoaded', function () {
    const descboxes = document.querySelectorAll('.memopadbox-descbox-shuffle');
    const images = document.querySelectorAll('.memopadbox-details-image');

    descboxes.forEach(descbox => {
        descbox.addEventListener('click', () => {
            // Pobierz elementy związane z konkretnym memopadem
            const detailsBox = descbox.closest('.memopadbox-shuffle').querySelector('.memopadbox-details-shuffle');
            // Sprawdź widoczność i przełącz ją
            if (detailsBox.style.display === 'none' || detailsBox.style.display === '') {
                detailsBox.style.display = 'flex';
            } else {
                detailsBox.style.display = 'none';
            }
        });
    });

    images.forEach(image => {
        image.addEventListener('mouseover', () => {
            image.style.cursor = 'pointer';
            image.style.transform = 'scale(1.1)';
        });
    
        image.addEventListener('mouseout', () => {
            image.style.transform = 'scale(1)';
        });
    
        image.addEventListener('click', () => {
            const imageUrl = image.getAttribute('src');
            openGallery(imageUrl);
        });
    });

    galleryModalBox.addEventListener('click', (event) => {
        if (event.target === galleryModalBox) {
            galleryModalBox.style.display = 'none';
        }
    });
    
});

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


// Funkcja obsługi otwierania galerii
function openGallery(imageSrc) {
    modalImage.src = imageSrc;
    galleryModalBox.style.display = 'flex';
}

