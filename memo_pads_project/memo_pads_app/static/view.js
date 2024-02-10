import {reloadTinyMCE} from "./reloadTinyMce.js";

// Open Gallery Finction
const openGallery = (imageSrc)  => {
    const galleryModalBox = document.querySelector('.galleryModalBox')
    modalImage.src = imageSrc;
    galleryModalBox.style.display = 'flex';

}

// Edit memo pad fu
const editMemoPadPost = (memopadid) => {
    console.log('to jest POST ', memopadid);

    const detailsMemoPad = document.querySelector('.editMemoPadModalBox2')
    const title = detailsMemoPad.querySelector('#title').value
    const note = tinymce.activeEditor.getContent();
    const image = detailsMemoPad.querySelector('#image').files[0]
    const category = detailsMemoPad.querySelector('#category-select')
    const selectedCategoryId = category.options[category.selectedIndex].value
    const selectedCategoryText = category.options[category.selectedIndex].text
    const categoryUpdate = {"id": "", "category": ""}
    const csrfToken = document.head.querySelector("[name~=csrf_token][content]").content;
    const owner = document.querySelector('.user').id

    console.log('selectedCategoryText ', selectedCategoryText);
    console.log("New Category");
    console.log(selectedCategoryText == "New Category");
    if (selectedCategoryText == "New Category") {
        const newCategoryInput = document.querySelector('#category-input').value
        fetch('http://127.0.0.1:8000/categoryapi/', {
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
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.id);
            console.log(data.category);
            categoryUpdate['id'] = data.id
            categoryUpdate['category']= data.category
            console.log('update ', categoryUpdate);
        })
        .catch(error => console.error('error POST category:', error));
        console.log('Działa Nowa kateogira!?');
    } else {
        categoryUpdate = {'id': selectedCategoryId, "category": selectedCategoryText}
    }
    console.log("New category  fetch ",categoryUpdate);

    // Jak nadpisać zmiany na stronie. Co zrobić po porawnym wykonaniu requesta.
    // PROBLEM Z synchronizacją tworzenia kategorii i updatu całej notatki
    // Czy funckja nie musi być asynchroniczna???
    // Wrzucić w asynchroncizną funkcje powyższe kod.
    fetch(`http://127.0.0.1:8000/memopadsapi/${memopadid}/`, {
        headers: {
            "X-Csrftoken": csrfToken,
            "Content-Type": "application/json"
        },
            method: 'PUT',
            credentials: "same-origin",
            body: JSON.stringify({
                "id": memopadid,
                "category": categoryUpdate,
                "title": title,
                "note": note,
                "image": image,
                "owner": owner
            })
        })
        console.log('Działa!?');
    }

const details = (memoPadId) => {
    // Show memopad details function
    console.log(memoPadId);
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
        console.log('category imput');
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

            template.querySelector(`option[value="${memopad.category.id}"]`).selected = true
            
            
        })

    
    document.body.append(template)
    reloadTinyMCE();


    // Dopisać fetcha, który pobierze szczegóły notatki. I wyświetli użytkownikowi.
    // Następnie da możliwość edycji, zapisania zmian lub usunięcia.
    // Zastanowić się jak przedstawić okienko edycji
    // Append chil powinno być w formie -> sprawdź kod HTML 
}

// Upload all user memopads

// fetch("http://127.0.0.1:8000/memopadsapi/")
//     .then(data => data.json())
//     .then(data => {
//         sessionStorage.clear()
//         const allCategories = []
//         data.forEach(memoPad => {
//             const template = document.createElement('div');
//             template.innerHTML = `
//             <div class="memopadbox">

//                 <div class="memopadbox-descbox">
//                     <div class="memopadbox-descbox-title"></div>
//                     <a href=""> <input class="edit-button" type="button" value="Edit"> </a>
//                     <div class="memopadbox-descbox-category"></div>
//                 </div>
        
//                 <div class="memopadbox-details">
//                     <div class="memopadbox-details-notes"></div>
//                     <img class="memopadbox-details-image" src="" alt="Memo Image" loading="lazy">
//                 </div>
        
//             </div>`;
//             template.querySelector('a').href = memoPad.id
//             template.querySelector('.memopadbox-descbox-title').textContent = memoPad.title;
//             template.querySelector('.memopadbox-descbox-category').textContent = memoPad.category;
//             allCategories.push(memoPad.category)
//             template.querySelector('.memopadbox-details-notes').innerHTML = memoPad.note;
//             if (memoPad.image == null) {
//                 template.querySelector('.memopadbox-details-image').remove()
//             } else {
//                 template.querySelector('.memopadbox-details-image').src = memoPad.image;
//                 template.querySelector('.memopadbox-details-image').addEventListener('click', (e) => {
//                     openGallery(template.querySelector('.memopadbox-details-image').getAttribute('src'))
//                     e.stopPropagation()
//                 })
//             };

//             const memopadbox = template.querySelector(".memopadbox")
//             memopadbox.style.cursor = 'pointer'
//             memopadbox.addEventListener('click', () => {
//                 details(memoPad.id)
//             })
//             document.body.append(template)

//         });
//         sessionStorage.setItem('allCategories', JSON.stringify(allCategories))
//         console.log(sessionStorage.getItem('allCategories'));
//     })
//     .catch(error => {
//         console.error('Error:', error);


//     });

async function fetchData() {
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
              <a href=""> <input class="edit-button" type="button" value="Edit"> </a>
              <div class="memopadbox-descbox-category"></div>
            </div>
            <div class="memopadbox-details">
              <div class="memopadbox-details-notes"></div>
              <img class="memopadbox-details-image" src="" alt="Memo Image" loading="lazy">
            </div>
          </div>`;
          
        template.querySelector('a').href = memoPad.id;
        template.querySelector('.memopadbox-descbox-title').textContent = memoPad.title;
        template.querySelector('.memopadbox-descbox-category').textContent = memoPad.category;
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
      console.log(sessionStorage.getItem('allCategories'));
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  fetchData();



// const memopadbox