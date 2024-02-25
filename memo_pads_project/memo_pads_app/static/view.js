import {reloadTinyMCE} from "./reloadTinyMce.js";

// Open Gallery Finction
const openGallery = (imageSrc)  => {
    const galleryModalBox = document.querySelector('.galleryModalBox')
    modalImage.src = imageSrc;
    galleryModalBox.style.display = 'flex';

}

// Create category function
export const createCategory = async (newCategoryInput, csrfToken) => {
    const response = await fetch('http://127.0.0.1:8000/categoryapi/', {
        headers: {
            "X-Csrftoken": csrfToken,
            "Content-Type": "application/json"
          },
        method: 'POST',
        credentials: "same-origin",
        body: JSON.stringify({
            "category": newCategoryInput
        })
    })
    const data = response.json()
    return data
}


// Edit memo pad function
const editMemoPadPost = async (memopadid) => {

    const csrfToken = document.head.querySelector("[name~=csrf_token][content]").content;
    const detailsMemoPad = document.querySelector('.editMemoPadModalBox2')
    const title = detailsMemoPad.querySelector('#title').value
    const note = tinymce.activeEditor.getContent();
    const image = detailsMemoPad.querySelector('#image').files[0]
    const category = detailsMemoPad.querySelector('#category-select')
    const selectedCategoryId = category.options[category.selectedIndex].value
    const selectedCategoryText = category.options[category.selectedIndex].text
    const categoryUpdate = {"id": "", "category": ""}
    const owner = document.querySelector('.user').id



    if (selectedCategoryText == "New Category") {
        const newCategoryInput = document.querySelector('#category-input').value

        const data = await createCategory(newCategoryInput, csrfToken)

        categoryUpdate['id'] = data.id
        categoryUpdate['category']= data.category
        
    } else {
        categoryUpdate['id'] = selectedCategoryId
        categoryUpdate['category']= selectedCategoryText
    }

    // Create FormData 
    const formData = new FormData();
    formData.append("id", memopadid);
    formData.append("category.category", categoryUpdate.category);
    formData.append("title", title);
    formData.append("note", note);
    formData.append("owner", owner);

    if (image) {
        formData.append('image', image);
    }

    // Update memopad
    fetch(`http://127.0.0.1:8000/memopadsapi/${memopadid}/`, {
        headers: {
            "X-Csrftoken": csrfToken,
        },
            method: 'PUT',
            credentials: "same-origin",
            body: formData
        })
        .then(response => {
        // Reload site after memopad update
            if (response.ok) {
                location.reload()
            }
        })
        .catch(error => {
            console.log("Error: ", error);
        });

    }

const details = async (memoPadId) => {
    // Show memopad details function
    const template = document.createElement('div')
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

            <div class="memopadbox-details">
                <img class="memopadbox-details-image" src="" alt="Memo Image" loading="lazy">
            </div>

            <label for="image">Obraz:</label>
            <input id="image" name="image" type="file">
            <input class="save-changes" type="button" value="Save changes">
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

    template.querySelector('#category-select').addEventListener('change', () => {
        if (template.querySelector('#category-select').value == 'addNewCategory') {
            template.querySelector('#category-input').style.display = 'flex'
            template.querySelector('#category-input').required = true;
        } else {
            template.querySelector('#category-input').style.display = 'none'
            template.querySelector('#category-input').required = false;
        }
    })

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

    template.querySelector('.save-changes').addEventListener('click', () => {
        editMemoPadPost(memoPadId);
    })

    
    const response = await fetch(`http://127.0.0.1:8000/memopadsapi/${memoPadId}`)
    const memopad = await response.json();

    template.querySelector('#title').value = memopad.title
    template.querySelector('#note').innerHTML = memopad.note
    if (memopad.image == null) {
        template.querySelector('.memopadbox-details-image').remove()
    } else {
        template.querySelector('.memopadbox-details-image').src = memopad.image;
    }; 

    template.querySelector(`option[value="${memopad.category.id}"]`).selected = true


    // fetch(`http://127.0.0.1:8000/memopadsapi/${memoPadId}`)
    //     .then(memopad => memopad.json())
    //     .then(memopad => {

    //         template.querySelector('#title').value = memopad.title
    //         template.querySelector('#note').innerHTML = memopad.note
    //         if (memopad.image == null) {
    //             template.querySelector('.memopadbox-details-image').remove()
    //         } else {
    //             template.querySelector('.memopadbox-details-image').src = memopad.image;
    //         };           

    //         template.querySelector(`option[value="${memopad.category.id}"]`).selected = true
            
            
    //     })

    
    document.body.append(template)
    reloadTinyMCE();


    // Dopisać fetcha, który pobierze szczegóły notatki. I wyświetli użytkownikowi.
    // Następnie da możliwość edycji, zapisania zmian lub usunięcia.
    // Zastanowić się jak przedstawić okienko edycji
    // Append chil powinno być w formie -> sprawdź kod HTML 
}

// Upload all user memopads

const allMemopads = async() => {
    try {
      const response = await fetch("http://127.0.0.1:8000/memopadsapi/");
      const data = await response.json();
      
      sessionStorage.clear();
      const allCategories = [];
  
      data.forEach(memoPad => {
        const template = document.createElement('div');
        template.innerHTML = `
          <div class="memopadbox">
            <div class="memopadbox-descbox">
              <div class="memopadbox-descbox-title"></div>
              <div class="memopadbox-descbox-category"></div>
            </div>
            <div class="memopadbox-details">
              <div class="memopadbox-details-notes"></div>
              <img class="memopadbox-details-image" src="" alt="Memo Image" loading="lazy">
            </div>
          </div>`;
          
        template.querySelector('.memopadbox-descbox-title').textContent = memoPad.title;
        template.querySelector('.memopadbox-descbox-category').textContent = memoPad.category.category;
        allCategories.push(memoPad.category);
        template.querySelector('.memopadbox-details-notes').innerHTML = memoPad.note;
        
        if (memoPad.image == null) {
          template.querySelector('.memopadbox-details-image').remove();
        } else {
          template.querySelector('.memopadbox-details-image').src = memoPad.image;
          template.querySelector('.memopadbox-details-image').addEventListener('click', (e) => {
            openGallery(template.querySelector('.memopadbox-details-image').getAttribute('src'));
            e.stopPropagation();
          });
        }
  
        const memopadbox = template.querySelector(".memopadbox");
        memopadbox.style.cursor = 'pointer';
        memopadbox.addEventListener('click', () => {
          details(memoPad.id);
        });
        document.body.append(template);
      });
  
      sessionStorage.setItem('allCategories', JSON.stringify(allCategories));
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  allMemopads();

