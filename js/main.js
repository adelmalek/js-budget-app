const addButton = document.querySelector("#add-btn");
const plusOrMinus = document.querySelector("#select");
const description = document.querySelector("#add-description");
const money = document.querySelector("#add-value");

const budgetValue = document.querySelector("#budget-value");
const budgetIncomeValue = document.querySelector("#budget-income-value");
const budgetExpenditureValue = document.querySelector("#budget-expenditure-value");
const budgetExpenditurePercent = document.querySelector("#budget-expenditure-percent");

const incomeList = document.querySelector("#income-list");
const expenditureList = document.querySelector("#expenditure-list");

const container = document.querySelector("#container");


let budget = (() => {
    // bevételek adattároló
    let Incomes = function(id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val
    };

    // kiadások adattároló
    let Expenditures = function(id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val;
    };

    // bevételek és kiadások leírása és értéke
    let datas = {
        descriptions: {
            plus: [],
            minus: []
        },
        values: {
            plus: 0,
            minus: 0
        },
        budget: 0,
        percent: -1
    };

    // bevételek és kiadások összegének kiszámítása
    let calculationOfTotalAmount = function(type) {
        let amount = datas.descriptions[type].map(x => x.val).reduce((acc, next) => acc + next, 0);
        datas.values[type] = amount;
    };

    return {
        // adatok hozzáadása
        addItems: function(type, desc, val) {
            let newItem;
            let id;

            // id létrehozása
            if (datas.descriptions[type].length > 0) {
                id = datas.descriptions[type][datas.descriptions[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // bevétel vagy kiadás létrehozása
            if (type === "plus" &&  desc.trim().length > 0) {
                newItem = new Incomes(id, desc, val);
            } else if (type === "minus" && desc.trim().length > 0) {
                newItem = new Expenditures(id, desc, val);
            }

            // bevétel vagy kiadás hozzáadása az őket tartalmazó tömbhöz
            datas.descriptions[type].push(newItem);

            // új tétel visszaadása
            return newItem;
        },
        // bevételek és kiadások összeszámolása
        calcTotal: function() {
            // összes bevétel és összes kiadás számolása
            calculationOfTotalAmount("plus");
            calculationOfTotalAmount("minus");

            // költségvetés kiszámolása
            datas.budget = datas.values.plus - datas.values.minus;

            // százelék számolása
            if (datas.values.plus > 0) {
                datas.percent = Math.round(datas.values.minus / datas.values.plus * 100);
            } else {
                datas.percent = -1;
            }
        },
        // költségvetés visszaadása
        getAllAmount: function() {
            return {
                budget: datas.budget,
                totalPlus: datas.values.plus,
                totalMinus: datas.values.minus,
                percent: datas.percent
            }
        },
        // a törölt tételt el kell távolítani a datas struktúrából
        deleteItem: function(type, id) { 
            // console.log(type, id);
            let keres = datas.descriptions[type].filter(x => x.id === id);
            console.log(keres)
            // delete datas.descriptions[type].keres
            console.log(datas);
        },
        test: function() {
            console.log(datas);
        }
    }
})();


let userInterface = (() => {
    return {
        // input adatok megszerzése
        getInput: () => {
            return {
                type: plusOrMinus.value,
                dec: description.value,
                value: Number(parseFloat(money.value).toFixed(2))
            }
        },
        // adatok megjelenítése a felületen
        displayItems: (obj, type) => {
            if (type === "plus") {
                incomeList.innerHTML += `
                    <div class="item" id="plus-${obj.id}">
                        <div class="item-description">${obj.des}</div>
                        <div class="right">
                            <div class="item-value">${obj.val} &euro;</div>
                            <button class="item-delete" id="item-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
                            </button>
                        </div>
                    </div>
                `
            } else if (type === "minus") {
                expenditureList.innerHTML += `
                    <div class="item" id="minus-${obj.id}">
                        <div class="item-description">${obj.des}</div>
                        <div class="right">
                            <div class="item-value">${obj.val} &euro;</div>
                            <div class="item-percent">21%</div>
                            <button class="item-delete" id="item-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
                            </button>
                </form>
                        </div>
                    </div>
                `
            }
        },
        initInputField: function() {
            description.value = "";
            money.value = "";
            description.focus();
        },
        displayBudget: function(amount) {
            budgetValue.innerHTML = `${amount.budget} €`;
            budgetIncomeValue.innerHTML = `${amount.totalPlus} €`;
            budgetExpenditureValue.innerHTML = `${amount.totalMinus} €`;
            if (amount.percent > 0) {
                budgetExpenditurePercent.innerHTML = `${amount.percent} %`;
            } else {
                budgetExpenditurePercent.innerHTML = "-";
            }
        },
        removeItem: function(id) {
            let item = document.getElementById(id);
            item.parentNode.removeChild(item);
        }
    }
})();


let updateAmount = function() {
    // 5. költségvetés összeszámolása
    budget.calcTotal();

    // 6. összeg visszaadása
    let allAmount = budget.getAllAmount();

    // 7. össszeg megjelenítése a felületen
    userInterface.displayBudget(allAmount);
};


let control = ((bud, ui) => {
    addButton.addEventListener("click", (e) => {
        e.preventDefault();

        // 1. bevitt adatok megszerzése
        let input = ui.getInput();

        if ( (input.dec.trim().length > 0) && (input.value > 0 && !isNaN(input.value)) ) {
            // 2. adatok átadása a budget modulnak
            let newItem = bud.addItems(input.type, input.dec, input.value);

            // 3. adatok megjelenítése
            ui.displayItems(newItem, input.type);

            // 4. beviteli mezők kiürítése
            ui.initInputField();

            // 5. költségvetés összeszámolása
            // 6. összeg visszaadása
            // 7. össszeg megjelenítése a felületen
            updateAmount();

            bud.test();
        }  
    })
    
    // 1. eseménykezelő a törlés gombhoz
    container.addEventListener("click", (e) => {
        if (e.target.closest(".item-delete")) {
            // 2. típus kinyerése
            // 3. id kinyerése
            let item = e.target.parentNode.parentNode.parentNode.id;
            if (item) {
                let splitItem = item.split("-");
                let type = splitItem[0];
                let id = Number(splitItem[1]);
                bud.deleteItem(type, id);
                ui.removeItem(item);
                updateAmount();
            }
        }
    });
})(budget, userInterface);

// 3. a törölt tételt törölni kell a felhasználói felületről
// 4. költségvetés újraszámolása
// 5. költségvetés frissítése a felületen
