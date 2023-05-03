import { menuArray } from "../data/menu.js";
let orderedDishesList = [];

function onPageLoad() {
  renderMenu();
}

onPageLoad();

//======================== BUTTONS ================================
const exitButton = document.getElementById("exit-button");
const orderForm = document.getElementById("formOrder-container");

exitButton.addEventListener('click', closeOrderWindow);

orderForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const consentFormData = new FormData(orderForm)

  const ordererData = {
    name: consentFormData.get("orderingPerson"),
    cardNumber: consentFormData.get("cardNumber"),
    cvv: consentFormData.get("cvv"),
    order: orderedDishesList.slice(),
  }

  orderListHandler(ordererData.order, "erase");
  afterOrder(ordererData);
  orderForm.reset();
  return ordererData;
});

document.addEventListener('click', function (event) {
  let clickedElement = event.target.dataset;
  if (clickedElement.add) {                                       //add 1 dish
    handleAddOrRemoveDishToOrder(clickedElement.add, +1);
  }
  else if (clickedElement.substract) {                            //remove 1 dish
    handleAddOrRemoveDishToOrder(clickedElement.substract, -1);
  }
  else if (clickedElement.remove) {                               //remove dish from order list
    handleAddOrRemoveDishToOrder(clickedElement.remove, 0);
  }

  if (orderedDishesList.length) {
    const orderButton = document.getElementById("orderButton");
    orderButton.addEventListener('click', openOrderWindow)
  }

})



/** ================= RENDER ===================*/

function renderMenu() {
  const menuContainer = document.getElementById("menu");
  let menuList = ``;

  for (let dish of menuArray) {
    menuList += `
        <div class="food-container">
        <div class="dishes-container">
          <img src="../Images/Menu/${dish.image}" class="dish-picture" alt="${dish.alt}"/>
          <div class="food-description">
            <p class="food-name">${dish.name}</p>
            <p class="food-ingridientList">${prepareIngredients(dish)}</p>
            <p class="food-price">$${dish.price}</p>
          </div>
        </div>
        <div class="button-container">
          <button class="addOrRemobeButton" data-add="${dish.id}">+</button>
          <input type="text" class="orderNumber-input" data-input="${dish.id}" value="0" />
          <button class="addOrRemobeButton" data-substract="${dish.id}">-</button>
        </div>
      </div>
      `
  }
  menuContainer.innerHTML = menuList;
}

function renderNumberOfOrdersInMenuList(dishId, dishObject) {
  const inputBox = document.querySelector(`input[data-input="${dishId}"]`);
  inputBox.value = parseInt(dishObject.numberOfOrers);
}

function renderOrderList(menuArray) {
  let orderHTML = ``;
  let orderContained = document.getElementById("order-list")
  let numberOfOrders = 0;

  menuArray.forEach(dish => {
    if (dish.numberOfOrers != 0) {
      numberOfOrders++;
      orderHTML +=
        `
    <div class="orderedItem-container data-orderedDish="${dish.id}">
    <div class="orderedDish">
      <p>${dish.numberOfOrers}x ${dish.name}</p>
      <button class="remove-button" data-remove ="${dish.id}">remove</button>
    </div>
    <p class="food-price">$${dish.totalPrice}</p>
  </div>
    `
    }
  });
  hideShowOrderList(numberOfOrders);
  renderTotalPrice(menuArray);
  orderContained.innerHTML = orderHTML;
}

function renderTotalPrice(menuArray) {
  const priceBox = document.getElementById("totalPrice");
  let orderTotalPrice = 0;

  menuArray.forEach(dish => {
    if (dish.totalPrice) {
      orderTotalPrice += dish.totalPrice
    }
  })
  priceBox.textContent = `$${orderTotalPrice}`
}

function hideShowOrderList(orderedItems) {
  const orderListContainer = document.getElementById("ordered-container");

  if (orderedItems > 0) {
    orderListContainer.style.display = "block";
  }
  else {
    orderListContainer.style.display = "none";
  }
}

//======================== Order Handlers ================================

function handleAddOrRemoveDishToOrder(dishId, valueOfOrder) {
  const dishObject = menuArray.filter(function (dish) {
    return dish.id.toString() === dishId.toString()
  })[0] //remove array and set only object

  switch (parseInt(valueOfOrder)) {
    case 0:
      {
        dishObject.numberOfOrers = valueOfOrder;
        orderListHandler(dishId, "remove");
      }
      break;

    case 1:
      {
        dishObject.numberOfOrers++;
        orderListHandler(dishId, "add");
      }
      break;

    case (valueOfOrder > 1):
      {
        dishObject.numberOfOrers = valueOfOrder;
        orderListHandler(dishId, "add");

      }
      break;

    case -1:
      {
        if (dishObject.numberOfOrers > 1) {
          dishObject.numberOfOrers--;

        }
        else if (dishObject.numberOfOrers === 1) {
          dishObject.numberOfOrers--;
          orderListHandler(dishId, "remove");
        }
      }
      break;

    default:
      console.log("Invalid input.");
      break;
  }
  dishObject.totalPrice = dishObject.price * dishObject.numberOfOrers;
  renderNumberOfOrdersInMenuList(dishId, dishObject);
  renderOrderList(menuArray);
}

function orderListHandler(dishID, addOrRemoveOrErase) {
  const isInOrderList = orderedDishesList.includes(dishID);

  switch (addOrRemoveOrErase) {
    case "add":
      if (!isInOrderList) {
        orderedDishesList.push(dishID);
      }
      break;

    case "remove":
      if (isInOrderList) {
        menuArray.find((dishInMenu) => {
          if (dishInMenu.id === dishID) {
            dishInMenu.numberOfOrers = 0;
            dishInMenu.totalPrice = 0;
          }
        });
        const indexInArray = orderedDishesList.findIndex(element => element === dishID);
        orderedDishesList.splice(indexInArray, 1);
      }
      break;

    case "erase":
      dishID.forEach((id) => {
        menuArray.find((dishInMenu) => {
          if (dishInMenu.id === parseInt(id)) {
            dishInMenu.numberOfOrers = 0;
            dishInMenu.totalPrice = 0;
          }
        });
      })
      orderedDishesList.length = 0;
      break;

    default:
      console.log("Invalid input.");
      break;
  }
}

//======================== OTHER ================================

function prepareIngredients(dishObject) {
  let ingridientList = "";
  let numberOfIngridients = dishObject.ingredients.length
  let counter = 0;
  for (let ingridient of dishObject.ingredients) {
    counter++;
    ingridientList += ingridient
    if (counter < numberOfIngridients) {
      ingridientList += ", "
    }
  }
  return ingridientList
}

function openOrderWindow() {
  document.getElementById("orderForm-container").style.display = "flex";
}

function closeOrderWindow() {
  document.getElementById("orderForm-container").style.display = "none";
}

function afterOrder(orderInformation) {
  const messageWindow = document.getElementById("afterOrderWindow");
  messageWindow.innerHTML = `
  <p>Thanks, ${orderInformation.name}! Your order is on its way!</p>`;
  messageWindow.style.display = "flex";

  closeOrderWindow();
  renderMenu();
  hideShowOrderList(orderedDishesList);

  setTimeout(function () {
    messageWindow.style.display = "none"
  }, 5500)
}




