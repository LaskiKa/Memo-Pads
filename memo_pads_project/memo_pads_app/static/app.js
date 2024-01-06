document.addEventListener('DOMContentLoaded', function () {
    const descboxesShuffle = document.querySelectorAll('.memopadbox-descbox-shuffle');
    const images = document.querySelectorAll('.memopadbox-details-image');
    const btn = document.querySelector('.add-memopadbox-sign');
    const memopadbox = document.querySelector('.addMemoPadModalBox');
    const closebtn = document.querySelector('.close');
    const galleryModalBox = document.querySelector('.galleryModalBox')
    const modalImage = document.getElementById('modalImage');

    console.log('select Category:', selectCategory);
    console.log('category Input: ', categoryInput);

    descboxesShuffle.forEach(descboxShuffle => {
        descboxShuffle.addEventListener('click', () => {
            // Pobierz elementy związane z konkretnym memopadem
            const detailsBoxShuffle = descboxShuffle.closest('.memopadbox-shuffle').querySelector('.memopadbox-details-shuffle');
            // Sprawdź widoczność i przełącz ją
            if (detailsBoxShuffle.style.display === 'none' || detailsBoxShuffle.style.display === '') {
                detailsBoxShuffle.style.display = 'flex';
            } else {
                detailsBoxShuffle.style.display = 'none';
            }
        });
    });

    images.forEach(image => {
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

    btn.onclick = () => {
        memopadbox.style.display = 'flex';
    }
    
    closebtn.onclick = () => {
        memopadbox.style.display = 'none';
    }
    
    function openGallery(imageSrc) {
        modalImage.src = imageSrc;
        galleryModalBox.style.display = 'flex';
    }
    
});

const selectCategory = document.querySelector("#category-select")
const categoryInput = document.querySelector('#category-input')


selectCategory.addEventListener('change', () => {
    console.log('selectCategory change');
    if (selectCategory.value == 'addNewCategory') {
        categoryInput.style.display = 'flex';
        categoryInput.required = true;
    } else {
        categoryInput.style.display = 'none';
        categoryInput.required = false;
    }
});