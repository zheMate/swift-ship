const cityRegionList = document.getElementById('city_region_list');
const fullScreenDiv = document.getElementById('fullscreen-div');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('save-btn');
const closeBtn = document.getElementById('close-btn');
const modalBtns = document.getElementById('modal-btns');
const modalForm = document.getElementById('modal');
const orderBookList = document.querySelector('#order-book-list tbody');


class Delivery {
    constructor(id, addrName, firstName, lastName, email, phone, streetAddr, postCode, city, region, labels){
        this.id = id;
        this.addrName = addrName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.streetAddr = streetAddr;
        this.postCode = postCode;
        this.city = city;
        this.region = region;
        this.labels = labels;
    }
}
