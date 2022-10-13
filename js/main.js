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
                    <div class="item" id="incomes-${obj.id}">
                        <div class="item-description">${obj.des}</div>
                        <div class="right">
                            <div class="item-value">${obj.val} &euro;</div>
                            <div class="item-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M18.05 33.05 24 27l6 6.05 2.35-2.4-5.95-6.05 5.95-6.05-2.35-2.4-6 6.05-5.95-6.05-2.4 2.4 6 6.05-6 6.05Zm-5 8.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-21.9 0V39Z"/></svg>
                            </div>
                        </div>
                    </div>
                `
            } else if (type === "minus") {
                expenditureList.innerHTML += `
                    <div class="item" id="expenditures-${obj.id}">
                        <div class="item-description">${obj.des}</div>
                        <div class="right">
                            <div class="item-value">${obj.val} &euro;</div>
                            <div class="item-percent">21%</div>
                            <div class="item-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M18.05 33.05 24 27l6 6.05 2.35-2.4-5.95-6.05 5.95-6.05-2.35-2.4-6 6.05-5.95-6.05-2.4 2.4 6 6.05-6 6.05Zm-5 8.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-21.9 0V39Z"/></svg>
                            </div>
                        </div>
                    </div>
                `
            }
        },
        initInputField: function() {
            description.value = "";
            money.value = "";
            description.focus();
        }
    }
})();


let updateAmount = function() {
    // 5. költségvetés összeszámolása
    budget.calcTotal();

    // 6. összeg visszaadása
    let allAmount = budget.getAllAmount();

    // 7. össszeg megjelenítése a felületen
    console.log(allAmount);
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
})(budget, userInterface);