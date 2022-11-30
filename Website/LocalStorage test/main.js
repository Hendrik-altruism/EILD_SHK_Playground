//Local Storage

const storageInputLocalKey = document.querySelector('.storageLocalKey')
const storageInputLocal = document.querySelector('.storageLocal')
const textLocal = document.querySelector('.textLocal')
const keyLocal = document.querySelector('.keyLocal')
const addButtonLocal = document.querySelector('.addButtonLocal')
const deleteButtonLocal = document.querySelector('.deleteButtonLocal')
const clearButtonLocal = document.querySelector('.clearButtonLocal')

var key = "Hund_Schferhund_Mops_Dackel__p_n"


updateView()

storageInputLocal.addEventListener('input', letter => {
    textLocal.textContent = letter.target.value;
});

storageInputLocalKey.addEventListener('input', letter => {
    keyLocal.textContent = letter.target.value;
});

const saveToLocalStorage = () => {
    localStorage.setItem(keyLocal.textContent, textLocal.textContent)

    updateView()
}

const deleteFromLocalStorage = () => {
    localStorage.removeItem(keyLocal.textContent)
    updateView()
}

const clearLocalStorage = () => {
    localStorage.clear()

    updateView()
}

function updateView() {
    var s = '<table cellpadding="2" cellspacing="2" border="1">';
    s += '<tr><th>Id</th><th>Key</th><th>Text</th></tr>'
    for (i = 0; i < localStorage.length; i++) {
        s += '<tr>';
        s += '<td>' + i + '</td>';
        s += '<td>' + localStorage.key(i) + '</td>';
        s += '<td>' + localStorage.getItem(localStorage.key(i)) + '</td>';
        s += '</tr>';
    }

    s += '</table>';
    document.getElementById('result').innerHTML = s;
}

addButtonLocal.addEventListener('click', saveToLocalStorage)
deleteButtonLocal.addEventListener('click', deleteFromLocalStorage)
clearButtonLocal.addEventListener('click', clearLocalStorage)

//Session Storage

const storageInputSessionKey = document.querySelector('.storageSessionKey')
const storageInputSession = document.querySelector('.storageSession')
const textSession = document.querySelector('.textSession')
const keySession = document.querySelector('.keySession')
const addButtonSession = document.querySelector('.addButtonSession')
const deleteButtonSession = document.querySelector('.deleteButtonSession')
const clearButtonSession = document.querySelector('.clearButtonSession')

updateViewSession()

storageInputSessionKey.addEventListener('input', letter => {
    keySession.textContent = letter.target.value;
});

storageInputSession.addEventListener('input', letter => {
    textSession.textContent = letter.target.value;
});

const saveToSessionStorage = () => {
    sessionStorage.setItem(keySession.textContent, textSession.textContent)
    updateViewSession()

}

const deleteFromSessionStorage = () => {
    sessionStorage.removeItem(keySession.textContent)
    updateViewSession()
}

const clearSessionStorage = () => {
    sessionStorage.clear()
    updateViewSession()
}

function updateViewSession() {
    var s = '<table cellpadding="2" cellspacing="2" border="1">';
    s += '<tr><th>Id</th><th>Key</th><th>Text</th></tr>'
    for (i = 0; i < sessionStorage.length; i++) {
        s += '<tr>';
        s += '<td>' + i + '</td>';
        s += '<td>' + sessionStorage.key(i) + '</td>';
        s += '<td>' + sessionStorage.getItem(sessionStorage.key(i)) + '</td>';
        s += '</tr>';
    }

    s += '</table>';
    document.getElementById('results').innerHTML = s;
}

addButtonSession.addEventListener('click', saveToSessionStorage)
deleteButtonSession.addEventListener('click', deleteFromSessionStorage)
clearButtonSession.addEventListener('click', clearSessionStorage)