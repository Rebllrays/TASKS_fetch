// Task 1.
// Создать форму, в которую можно ввести след. информацию: имя пользователя, пароль, подтверждение пароля, админ или нет(можно использовать checkbox) задача: необходимо пользователей сохранять в local storage под ключом users, необходимо реализовать проверки: на уникальность имени и на совпадение паролей

let nameInp = document.querySelector('#name-input');
let passInp = document.querySelector('#password-input');
let passConInp = document.querySelector('#confirm-pass-input');

function initStorage() {
    if(!localStorage.getItem('users-data')) {
        localStorage.setItem('users-data', '[]');
    };
};
initStorage();

function setUsersToStorage(users) {
    localStorage.setItem('users-data', JSON.stringify(users));
};

function getUsersFromStorage() {
    let users = JSON.parse(localStorage.getItem('users-data'));
    return users;
};


function userRegistration() {
    let admin = document.querySelector('#admin').checked; // checkbox

    let userObj = {
        username: nameInp.value,
        password: passInp.value,
        admin: admin
    };

    if(passInp.value !== passConInp.value) {
        alert("Passwords don't match.");
        return;
    }
     
    let users = getUsersFromStorage();
    let isUnique = true;
    users.forEach(item => {
      if (item.username === userObj.username) {
        alert("Name already taken. Please choose another.");
        isUnique = false;
        return;
      }
    });
    if (isUnique) {
      users.push(userObj);
      setUsersToStorage(users);
      alert("User saved successfully!");

      let btnClose = document.querySelector('.btn-close');
      btnClose.click();
    }
};

// Task 2.
// Продолжаем предыдущий проект, создать форму для добавления продуктов в которую можно добавить: название, цену, ссылку на картинку; при нажатии на кнопку СОЗДАТЬ ПРОДУКТ, должна запрашиваться информация о пользователе в модальном окне(имя и пароль), затем необходимо проверить существует ли этот пользователь, подходит ли пароль к данному пользователю и является ли он админом, если все совпадает, добавить продукт в db.json(использовать json-server), также у каждого продукта должно быть поле АВТОР, автора необходимо динамически добавлять самостоятельно, данные можно получить к примеру в момент проверки существует ли пользователь вообще

let titleInp = document.querySelector("#product-title-inp");
let priceInp = document.querySelector("#product-price-inp");
let imgInp =document.querySelector("#product-img-inp");
let btnCreate = document.querySelector('.create-product-btn');

function createProduct() {
    let users = getUsersFromStorage();
    let user = {
        username: prompt("Enter your username"),
        password: prompt("Enter your password")
    };

    let userExists = users.find(item => {
        return item.username === user.username;
    });

    if(!userExists) {
        alert("User doesn't exist");
        return;
    }

    if(userExists.password !== user.password) {
        alert('Wrong password');
        return;
    };

    if(!userExists.admin) {
        alert('Your are not admin!');
        return;
    }

    let product = {
        id:1,
        title: titleInp.value,
        price: priceInp.value,
        imageUrl: imgInp.value, 
        author: user.username
    };

    titleInp.value = "";
    priceInp.value = "";
    imgInp.value = "";



    fetch('http://localhost:8000/product', {
        method: "POST", 
        body: JSON.stringify(product),
        headers: {
            "content-Type": "application/json;charset=utf-8"
        }
    });

    let btnClose = document.querySelector('.btn-close');
    btnClose.click();
}

btnCreate.addEventListener('click', createProduct);


// Task 3.
// Продолжаем предыдущий проект, добавить функцию рендера, которая срабатывает при обновлении страницы по умолчанию, а также запускается при нажатии на кнопку ПОЛУЧИТЬ СПИСОК ПРОДУКТОВ

function render() {
    let container = document.querySelector('.container');

    container.innerHTML ="";
    fetch('http://localhost:8000/product')
        .then(result => result.json())
        .then(users  => {
            users.forEach(item =>{
                container.innerHTML += `<div class="card m-1" style="width: 18rem; id = "${item.id}" ">
                <img src="${item.imageUrl}" class="card-img-top" alt="error:(" style="width: 250; height: 250">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-price"><b>Price: $</b>${item.price}</p>
                  <p class="card-author"><b>Author: </b>${item.author}</p>
                  <a href="#" class="btn btn-danger delete-product-btn">Delete</a>
                  <a href="#" class="btn btn-secondary update-product-btn" data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop">Update</a>
                </div>
              </div>`
            })
        });

        addUpdateEvent();
}
render();
let getProduct = document.querySelector("#get-product");
getProduct.addEventListener('click', render);

// Продолжаем предыдущий проект, добавить возможность редактирования продуктов, у каждого продукта должна быть кнопка РЕДАКТИРОВАТЬ, при нажатии на которую данные о продукте попадают в форму(можно использовать форму, которая предназначалась для создания продукта, можно создать отдельную, также можно использовать модалку), затем при нажатии на кнопку СОХРАНИТЬ ИЗМЕНЕНИЯ продукт должен быть изменен и страница должна заново отрисовать все продукты


function updateProduct(e) {
    e.preventDefault();
    fetch('http://localhost:8000/product/id', {
        method: "PATCH", 
        body: JSON.stringify(id),
        headers: {
            "content-Type": "application/json;charset=utf-8"
        }
    });
}

function addUpdateEvent() {
    let updateBtns = document.querySelectorAll('.update-product-btn');
    updateBtns.forEach(item => item.addEventListener('click', updateProduct));
}


// Продолжаем предыдущий проект, у каждого продукта должна быть кнопка УДАЛИТЬ, при нажатии кнопку, продукт должен быть удален, также необходимо вызвать рендер для отображения изменений

function deleteProduct() {
    fetch(`http://localhost:8000/products/id`, {
        method: 'DELETE'
    })
    render();
};
function addDeleteEvent() {
    let delBtns = document.querySelectorAll('.delete-product-btn');
    delBtns.addEventListener('click', deleteProduct);
}