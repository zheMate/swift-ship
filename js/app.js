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
    modalBtns.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.id == "save-btn") {
            let isFormValid = getFormData();
        }
    });
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


// Получение данных с формы
function getFormData(){
    let inputValidStatus = [];
  /*   console.log(
        modalForm.addr_ing_name.value,  
        modalForm.first_name.value, 
        modalForm.last_name.value, 
        modalForm.email.value, 
        modalForm.phone.value, 
        modalForm.street_addr.value, 
        modalForm.postal_code.value, 
        modalForm.city_region.value, 
        modalForm.labels.value); */

    if(!strRegex.test(modalForm.addr_ing_name.value) || modalForm.addr_ing_name.value.trim().length == 0){
        addErrMsg(modalForm.addr_ing_name);
        inputValidStatus[0] = false;
    } else {
        addrName = modalForm.addr_ing_name.value;
        inputValidStatus[0] = true;
    }

    if(!strRegex.test(modalForm.first_name.value) || modalForm.first_name.value.trim().length == 0){
        addErrMsg(modalForm.first_name);
        inputValidStatus[1] = false;
    } else {
        firstName = modalForm.first_name.value;
        inputValidStatus[1] = true;
    }

    if(!strRegex.test(modalForm.last_name.value) || modalForm.last_name.value.trim().length == 0){
        addErrMsg(modalForm.last_name);
        inputValidStatus[2] = false;
    } else {
        lastName = modalForm.last_name.value;
        inputValidStatus[2] = true;
    }

    if(!emailRegex.test(modalForm.email.value)){
        addErrMsg(modalForm.email);
        inputValidStatus[3] = false;
    } else {
        email = modalForm.email.value;
        inputValidStatus[3] = true;
    }

    if(!phoneRegex.test(modalForm.phone.value)){
        addErrMsg(modalForm.phone);
        inputValidStatus[4] = false;
    } else {
        phone = modalForm.phone.value;
        inputValidStatus[4] = true;
    }

    if(!(modalForm.street_addr.value.trim().length > 0)){
        addErrMsg(modalForm.street_addr);
        inputValidStatus[5] = false;
    } else {
        streetAddr = modalForm.street_addr.value;
        inputValidStatus[5] = true;
    }

    if(!digitRegex.test(modalForm.postal_code.value)){
        addErrMsg(modalForm.postal_code);
        inputValidStatus[6] = false;
    } else {
        postCode = modalForm.postal_code.value;
        inputValidStatus[6] = true;
    }

    if(!strRegex.test(modalForm.city_region.value) || modalForm.city_region.value.trim().length == 0){
        addErrMsg(modalForm.city_region);
        inputValidStatus[7] = false;
    } else {
        city_region = modalForm.city_region.value;
        inputValidStatus[7] = true;
    }
    labels = modalForm.labels.value;
    return inputValidStatus.includes(false) ? false : true;
}

function addErrMsg(inputBox){
    inputBox.classList.add('errorMsg');
}