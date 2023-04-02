// регулярки для валидации
const strRegex = /^[а-яА-Я\s]*$/; // проверка на стрингу
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
                modalForm.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            }
            else {
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
                modalForm.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
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

    if (!strRegex.test(modalForm.addr_ing_name.value) || modalForm.addr_ing_name.value.trim().length == 0) {
        addErrMsg(modalForm.addr_ing_name);
        inputValidStatus[0] = false;
    } else {
        addrName = modalForm.addr_ing_name.value;
        inputValidStatus[0] = true;
    }

    if (!strRegex.test(modalForm.first_name.value) || modalForm.first_name.value.trim().length == 0) {
        addErrMsg(modalForm.first_name);
        inputValidStatus[1] = false;
    } else {
        firstName = modalForm.first_name.value;
        inputValidStatus[1] = true;
    }

    if (!strRegex.test(modalForm.last_name.value) || modalForm.last_name.value.trim().length == 0) {
        addErrMsg(modalForm.last_name);
        inputValidStatus[2] = false;
    } else {
        lastName = modalForm.last_name.value;
        inputValidStatus[2] = true;
    }

    if (!emailRegex.test(modalForm.email.value)) {
        addErrMsg(modalForm.email);
        inputValidStatus[3] = false;
    } else {
        email = modalForm.email.value;
        inputValidStatus[3] = true;
    }

    if (!phoneRegex.test(modalForm.phone.value)) {
        addErrMsg(modalForm.phone);
        inputValidStatus[4] = false;
    } else {
        phone = modalForm.phone.value;
        inputValidStatus[4] = true;
    }

    if (!(modalForm.street_addr.value.trim().length > 0)) {
        addErrMsg(modalForm.street_addr);
        inputValidStatus[5] = false;
    } else {
        streetAddr = modalForm.street_addr.value;
        inputValidStatus[5] = true;
    }

    if (!digitRegex.test(modalForm.postal_code.value)) {
        addErrMsg(modalForm.postal_code);
        inputValidStatus[6] = false;
    } else {
        postCode = modalForm.postal_code.value;
        inputValidStatus[6] = true;
    }

    if (!strRegex.test(modalForm.city_region.value) || modalForm.city_region.value.trim().length == 0) {
        addErrMsg(modalForm.city_region);
        inputValidStatus[7] = false;
    } else {
        cityAndRegion = modalForm.city_region.value;
        inputValidStatus[7] = true;
    }
    labels = modalForm.labels.value;
    return inputValidStatus.includes(false) ? false : true;
}

function addErrMsg(inputBox) {
    inputBox.classList.add('errorMsg');
}