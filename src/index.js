const baseUrl = 'https://api.github.com/search/users?q=';
const perPage = 10;
let page = 1;

getSavedUsers()

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  searchUsers()
})

function searchUsers() {
  let query = document.getElementById('username').value


  fetch(` ${baseUrl}${query}&page=${page}&per_page=${perPage}`)
    .then((response) => response.json())
    .then((users) => {
      cards.innerHTML = '';
      let cardItems = ``;
      if (users.items.length !== 0) {
        emptyUsers.style.visibility = "hidden";
        users.items.forEach((user) => {
          cardItems += cardUser(user)
        });
        cards.innerHTML = cardItems;
      } else {
        cards.innerHTML = ''
        emptyUsers.style.visibility = "visible";
      }
    })
    ;

}

function cardUser(user, message = 'Save profile', defaultAction = `saveUser('${user.login}', '${user.avatar_url}', '${user.html_url}')`) {
  return (
    `<div class="card">
      <img
        src="${user.avatar_url}"
        alt="developer avatar"
      />
      <div class="content">
        <h3>${user.login}</h3>
        <div class="github">
            <button class="btn primary" onclick="${defaultAction}">
             <i class="ph-fill ph-git-branch"></i>
              ${message}
            </button>
        </div>
      </div>
  </div>`
  );
}

function saveUser(login, avatar_url, html_url) {

  let savedUsers = [];

  const newUser = {
    login: login,
    avatar_url: avatar_url,
    html_url: html_url,
  };

  const savedUsersJson = window.localStorage.getItem('users');

  if (savedUsersJson) {
    savedUsers = JSON.parse(savedUsersJson);

    if (savedUsers.some((user) => user.login === login)) {
      alert('User already saved');
      return;
    }
  }

  savedUsers.push(newUser);

  window.localStorage.setItem('users', JSON.stringify(savedUsers));

  getSavedUsers()
}


function getSavedUsers() {
  const savedUsersObject = JSON.parse(window.localStorage.getItem('users'));

  let cardItems = ``;

  savedUsersObject.forEach((user) => {
    cardItems += cardUser(user, '', '');
  })
  if (cardItems) {
    emptySavedUsers.style.visibility = "hidden"
    savedCards.innerHTML = cardItems;
  }
  else {
    emptySavedUsers.style.visibility = "visible"
  }

  console.log(savedUsersObject)
}