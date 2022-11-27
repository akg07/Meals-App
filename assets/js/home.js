const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
const mealListSection = document.getElementById("meal-list-section");

const favFoodList = JSON.parse(localStorage.getItem('list'));

// click on any button on keyboard
inputBox.onkeyup = (e) => {
    let userData = e.target.value;
    let suggestionsArray = [];

    if(userData) {
        suggestionsArray = suggestions.filter((data) => {
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });

        suggestionsArray = suggestionsArray.map((data) => {
            return data = `<li>${data}</li>`;
        });


        searchWrapper.classList.add("active");
        showSuggestions(suggestionsArray);

        let allList = suggBox.querySelectorAll("li");
        for(let i=0; i<allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else {
        searchWrapper.classList.remove("active");
    }
}

function select(element) {
    let selectData = element.textContent;
    inputBox.value = selectData;

    searchWrapper.classList.remove("active");
}

// show suggesstions while typing on search bar
function showSuggestions(list) {
    let listData;
    if(!list.length) {
        let userData = inputBox.value;
        listData = `<li>${userData}</li>`;
    }else {
        listData = list.join('');
    }

    suggBox.innerHTML = listData;
}


// after clicking on search icon call api and show result
const getSearchValue = () => {
    const autoCompleteBox = document.getElementById("autoComplete");
    suggBox.innerHTML = "";

    const searchFoodName = inputBox.value;
    
    if(!searchFoodName) {
        mealListSection.innerHTML = "<h1> Please type food name in search bar</h1>";
    }else {
        mealListSection.innerHTML = "";

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchFoodName}`)
            .then((res) => res.json())
            .then((data) => {
                const food = data.meals;
                food.map((element) => {
                    const foodContainer = document.createElement("div");
                    foodContainer.setAttribute("class", "col col-style");
                    const foodName = element.strMeal;
                    const foodImg = element.strMealThumb;
                    const foodId = element.idMeal;
                    const isFav = favFoodList.filter(favId => {
                                    if(Number(foodId) === favId) return true;
                                    return false;
                                });

                    let faVIconImage;
                    let favString;
                    if(isFav.length != 0) {
                        // it's fav food
                        faVIconImage = "./assets/images/red-heart.png";
                        favString = "yes";
                    }else {
                        // it's not a fav food
                        faVIconImage = "./assets/images/white-heart.png";
                        favString = "no";
                    }

                    const foodDiv = `<div class="card card-style " style="width: 14rem;">
                                        <img class="card-img-top" src="${foodImg}" alt="Card Food Image" onclick="getmealDetails(${foodId})">
                                        <div class="card-body">
                                            <h6 class="card=text" onclick="getmealDetails(${foodId})">${foodName}</h6>
                                            <div id="favIcon">
                                                <img id="addFavList-${foodId}" onclick="addFavList(${foodId})" src=${faVIconImage} alt="Empty heart" width="25" height="25" data-fav=${favString} />
                                            </div>
                                        </div>
                                    </div>`;

                    foodContainer.innerHTML = foodDiv;
                    mealListSection.appendChild(foodContainer);
                });
            })
            .catch((error) => {
                console.log('error', error);
                mealListSection.innerHTML = `Sorry, Don't have ${searchFoodName} in our Database try something else!`;
            });
    }
}

const getmealDetails = (id) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => {
            const food = data.meals;
            food.map((element) => {
                const foodImg = element.strMealThumb;
                const foodDetailsContainer = document.createElement("div");
                const foodDetailsDiv = `<div class="card p-4 w-50 shadow-lg rounded-3" id="food-desc">
                                            <img src="${foodImg}" alt="Food Card image>
                                            <div class="card-body"">
                                                <h4 class="card-title">${element.strMeal}</h4>
                                                <h5>Ingredient</h5>
                                                <h6 class="card-text"> 1: ${element.strIngredient1}</h6> <h6 class="card-text"> 2: ${element.strIngredient2}</h6>
                                                <h6 class="card-text"> 3: ${element.strIngredient3}</h6> <h6 class="card-text"> 4: ${element.strIngredient4}</h6> 
                                                <h6 class="card-text"> 5: ${element.strIngredient5}</h6> <h6 class="card-text"> 6: ${element.strIngredient6}</h6>
                                                <h6 class="card-text"> 7: ${element.strIngredient7}</h6> <h6 class="card-text"> 8: ${element.strIngredient8}</h6>
                                                <h6 class="card-text"> 9: ${element.strIngredient9}</h6> <h6 class="card-text"> 10: ${element.strIngredient10}</h6>
                                                <button class="btn btn-info"  onclick="backHome()" id="back-search"> < Back</button>
                                            </div>
                                        </div>`;
                foodDetailsContainer.innerHTML = foodDetailsDiv;
                document.getElementById("food-detail").appendChild(foodDetailsContainer);
                document.getElementById("searched-foods").style.display = "none";
            });
        });
}

const backHome = () => {
    document.getElementById("searched-foods").style.display = "block";
    document.getElementById("food-detail").innerHTML = "";
    document.getElementById("meal-list-section").innerHTML = "";
    inputBox.value = "";
    suggBox.innerHTML = "";
}