import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://cart-5fbd3-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemInDb = ref(database, "cart")       //cart name object in which data will be stored
// const auth = ref(database,"auth")           //auth name obj

const input = document.getElementById("input")
const btn = document.getElementById("button")
const shopping = document.getElementById("shopping-list")

function appendToDOM(items) {
    let itemID = items[0]
    let itemValue = items[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    newEl.addEventListener("dblclick", function () {
        let exactLocationOfItemInDB = ref(database, `cart/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shopping.append(newEl)
}
function clearInput() {
    input.value = ""
}

function clearDOM() {
    shopping.innerHTML = ""
}
function addToDatabase() {
    let item = input.value
    push(itemInDb, item)
    clearInput()
    // appendToDOM(item)
}

btn.addEventListener("click", addToDatabase)

input.addEventListener("keypress", function (enter) {
    if (enter.key === "Enter") {
        addToDatabase()
    }
})

onValue(itemInDb, function (snapshot) {
    if (snapshot.exists()) {
        clearDOM()
        let foodarray = Object.entries(snapshot.val())
        for (let i = 0; i < foodarray.length; i++) {
            let items = foodarray[i]
            let itemCode = items[0]
            let itemValue = items[1]
            appendToDOM(items)
        }
    } else {
        console.log("Database can't be Empty")
        shopping.innerHTML = "No items here...yet"
    }
})