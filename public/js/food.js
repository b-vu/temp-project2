$(document).ready(function () {
    const getDate = day => {
        return moment().day(day).format("dddd, MMMM Do YYYY");
    };

    const getMonth = day => {
        return moment().day(day).format("M");
    };

    const getDay = day => {
        return moment().day(day).format("D");
    };

    const displayPastWeeks = () => { //move out of the get route later so it's not constantly running everytime the get route runs
        $.get(`/api/pastweeks/${weekID}`, data => {
            console.log(data);

            if(!data.length){
                console.log("no data");
                return;
            }
            else{
                console.log("data");
                for(const foodItem of data){
                    pastWeeks.append(`<br>${foodItem.food_item}`);
                }
            }
        })
    };

    const foodSearch = $("#food-search");
    const add = $(".add");
    const weeklyTotals = $("#weekly-totals");
    const pastWeeks = $("#past-weeks");

    const sunday = $("#sunday");
    const monday = $("#monday");
    const tuesday = $("#tuesday");
    const wednesday = $("#wednesday");
    const thursday = $("#thursday");
    const friday = $("#friday");
    const saturday = $("#saturday");

    const week = getMonth(0) + "-" + getDay(0) + "-" + getMonth(6) + "-" + getDay(6);
    let day;
    let weekID;

    let totalCalories = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalSodium = 0;
    let totalCholesterol = 0;

    $.get(`/api/${week}`, data => {
        console.log(data);
        if(!data.length){
            weekID = 1;
        }
        else{
            weekID = data[0].weekID;
        }

        for(const day of data){
            console.log(day);
            totalCalories += Math.round(day.calories);
            totalFat += Math.round(day.fat);
            totalCarbs += Math.round(day.carbs);
            totalSodium += Math.round(day.sodium);
            totalCholesterol += Math.round(day.cholesterol);

            switch (day.dayID.toString()){
                case "0":
                    sunday.append(`<br> ${day.food_item} - ${Math.round(day.calories)} calories, ${Math.round(day.fat)} g fat, ${Math.round(day.carbs)} g carbs, ${Math.round(day.sodium)} mg sodium, ${Math.round(day.cholesterol)} mg cholesterol`);
                    break;

                case "1":
                    monday.append(`<br> ${day.food_item} - ${Math.round(day.calories)} calories, ${Math.round(day.fat)} g fat, ${Math.round(day.carbs)} g carbs, ${Math.round(day.sodium)} mg sodium, ${Math.round(day.cholesterol)} mg cholesterol`);
                    break;

                case "2":
                    tuesday.append(`<br> ${day.food_item} - ${Math.round(day.calories)} calories, ${Math.round(day.fat)} g fat, ${Math.round(day.carbs)} g carbs, ${Math.round(day.sodium)} mg sodium, ${Math.round(day.cholesterol)} mg cholesterol`);
                    break;

                case "3":
                    wednesday.append(`<br> ${day.food_item} - ${Math.round(day.calories)} calories, ${Math.round(day.fat)} g fat, ${Math.round(day.carbs)} g carbs, ${Math.round(day.sodium)} mg sodium, ${Math.round(day.cholesterol)} mg cholesterol`);
                    break;

                case "4":
                    thursday.append(`<br> ${day.food_item} - ${Math.round(day.calories)} calories, ${Math.round(day.fat)} g fat, ${Math.round(day.carbs)} g carbs, ${Math.round(day.sodium)} mg sodium, ${Math.round(day.cholesterol)} mg cholesterol`);
                    break;

                case "5":
                    friday.append(`<br> ${day.food_item} - ${Math.round(day.calories)} calories, ${Math.round(day.fat)} g fat, ${Math.round(day.carbs)} g carbs, ${Math.round(day.sodium)} mg sodium, ${Math.round(day.cholesterol)} mg cholesterol`);
                    break;

                default:
                    saturday.append(`<br> ${day.food_item} - ${Math.round(day.calories)} calories, ${Math.round(day.fat)} g fat, ${Math.round(day.carbs)} g carbs, ${Math.round(day.sodium)} mg sodium, ${Math.round(day.cholesterol)} mg cholesterol`);
            }
        }
        weeklyTotals.append(`<br>${totalCalories} calories <br>${totalFat} g fat <br>${totalCarbs} g carbs <br>${totalSodium} mg sodium <br>${totalCholesterol} mg cholesterol`);
        displayPastWeeks();
    });

    foodSearch.hide();

    add.on("click", function() {
        foodSearch.show();
        day = $(this).data("day");
    });

    foodSearch.on("submit", event => {
        event.preventDefault();

        const food = $("#food-item").val().trim();
        $("#food-item").val("");


        $.post("/api/food", {
            url: queryURL,
            food: food,
            date: getDate(day),
            month: getMonth(day),
            day: getDay(day),
            dayID: day,
            weekID: weekID
        }).then(res => {
            console.log(res);
            location.reload();
        })
    });

    sunday.append(getDate(0));
    monday.append(getDate(1));
    tuesday.append(getDate(2));
    wednesday.append(getDate(3));
    thursday.append(getDate(4));
    friday.append(getDate(5));
    saturday.append(getDate(6));
});