// регулярки для валидации
const strRegex = /^[a-zA-Z\s]*$/; // проверка на стрингу
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* поддерживаемые форматы номеров - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/; //проверка на цифры


const cityRegionList = document.getElementById('city_region_list');
const cityRegionSearch = document.getElementById('city_region_search');
const fullScreenDiv = document.getElementById('fullscreen-div');
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const modalBtns = document.getElementById('modal-btns');
const modalForm = document.getElementById('modal');
const orderBookList = document.querySelector('#order-book-list tbody');

// значение по умолчанию
let addrName = firstName = lastName = email = phone = streetAddr = postCode = cityAndRegion = labels = "";

class Delivery {
    constructor(id, addrName, firstName, lastName, email, phone, streetAddr, postCode, cityAndRegion, labels) {
        this.id = id;
        this.addrName = addrName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.streetAddr = streetAddr;
        this.postCode = postCode;
        this.cityAndRegion = cityAndRegion;
        this.labels = labels;
    }
}

// Пользовательский интерфейс
class UI {
    constructor(inputId, selectId) {
        this.select = document.getElementById(selectId);
        this.input = document.getElementById(inputId);
    }
    static showModal() {
        modalForm.style.display = "block";
        fullScreenDiv.style.display = "block";
    }
    static searchSelect(input, select) {
        const searchText = input.value.toLowerCase();
        Array.from(select.options).forEach(function (option) {
            if (option.value.toLowerCase().indexOf(searchText) != -1) {
                option.style.display = "";
            } else {
                option.style.display = "none";
            }
        });
    }

    searchCity() {
        const input = this.input;
        const select = this.select;
        input.addEventListener("input", () => {
          UI.searchSelect(input, select);
        });
        // Вызываем функцию поиска по select после загрузки страницы
        UI.searchSelect(input, select);
    }
    static closeModal() {
        modalForm.style.display = "none";
        fullScreenDiv.style.display = "none";
    }
}


// Прогрузка DOM  
window.addEventListener('DOMContentLoaded', () => {
    loadJSONOfCityAndRegions();
    eventListeners();
});

//прослушка событий
function eventListeners() {
    addBtn.addEventListener('click', () => {
        modalForm.reset();
        document.getElementById('modal-title').innerHTML = "Добавьте заказ";
        UI.showModal();
        document.getElementById('modal-btns').innerHTML = `
            <button type = "submit" id = "save-btn"> Сохранить </button>
        `;
        const ui = new UI("city_region_search", "city_region_list");
        ui.searchCity();
    });
     // Добавление события закрытия модального окна
     closeBtn.addEventListener('click', UI.closeModal);
}

function loadJSONOfCityAndRegions() {
    fetch('js/russia.json')
        .then(response => response.json())
        .then(data => {
            let html = "";
            data.forEach(cityAndRegions => {
                html += `<option value='${cityAndRegions.city}'> ${cityAndRegions.city}, ${cityAndRegions.region}  </option>`;
            });
            cityRegionList.innerHTML = html;
        })
}


