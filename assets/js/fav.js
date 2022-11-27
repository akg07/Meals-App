console.log('loaded fav.js');
let favList;
if(! JSON.parse(localStorage.getItem('list'))) {
    favList = [52877];
    localStorage.setItem('list', JSON.stringify(favList));
}else {
    favList = JSON.parse(localStorage.getItem('list'));
}


// add and remove from favriote list
const addFavList = (id) => {

    console.log(id);
    const elementId = "addFavList-" + id;
    const favBtn = document.getElementById(elementId);
    
    console.log(favBtn.dataset.fav);
    let favValue = favBtn.dataset.fav;
    // add in favList
    if(favValue == "no"){
        favBtn.src = "./assets/images/red-heart.png";

        console.log(favList);

        favList.push(id);
        localStorage.setItem('list', JSON.stringify(favList));
        favBtn.setAttribute("data-fav", "yes");
        
        // console.log(favList);
        
    }
    // remove from fav List
    else {
        favBtn.src = "./assets/images/white-heart.png"

        favList = JSON.parse(localStorage.getItem('list'));
        
        favList = favList.filter(foodId => {
            return foodId !== id;
        });
        
        localStorage.setItem('list', JSON.stringify(favList));
        favBtn.setAttribute("data-fav", "no");
    }
}

//show the fav list in fav page
const showFavList = () => {
    console.log('show fav list');
    const listSection = document.getElementById('favListItems');

    for(let i=0; i<favList.length; i++) {
        const foodId = Number(favList[i]);
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`)
                .then((res) => res.json())
                .then((data) => {
                    const food = data.meals;
                    food.map((element) => {
                        const foodContainer = document.createElement("div");
                        foodContainer.setAttribute("class", "col col-style");
                        const foodName = element.strMeal;
                        const foodImg = element.strMealThumb;
                        const foodId = element.idMeal;
                        // const isFav = favFoodList.filter(favId => {
                        //                 if(Number(foodId) === favId) return true;
                        //                 return false;
                        //             })
                        let foodDiv = `<div class="card card-style " style="width: 14rem;">
                                            <img class="card-img-top" src="${foodImg}" alt="Card Food Image" onclick="getmealDetails(${foodId})">
                                            <div class="card-body">
                                                <h6 class="card=text" onclick="getmealDetails(${foodId})">${foodName}</h6>
                                                <div id="favIcon">
    
                                                    <img id="addFavList-${foodId}" onclick="addFavList(${foodId})" src="./assets/images/red-heart.png" alt="Empty heart" width="25" height="25" />
                                                </div>
                                            </div>
                                        </div>`;
                        
                        foodContainer.innerHTML = foodDiv;
                        listSection.appendChild(foodContainer);
                    });
                })
                .catch((error) => {
                    console.log('error', error);
                    mealListSection.innerHTML = `Sorry, Don't have ${searchFoodName} in our Database try something else!`;
                });
    }

}