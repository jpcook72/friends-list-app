async function fetchData(type, url, data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: type, // *GET, POST, PUT, DELETE, etc.
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
    try {
      await fetchData('POST','/api/friends', {'newFriend': jsonVal});
    }
    catch(err) {
      console.log('Error -- ' + err);
      input.placeholder = 'Sorry...'
    } 
    input.value = null;
    populateDropdown();
}

const plusFriend = async (friend) => {
    let newFriend = {
        'name': friend.name,
        'rating': friend.rating + 1
    }
    await fetchData('PUT',`/api/friends/${friend.id}`, newFriend);
    populateDropdown();
}

const minusFriend = async (friend) => {
    let newFriend = {
        'name': friend.name,
        'rating': friend.rating - 1
    }
    await fetchData('PUT',`/api/friends/${friend.id}`, newFriend);
    populateDropdown();
}

const deleteFriend = async(friend) => {
  await fetchData('DELETE', `/api/friends/${friend.id}`, {'id' : friend.id });
  populateDropdown();
}

const renderFriends = (data) => {

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

const addButtonListeners = (data,...args) => {
  [...args].forEach( str => { 
    const func = eval(`${str}Friend`);
    [...document.getElementsByClassName(str)].forEach(elem => {
    elem.addEventListener('click', () => 
      func(data.find( friend => `${str}${friend.id}` === `${elem.id}`)))})});
}

const populateDropdown = async() => {
    try {
      const result = await fetch('/api/friends');
      const data = await result.json();
      renderFriends(data.sort((a,b) => a.rating >= b.rating ? -1 : 1));

      addButtonListeners(data, 'plus', 'minus', 'delete');
      document.getElementById('submitButton').addEventListener('click', submitName);
    }
    catch(err) {
        console.log('Error -- ' + err.message);
    }
}

populateDropdown();

