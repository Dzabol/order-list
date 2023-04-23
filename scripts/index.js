import { menuArray } from "../data/menu.js";


onPageLoad();

function onPageLoad() {
    renderMenu();
}

function renderMenu() {
    const menuContainer = document.getElementById("menu");
    let menuList = ``;

    for (let dish of menuArray) {
        menuList += `
        <div class="food-container">
        <div class="dishes-container">
          <img src="./Images/Menu/${dish.image}" class="dish-picture" />
          <div class="food-description">
            <p class="food-name">${dish.name}</p>
            <p class="food-ingridientList">${prepareIngredients(dish)}</p>
            <p class="food-price">$${dish.price}</p>
          </div>
        </div>
        <div class="button-container">
          <button class="addOrRemobeButton">+</button>
          <input type="text" name="" id="" value="0" />
          <button class="addOrRemobeButton">-</button>
        </div>
      </div>
      `
    }
    menuContainer.innerHTML = menuList;
}

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