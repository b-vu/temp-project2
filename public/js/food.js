$(document).ready(function () {
    const getDate = day => {
        return moment().day(day).format("dddd, MMMM Do YYYY");
    };

    const getMonth = day => {
        return parseInt(moment().day(day).format("M"));
    };

    const getDay = day => {
        return parseInt(moment().day(day).format("D"));
    };

    const getYear = day => {
        return parseInt(moment().day(day).format("YYYY"));
    }

    const foodSearch = $("#food-search");
    const add = $(".add");
    const weeklyTotals = $("#weekly-totals");
    const previousWeeks = $("#previous-weeks");

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

    const displayFoodLog = foodDataArray => {
        let totalCalories = 0;
        let totalFat = 0;
        let totalCarbs = 0;
        let totalSodium = 0;
        let totalCholesterol = 0;

        sunday.empty().append(getDate(0));
        monday.empty().append(getDate(1));
        tuesday.empty().append(getDate(2));
        wednesday.empty().append(getDate(3));
        thursday.empty().append(getDate(4));
        friday.empty().append(getDate(5));
        saturday.empty().append(getDate(6));
        weeklyTotals.empty().append("Weekly Totals:");

        for (const day of foodDataArray) {
            console.log(day);
            totalCalories += Math.round(day.calories);
            totalFat += Math.round(day.fat);
            totalCarbs += Math.round(day.carbs);
            totalSodium += Math.round(day.sodium);
            totalCholesterol += Math.round(day.cholesterol);

            switch (day.dayID.toString()) {
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
    };

    const displayPreviousWeeks = query => {
        $.get(`/api/previous-weeks/${query + "-display"}`, data => {
            let weekCounter = 1;
            const weekCounterArray = [];

            if (!data.length) {
                console.log("no data");
                return;
            }
            else {
                console.log("data");
                for (const foodItem of data) {
                    if (weekCounterArray.indexOf(foodItem.weekID) === -1) {
                        previousWeeks.append(`<br> <p class="previous-weeks" data-week-id="${weekCounter}">Week ${weekCounter}</p>`);
                        weekCounterArray.push(foodItem.weekID);
                        weekCounter++;
                    }
                }
                $(".previous-weeks").on("click", function () {
                    console.log($(this).data("week-id"));
                    const weekID = $(this).data("week-id");

                    $.get(`/api/previous-weeks/${weekID}`, data => {
                        console.log(data);
                        displayFoodLog(data);
                    });
                });
            }
        });
    };

    const initializePage = () => {
        $.get(`/api/currentweek/${week}`, data => {
            console.log(week);
            if (!data.length) {
                weekID = 1;
            }
            else if ((data[data.length - 1].month + data[data.length - 1].day) <= getMonth(6) + getDay(6)) {
                weekID = data[data.length - 1].weekID;
                console.log(weekID);
            }
            else {
                weekID = data[data.length - 1].weekID + 1;
            }
        }).then(data => {
            displayFoodLog(data);
            displayPreviousWeeks(weekID);
        });
    };

    initializePage();

    foodSearch.hide();

    add.on("click", function () {
        foodSearch.show();
        day = $(this).data("day");
    });

    foodSearch.on("submit", event => {
        event.preventDefault();

        const food = $("#food-item").val().trim();
        $("#food-item").val("");

        $.post("/api/food", {
            food: food,
            date: getDate(day),
            month: getMonth(day),
            day: getDay(day),
            year: getYear(day),
            dayID: day,
            weekID: weekID
        }).then(res => {
            location.reload();
        })
    });
});