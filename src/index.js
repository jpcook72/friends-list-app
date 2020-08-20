async function putData(url, data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

async function postData(url, data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function deleteData(url, data = {}) {
  const response = await fetch(url, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const submitName = async () => {
    let input = document.getElementById('submitValue');
    let jsonVal = input.value === null ? '' : input.value;
    await postData('/api/friends', {'newFriend': jsonVal});
    input.value = null;
    populateDropdown();
}

const incRating = async (friend) => {
    let newFriend = {
        'name': friend.name,
        'rating': friend.rating + 1
    }
    await putData(`/api/friends/${friend.id}`, newFriend);
    populateDropdown();
}

const decRating = async (friend) => {
    let newFriend = {
        'name': friend.name,
        'rating': friend.rating - 1
    }
    await putData(`/api/friends/${friend.id}`, newFriend);
    populateDropdown();
}

const deleteFriend = async(friend) => {
  await deleteData(`/api/friends/${friend.id}`, {'id' : friend.id });
  populateDropdown();
}

const makeFriend = (data) => {

    const newDiv = `<div>
      ${data.map(friend =>
            `<h4>${friend.name}</h4>
            <div id='flexDiv'>
              <button class='minus' id='minus${friend.id}'>-</button>
              <h5 id='friend${friend.id}'>${friend.rating}</h6>
              <button class='plus' id='plus${friend.id}'}>+</button>
              <button class='delete' id='delete${friend.id}'}>Delete</button>
            </div>`).join('')}
    </div>`

    const list = document.getElementById('friendList')
    list.innerHTML = newDiv;
}

const populateDropdown = async() => {
    try {
      const result = await fetch('/api/friends');
      const data = await result.json();
      makeFriend(data.sort((a,b) => a.id < b.id ? -1 : 1));

      [...document.getElementsByClassName('plus')].forEach(plus => {
        plus.addEventListener('click', () => incRating(data.find( friend => `plus${friend.id}` === `${plus.id}`)))});
      [...document.getElementsByClassName('minus')].forEach(minus => {
        minus.addEventListener('click', () => decRating(data.find( friend => `minus${friend.id}` === `${minus.id}`)))});
      [...document.getElementsByClassName('delete')].forEach(del => {
        del.addEventListener('click', () => deleteFriend(data.find( friend => `delete${friend.id}` === `${del.id}`)))});

      document.getElementById('submitButton').addEventListener('click', submitName);
    }
    catch(err) {
        next(err);
    }
}

populateDropdown();

