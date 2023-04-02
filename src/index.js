const baseUrl = 'https://api.github.com/search/users?q=';
const perPage = 10;
let page = 1;

getSavedUsers()
searchUsers()

searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  searchUsers()
})

function searchUsers() {
  let query = document.getElementById('username').value

  if (!query) {
    query = 'a'
  }

  axios.get(` ${baseUrl}${query}&page=${page}&per_page=${perPage}`).then((response) => {
    cards.innerHTML = '';
    let cardItems = ``;
    if (response.data.items.length !== 0) {
      emptyUsers.style.visibility = "hidden";
      response.data.items.forEach((user) => {
        cardItems += cardUser(user)
      });
      cardItems += nextPageCard()
      cards.innerHTML = cardItems;
    } else {
      cards.innerHTML = ''
      emptyUsers.style.visibility = "visible";
    }
    page = getNextPage(response.headers.link);

    console.log(page)
    console.log(response.headers.link.getLinkByRel('next'))
  }
  )
}

function nextPageCard() {
  return `
  <button class="btn" onclick="searchUsers()">
      <i class="ph-fill ph-arrow-right"></i>
    </button>
  `
}

function cardUser(user) {
  return (
    `<div class="card">
      <img
        src="${user.avatar_url}"
        alt="developer avatar"
      />
      <div class="content">
        <h3>${user.login}</h3>
        <div class="github">
            <button class="btn primary" onclick="saveUser('${user.login}', '${user.avatar_url}', '${user.html_url}')">
             <i class="ph-fill ph-git-branch"></i>
              Save profile
            </button>
        </div>
      </div>
  </div>`
  );
}

function cardUserSaved(user) {
  return (
    `<div class="card">
      <img
        src="${user.avatar_url}"
        alt="developer avatar"
      />
      <div class="content">
        <h3>${user.login}</h3>
        <div class="github">
          <a class="btn" href="${user.html_url}" style="height: 40px; width: 40px;">
             <i class="ph-fill ph-git-branch"></i>
          </a>
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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'User already saved!',
      })
      return;
    }
  }

  savedUsers.push(newUser);

  window.localStorage.setItem('users', JSON.stringify(savedUsers));

  getSavedUsers()
}


function getSavedUsers() {
  const savedUsersObject = JSON.parse(window.localStorage.getItem('users'));

  if (!savedUsersObject) {
    return;
  }

  let cardItems = ``;

  savedUsersObject.forEach((user) => {
    cardItems += cardUserSaved(user);
  })

  if (cardItems) {
    emptySavedUsers.style.visibility = "hidden"
    savedCards.innerHTML = cardItems;
  }
  else {
    emptySavedUsers.style.visibility = "visible"
  }
}

function getNextPage(link) {
  const getNextLink = (relValue) => link.getLinkByRel(relValue)?.match(/&page=(\d+)/)[1];
  const nextPage = getNextLink('next') || getNextLink('first');
  return nextPage ? parseInt(nextPage, 10) : null;
}

String.prototype.getLinkByRel = function (relValue) {
  const link = this.split(',').find((l) => l.includes(`rel="${relValue}"`));
  return link ? link.match(/<(.*)>/)[1] : null;
}