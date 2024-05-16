const listCitizen = document.querySelector('.div__container--citizen')
const buttonAddBaned = document.querySelectorAll('.btn_ban')
const listBanned = document.querySelector('.div__getBanned');
const total = document.querySelector('.total');

let banlist = JSON.parse(localStorage.getItem('banlist')) || [];
let buttonDOM = [];


function displayData(data) {
    let result = ""
    data.forEach((item) => {
        result += `
        <div class="card" style="width: 18rem">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${item.username}</h6>
          <p class="card-text">
            ${item.email}
          </p>
          <button data-id="${item.id}" class="btn_ban">Ban</button>
          <button">Another link</button>
        </div>
      </div>
        `
    })
    listCitizen.innerHTML = result

}
async function getAllButton() {
    const buttons = [...document.querySelectorAll(".btn_ban")];
    buttonDOM = buttons
    buttons.forEach(btn => {
        const id = btn.dataset.id

        if (banlist) {
            const dataBanned = banlist.find((item) => item.id === +id)
            if (dataBanned) {
                btn.innerText = "Banned"
                btn.disabled = true;
            }
        }

        btn.addEventListener('click', (e) => {
            let banlist = JSON.parse(localStorage.getItem('banlist')) || [];

            const data = JSON.parse(localStorage.getItem('data'))
            const dataSelected = data.find((item) => item.id === +id)
            const banItem = { ...dataSelected, hour: 1 }

            banlist = [...banlist, banItem]
            setCard(banlist)
            e.target.innerHTML = "Banned";
            e.target.disabled = true;
            addToBanList(banItem)
            console.log(banlist);
        })
    })
}

function savedButton(id) {
    return buttonDOM.find((item) => item.dataset.id === id)
}

function addToBanList(item) {
    const card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `
    <div class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">${item.username}</h6>
    <p class="card-text">
      ${item.email}
      <p class="hour">${item.hour} hours
      
    </p>
    <div>
    <button data-id=${item.id} class="add">Add</button>
    <button data-id=${item.id} class="subtract">Subtract</button>
    </div>
    <button data-id=${item.id} class="delete_btn">x</button>
  </div>
    `
    listBanned.appendChild(card)
}
async function getData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        return data
    } catch (e) {
        console.log(e);
    }
}
function saveData(data) {
    console.log(data);
    localStorage.setItem("data", JSON.stringify(data))
}
function setCard(banlist) {
    localStorage.setItem("banlist", JSON.stringify(banlist));
}
// function getData (id) {
//     const data = JSON.parse(localStorage.getItem('data'))
//     return data.find((item) => item.id === +id)
// }
function linked(banlist) {
    if (banlist) {
        banlist.forEach((e) => addToBanList(e))
    }
}
function removeBan(id) {

    banlist = banlist.filter((item) => item.id !== +id)
    setCard(banlist)
    const data = savedButton(id)
    data.innerText = 'Ban'
    data.disabled = false
}
function bannedButton() {
    listBanned.addEventListener('click', e => {
        const targetElementDelete = e.target.classList.contains("delete_btn");
        if (targetElementDelete) {
            removeBan(e.target.dataset.id)
            listBanned.removeChild(e.target.parentElement.parentElement)
        }
        const targetAdd = e.target.classList.contains("add");
        if (targetAdd) {
            const id = e.target.dataset.id
            let banlist = JSON.parse(localStorage.getItem('banlist')) || [];
            let tempItem = banlist.find(item => item.id === +id);
            tempItem.hour++
            e.target.nextSibling.nextSibling.disabled = false
            e.target.parentElement.previousSibling.previousSibling.innerText = `${tempItem.hour} hours`
            setCard(banlist)

        }
        const targetDiscard = e.target.classList.contains("subtract");
        // console.log(targetDiscard);
        if (targetDiscard) {
            const id = e.target.dataset.id
            console.log(id);
            let banlist = JSON.parse(localStorage.getItem('banlist')) || [];

            let tempItem = banlist.find(item => item.id === +id);
            if (tempItem.hour >= 1) {
                tempItem.hour--
                e.target.disabled = false
                
                e.target.parentElement.previousSibling.previousSibling.innerText = `${tempItem.hour} hours`
                setCard(banlist)
            } else if(tempItem.hour <= 1) {

                e.target.disabled = true
                removeBan(id)
                e.target.parentElement.previousSibling.previousSibling.innerText = `${tempItem.hour} hours`
                console.log(e.target.parentElement.parentElement.parentElement);
                // listBanned.removeChild(e.target.parentElement.parentElement.parentElement)

            }
        }
    })
}
function setTotal() {

}
document.addEventListener("DOMContentLoaded", async () => {

    const data = await getData();
    const dataBan = JSON.parse(localStorage.getItem('banlist'))
    banlist = dataBan
    linked(banlist)
    saveData(data)
    displayData(data)
    getAllButton()
    bannedButton()

})
