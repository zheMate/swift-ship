const cityRegionList = document.getElementById('city_region_list');
const cityRegionSearch = document.getElementById('city_region_search');
const fullScreenDiv = document.getElementById('fullscreen-div');
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const modalBtns = document.getElementById('modal-btns');
const modalForm = document.getElementById('modal');
const orderBookList = document.querySelector('#order-book-list tbody');
const saveButton = document.getElementById('save-btn');

// const addressingNameForValidation = document.getElementById('addr_ing_name');
// const firstNameForValidation = document.getElementById('first_name');
// const lastNameForValidation = document.getElementById('last_name');
// const emailForValidation = document.getElementById('email');
// const phoneForValidation = document.getElementById('phone');
// const streetAddrForValidation = document.getElementById('street_addr');
// const postalCodeForValidation = document.getElementById('postal_code');
// const cityRegionForValidation = document.getElementById('city_region');
// const labelsForValidation = document.getElementById('labels');


// значение по умолчанию
let addrName = firstName = lastName = email = phone = streetAddr = postCode = cityAndRegion = labels = "";

// класс для структуризации данных необходимых для хранения
class Order {
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
    static getOrders() {
        //из local storage
        let orders;
        if (localStorage.getItem('orders') == null) {
            orders = [];
        }
        else {
            orders = JSON.parse(localStorage.getItem('orders'));
        }
        return orders;
    }
    static addOrder(order) {
        const orders = Order.getOrders();
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    static deleteOrder(id) {
        const orders = Order.getOrders();
        orders.forEach((order, index) => {
            if (order.id == id) {
                orders.splice(index, 1);
            }
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        modalForm.reset();
        UI.closeModal();
        orderBookList.innerHTML = "";
        UI.showOrderList();
    }
    static updateOrder(newItem) {
        const orders = Order.getOrders();
        orders.forEach(order => {
            if (order.id == newItem.id) {
                order.addrName = newItem.addrName;
                order.firstName = newItem.firstName;
                order.lastName = newItem.lastName;
                order.email = newItem.email;
                order.phone = newItem.phone;
                order.streetAddr = newItem.streetAddr;
                order.postCode = newItem.postCode;
                order.cityAndRegion = newItem.cityAndRegion;
                order.labels = newItem.labels;
            }
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        orderBookList.innerHTML = "";
        UI.showOrderList();
    }
}

// Пользовательский интерфейс
class UI {
    static showOrderList() {
        const orders = Order.getOrders();
        orders.forEach(order => UI.addToOrderList(order));
    }
    static addToOrderList(order) {
        const tableRow = document.createElement('tr');
        tableRow.setAttribute('data-id', order.id);
        tableRow.innerHTML = `
        <td>${order.id}</td>
        <td>
            <span class="addressing-name">
                ${order.addrName}
            </span>
            <br>
            <span class="address">${order.streetAddr + ", " + order.postCode + ", г. " + order.cityAndRegion}</span>
        </td>
        <td>
            <span>
                ${order.labels}
            </span>
        </td>
        <td>
            ${order.firstName + " " + order.lastName}
        </td>
        <td>
            ${order.phone}
        </td>
        `;
        orderBookList.appendChild(tableRow);
    }
    static showModalData(id) {
        const orders = Order.getOrders();
        orders.forEach(order => {
            if (order.id == id) {
                modalForm.addr_ing_name.value = order.addrName;
                modalForm.first_name.value = order.firstName;
                modalForm.last_name.value = order.lastName;
                modalForm.email.value = order.email;
                modalForm.phone.value = order.phone;
                modalForm.street_addr.value = order.streetAddr;
                modalForm.postal_code.value = order.postCode;
                modalForm.city_region.value = order.cityAndRegion;
                modalForm.labels.value = order.labels;
                document.getElementById('modal-title').innerHTML = "Изменить детали заказа";
                document.getElementById('modal-btns').innerHTML = `
                <button type = "submit" id = "update-btn" data-id = "${id}" >Обновить</button> 
                <button type = "button" id = "delete-btn" data-id = "${id}" >Удалить</button>
                `;
            }
        });
    }
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
    UI.showOrderList();
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
            if (!isFormValid) {
                saveButton.disabled = true;
            }
            else {
                saveButton.disabled = false;
                let allItem = Order.getOrders();
                let lastItemId = (allItem.length > 0) ? allItem[allItem.length - 1].id : 0;
                lastItemId++;
                const orderItem = new Order(lastItemId,
                    addrName,
                    firstName,
                    lastName,
                    email,
                    phone,
                    streetAddr,
                    postCode,
                    cityAndRegion,
                    labels);
                Order.addOrder(orderItem);
                UI.closeModal();
                UI.addToOrderList(orderItem);
                modalForm.reset();
            }
        }
    });
    orderBookList.addEventListener('click', (event) => {
        UI.showModal();
        let trElement;
        if (event.target.parentElement.tagName == "TD") {
            trElement = event.target.parentElement.parentElement;
        }
        if (event.target.parentElement.tagName == "TR") {
            trElement = event.target.parentElement;
        }
        let viewID = trElement.dataset.id;
        UI.showModalData(viewID);
    });
    //удаление заказа
    modalBtns.addEventListener('click', (event) => {
        if (event.target.id == 'delete-btn') {
            Order.deleteOrder(event.target.dataset.id);
        }
    });
    //обновление заказа
    modalBtns.addEventListener('click', (event) => {
        if (event.target.id == 'update-btn') {
            let id = event.target.dataset.id;
            let isFormValid = getFormData();
            if (!isFormValid) {
                alert('Введите корректные данные для обновления !');
            }
            else {
                const orderItem = new Order(id, addrName, firstName, lastName, email, phone, streetAddr, postCode, cityAndRegion, labels);
                Order.updateOrder(orderItem);
                UI.closeModal();
                modalForm.reset();
            }
        }
    });
}

function loadJSONOfCityAndRegions() {
    fetch('js/russia.json')
        .then(response => response.json())
        .then(data => {
            let html = "";
            data.forEach(cityAndRegion => {
                html += `<option value='${cityAndRegion.city}'> ${cityAndRegion.city}, ${cityAndRegion.region}  </option>`;
            });
            cityRegionList.innerHTML = html;
        })
}


// Получение данных с формы
function getFormData() {
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

    const addressingNameForValidation = modalForm.addr_ing_name.value.trim();
    const firstNameForValidation = modalForm.first_name.value.trim();
    const lastNameForValidation = modalForm.last_name.value.trim();
    const emailForValidation = modalForm.email.value.trim();
    const phoneForValidation = modalForm.phone.value.trim();
    const streetAddressForValidation = modalForm.street_addr.value.trim();
    const postalCodeForValidation = modalForm.postal_code.value.trim();
    

    const setError = (element, message) => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }
    const isValidEmail = email => {
        const re = /^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    }
    const isValidPhone = phone => {
        const re = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return re.test(phone);
    }

    if (addressingNameForValidation === '') {
        inputValidStatus[0] = false;
        setError(modalForm.addr_ing_name, 'Имя получателя, обязательное поле');
    }
    else {
        inputValidStatus[0] = true;
        setSuccess(modalForm.addr_ing_name);
        addrName = modalForm.addr_ing_name.value;
    }
    if (firstNameForValidation === '') {
        inputValidStatus[1] = false;
        setError(modalForm.first_name, 'Имя, обязательное поле');
    }
    else {
        inputValidStatus[1] = true;
        setSuccess(modalForm.first_name);
        firstName = modalForm.first_name.value;
    }
    if (lastNameForValidation === '') {
        inputValidStatus[2] = false;
        setError(modalForm.last_name, 'Фамилия, обязательное поле');
    }
    else {
        inputValidStatus[2] = true;
        lastName = modalForm.last_name.value;
        setSuccess(modalForm.last_name);
    }
    if (emailForValidation === '') {
        inputValidStatus[3] = false;
        setError(modalForm.email, 'Email, обязательное поле');
    }
    else if (!isValidEmail(emailForValidation)) {
        inputValidStatus[3] = false;
        setError(modalForm.email, 'Введите корректный Email');
    }
    else {
        inputValidStatus[3] = true;
        email = modalForm.email.value;
        setSuccess(modalForm.email);
    }

    if (phoneForValidation === '') {
        inputValidStatus[4] = false;
        setError(modalForm.phone, 'Телефон, обязательное поле');
    }
    else if (!isValidPhone(phoneForValidation)) {
        inputValidStatus[4] = false;
        setError(modalForm.phone, 'Введите корректный номер');
    }
    else {
        inputValidStatus[4] = true;
        phone = modalForm.phone.value;
        setSuccess(modalForm.phone);
    }
    if (streetAddressForValidation === '') {
        inputValidStatus[5] = false;
        setError(modalForm.street_addr, 'Адрес, обязательное поле');
    }
    else {
        inputValidStatus[5] = true;
        streetAddr = modalForm.street_addr.value;
        setSuccess(modalForm.street_addr);
    }
    if (postalCodeForValidation === '') {
        inputValidStatus[6] = false;
        setError(modalForm.postal_code, 'Почтовый индекс, обязательное поле');
    }
    else {
        inputValidStatus[6] = true;
        postCode = modalForm.postal_code.value;
        setSuccess(modalForm.postal_code);
    }
    cityAndRegion = modalForm.city_region.value;
    labels = modalForm.labels.value;
    return inputValidStatus.includes(false) ? false : true;
}

