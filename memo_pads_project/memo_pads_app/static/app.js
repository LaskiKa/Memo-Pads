import {reloadTinyMCE} from "./reloadTinyMce.js";


document.addEventListener('DOMContentLoaded', function () {
    const descboxesShuffle = document.querySelectorAll('.memopadbox-descbox-shuffle');
    const images = document.querySelectorAll('.memopadbox-details-image');
    const btn = document.querySelector('.add-memopadbox-sign');
    const memopadbox = document.querySelector('.addMemoPadModalBox');
    const closebtn = document.querySelector('.close');
    const galleryModalBox = document.querySelector('.galleryModalBox')
    const modalImage = document.getElementById('modalImage');


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

    // Add MemoPad
    btn.onclick = () => {
        const template = document.createElement('div');
        template.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <form id="addMemoPadForm" class="addMemoPadForm" method="post" enctype="multipart/form-data">
                    <label>Title:</label>
                    <input type="text" id="title" name="title" required>

                    <label id="category-label">Category:</label>
                    <select id="category-select" name="category-select" required>
                        <option value="addNewCategory">New Category</option>
                    </select>

                    <input type="text" id="category-input" name="category-input">

                    <label for="note">Note:</label>
                    <textarea id="note" name="note"></textarea>

                    <label for="image">Obraz:</label>
                    <input id="image" name="image" type="file">

                    <input type="submit" value="Add Memo Pad">
                </form>
            </div>
        `
        template.classList.add('addMemoPadModalBox');
        template.style.display = 'flex'
        template.querySelector('.close').onclick = () => {
            template.remove()
        }

        const allCategoriesArray = JSON.parse(sessionStorage.getItem('allCategories'));
        allCategoriesArray.forEach(category => {
            if (category['id'] == template.querySelector('option').value) {
                return 
            }
            const option = document.createElement('option');
            option.value = category['id'];
            option.text = category['category'];
            template.querySelector('#category-select').prepend(option)
        })

        template.querySelector('input[id="category-input"]').style.display = 'flex'

        document.body.append(template)
        reloadTinyMCE()

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
    }
    
    
    function openGallery(imageSrc) {
        modalImage.src = imageSrc;
        galleryModalBox.style.display = 'flex';
    };


    

    
});