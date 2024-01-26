const reloadTinyMCE = () => {
    const existingScripts = document.querySelectorAll('script[src*="tinymce.min.js"]');
    const newScript = document.createElement('script');
    
    existingScripts.forEach(script => script.remove());
    newScript.src = 'https://cdn.tiny.cloud/1/yqxa1nqsoxr7idi00ug330h0gsh66xcb87j9dbiwzufq336s/tinymce/6/tinymce.min.js';
    newScript.referrerpolicy = 'origin';

    newScript.onload = function () {
        tinymce.init({
            selector: 'textarea',
            apiKey: '{{ TINYMCE_API_KEY }}',
            plugins: 'lists',
            toolbar: 'bullist numlist bold italic underline lignleft aligncenter alignright alignjustify',
        });
    };

    document.head.appendChild(newScript);
}

const openGallery = (imageSrc)  => {
    const galleryModalBox = document.querySelector('.galleryModalBox')
    modalImage.src = imageSrc;
    galleryModalBox.style.display = 'flex';
}

const details = (memoPadId) => {
    // Show memopad details function
    console.log('Działa, ID: ', memoPadId );

    const template = document.createElement('div')
    template.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <form id="addMemoPadForm" class="addMemoPadForm" method="post" enctype="multipart/form-data">
            <label>Title:</label>
            <input type="text" id="title" name="title" required>

            <label id="category-label">Category:</label>
            <select id="category-select" name="category-select" required>
                {% for category in categories %}
                <option value="{{category.id}}">{{category.category}}</option>
                {% endfor %}
                <option value="addNewCategory">New Category</option>
            </select>

            <input type="text" id="category-input" name="category-input">

            <label for="note">Note:</label>
            <textarea id="note" name="note"></textarea>

            <div class="memopadbox-details">
                <img class="memopadbox-details-image" src="" alt="Memo Image" loading="lazy">
            </div>

            <label for="image">Obraz:</label>
            <input id="image" name="image" type="file">
            <input class="save-changes" type="submit" value="Save changes">
            <a href="">
            <input class="delete-button" type="button" value="Delete">
            </a>
        </form>
    </div>
    `
    template.classList.add("editMemoPadModalBox2")
    template.querySelector('.close').onclick = () => {
        template.remove();
        document.querySelector('.tox').remove()
    }
    template.style.display = 'flex'
    template.querySelector('a').href = `delete/${memoPadId}`
    
    fetch(`http://127.0.0.1:8000/memopadsapi/${memoPadId}`)
        .then(memopad => memopad.json())
        .then(memopad => {

            template.querySelector('#title').value = memopad.title
            template.querySelector('#note').innerHTML = memopad.note
            if (memopad.image == null) {
                template.querySelector('.memopadbox-details-image').remove()
            } else {
                template.querySelector('.memopadbox-details-image').src = memopad.image;
            };           


        })

    
    document.body.append(template)



    reloadTinyMCE();


    // Dopisać fetcha, który pobierze szczegóły notatki. I wyświetli użytkownikowi.
    // Następnie da możliwość edycji, zapisania zmian lub usunięcia.
    // Zastanowić się jak przedstawić okienko edycji
    // Append chil powinno być w formie -> sprawdź kod HTML 
}

// Upload all user memopads
fetch("http://127.0.0.1:8000/memopadsapi/")
    .then(data => data.json())
    .then(data => {

        data.forEach(memoPad => {
            const template = document.createElement('div');
            template.innerHTML = `
            <div class="memopadbox">

                <div class="memopadbox-descbox">
                    <div class="memopadbox-descbox-title"></div>
                    <a href=""> <input class="edit-button" type="button" value="Edit"> </a>
                    <div class="memopadbox-descbox-category"></div>
                </div>
        
                <div class="memopadbox-details">
                    <div class="memopadbox-details-notes"></div>
                    <img class="memopadbox-details-image" src="" alt="Memo Image" loading="lazy">
                </div>
        
            </div>`;
            template.querySelector('a').href = memoPad.id
            template.querySelector('.memopadbox-descbox-title').textContent = memoPad.title;
            template.querySelector('.memopadbox-descbox-category').textContent = memoPad.category;
            template.querySelector('.memopadbox-details-notes').innerHTML = memoPad.note;
            if (memoPad.image == null) {
                template.querySelector('.memopadbox-details-image').remove()
            } else {
                template.querySelector('.memopadbox-details-image').src = memoPad.image;
                template.querySelector('.memopadbox-details-image').addEventListener('click', () => {
                    openGallery(template.querySelector('.memopadbox-details-image').getAttribute('src'))
                })
            };
            
            document.body.append(template)
            
            const memopadbox = template.querySelector(".memopadbox")
            memopadbox.style.cursor = 'pointer'
            memopadbox.addEventListener('click', () => {
                details(memoPad.id)
            })
            
            
        });

    

    })
    .catch(error => {
        console.error('Error:', error);


    });



// const memopadbox