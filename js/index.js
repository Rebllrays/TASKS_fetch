// Save user to local storage
// function saveUser() {
//     var name = document.getElementById("name").value;
//     var password = document.getElementById("password").value;
//     var confirm = document.getElementById("confirm").value;
//     var admin = document.getElementById("admin").checked;
  
//     // Check for unique name
//     if (localStorage.getItem(name)) {
//       alert("Name already taken. Please choose another.");
//       return;
//     }
  
//     // Check for matching passwords
//     if (password != confirm) {
//       alert("Passwords do not match. Please try again.");
//       return;
//     }
  
//     // Save user to local storage
//     var user = { name: name, password: password, admin: admin };
//     var users = JSON.parse(localStorage.getItem("users")) || [];
//     users.push(user);
//     localStorage.setItem("users", JSON.stringify(users));
  
//     alert("User saved successfully!");
//   }

var form = document.createElement('form');
form.innerHTML = '<input type="text" name="username" placeholder="username" required><br>' +
  '<input type="password" name="password" placeholder="password" required><br>' +
  '<input type="password" name="passwordConfirm" placeholder="password confirmation" required><br>' +
  '<input type="checkbox" name="admin" value="admin"><br>' +
  '<input type="submit" value="submit">';
document.body.appendChild(form);
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var username = e.target.elements.username.value;
  var password = e.target.elements.password.value;
  var passwordConfirm = e.target.elements.passwordConfirm.value;
  var admin = e.target.elements.admin.checked;
  var users = JSON.parse(localStorage.getItem('users')) || [];
  var user = {
    username: username,
    password: password,
    admin: admin
  };
  if (password !== passwordConfirm) {
    alert('Passwords do not match');
    return;
  }
  if (users.find(function (item) {
      return item.username === username;
    })) {
    alert('User with this name already exists');
    return;
  }
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  alert('User added');
});

var users = JSON.parse(localStorage.getItem('users')) || [];
var table = document.createElement('table');
table.innerHTML = '<tr><th>Username</th><th>Password</th><th>Admin</th></tr>';
users.forEach(function (user) {
  var tr = document.createElement('tr');
  tr.innerHTML = '<td>' + user.username + '</td><td>' + user.password + '</td><td>' + user.admin + '</td>';
  table.appendChild(tr);
});
document.body.appendChild(table);

var form = document.createElement('form');
form.innerHTML = '<input type="text" name="name" placeholder="name" required><br>' +
  '<input type="number" name="price" placeholder="price" required><br>' +
  '<input type="text" name="image" placeholder="image" required><br>' +
  '<input type="submit" value="submit">';
document.body.appendChild(form);
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var name = e.target.elements.name.value;
  var price = e.target.elements.price.value;
  var image = e.target.elements.image.value;
  var users = JSON.parse(localStorage.getItem('users')) || [];
  var user = {
    username: prompt('Enter username'),
    password: prompt('Enter password')
  };
  var userExists = users.find(function (item) {
    return item.username === user.username;
  });
  if (!userExists) {
    alert('User does not exist');
    return;
  }
  if (userExists.password !== user.password) {
    alert('Wrong password');
    return;
  }
  if (!userExists.admin) {
    alert('You are not an admin');
    return;
  }
  var product = {
    name: name,
    price: price,
    image: image,
    author: user.username
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/products');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(product));
  xhr.onload = function () {
    alert('Product created');
  };
});
  