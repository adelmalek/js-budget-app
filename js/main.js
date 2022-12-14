/***********
DOM ELEMENTS
***********/
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

const date = document.querySelector(".budget-month");


/***********
MODUL BUDGET
***********/
let budget = (() => {
    // constructor
    let Incomes = function(id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val
    };

    // constructor
    let Expenditures = function(id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val;
        this.percent = -1;
    };

    // calculation of percentages
    Expenditures.prototype.percentageCalc = function(totalIncome) {
        if (totalIncome > 0) {
            this.percent = Math.round(this.val / totalIncome * 100);
        } else {
            this.percent = -1;
        }
    };

    // read out percentage for the given item
    Expenditures.prototype.getPercentage = function() {
        return this.percent;
    }

    // data
    let data = {
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

    // sum of total income and expenditure
    let calculationOfTotalAmount = function(type) {
        let amount = data.descriptions[type].map(x => x.val).reduce((acc, next) => acc + next, 0);
        data.values[type] = amount;
    };

    return {
        // add item
        addItems: function(type, desc, val) {
            let newItem;
            let id;

            // create id
            if (data.descriptions[type].length > 0) {
                id = data.descriptions[type][data.descriptions[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // create income or expendes
            if (type === "plus" &&  desc.trim().length > 0) {
                newItem = new Incomes(id, desc, val);
            } else if (type === "minus" && desc.trim().length > 0) {
                newItem = new Expenditures(id, desc, val);
            }

            // add income or expendes to data
            data.descriptions[type].push(newItem);

            // return nem item
            return newItem;
        },
        // calculation of budget
        calcTotal: function() {
            // sum of total income and expenditure
            calculationOfTotalAmount("plus");
            calculationOfTotalAmount("minus");

            // calculation of budget
            data.budget = data.values.plus - data.values.minus;

            // calculation of percentages
            if (data.values.plus > 0) {
                data.percent = Math.round(data.values.minus / data.values.plus * 100);
            } else {
                data.percent = -1;
            }
        },
        // get budget
        getAllAmount: function() {
            return {
                budget: data.budget,
                totalPlus: data.values.plus,
                totalMinus: data.values.minus,
                percent: data.percent
            }
        },
        // delete item from data
        deleteItem: function(type, id) { 
            // all ID
            let indexOfAllItem = data.descriptions[type].map(obj => obj.id);
            // ID of item to delete
            let indexOfItem = indexOfAllItem.indexOf(id);
            // delete item
            if (indexOfItem !== -1) {
                data.descriptions[type].splice(indexOfItem , 1);
            }
        },
        // calculation of percentages
        calcPercentages: function() {
            return data.descriptions.minus.map(x => x.percentageCalc(data.values.plus));
        },
        // query percentages
        queryPercentages: function() {
            let expendesPercentages = data.descriptions.minus.map(y => y.getPercentage());
            return expendesPercentages;
        },
        // tesztel??s
        test: function() {
            console.log(data);
        }
    }
})();


/*******
MODUL UI
*******/
let userInterface = (() => {
    // formatting numbers
    let numberFormat = function(number) {
        number = Math.abs(number);
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
    };

    return {
        // getting input data
        getInput: () => {
            return {
                type: plusOrMinus.value,
                dec: description.value,
                value: Number(parseFloat(money.value).toFixed(2))
            }
        },
        // display items in ui
        displayItems: (obj, type) => {
            if (type === "plus") {
                incomeList.innerHTML += `
                    <div class="item" id="plus-${obj.id}">
                        <div class="item-description">${obj.des}</div>
                        <div class="right">
                            <div class="item-value">+ ${numberFormat(obj.val)}</div>
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
                            <div class="item-value">- ${numberFormat(obj.val)}</div>
                            <div class="item-percent"></div>
                            <button class="item-delete" id="item-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
                            </button>
                </form>
                        </div>
                    </div>
                `
            }
        },
        // init input fields
        initInputField: function() {
            description.value = "";
            money.value = "";
            description.focus();
        },
        // display budget
        displayBudget: function(amount) {
            let sign;
            amount.budget > 0 ? sign = "+" : amount.budget === 0 ? sign = "" : sign = "-";
            budgetValue.innerHTML = `${sign} ${numberFormat(amount.budget)}`;
            budgetIncomeValue.innerHTML = `+ ${numberFormat(amount.totalPlus)}`;
            budgetExpenditureValue.innerHTML = `- ${numberFormat(amount.totalMinus)}`;
            if (amount.percent > 0) {
                budgetExpenditurePercent.innerHTML = `${amount.percent} %`;
            } else {
                budgetExpenditurePercent.innerHTML = "-";
            }
        },
        // remove item
        removeItem: function(id) {
            let item = document.getElementById(id);
            // delete a child of an element
            item.parentNode.removeChild(item);
        },
        // display percentages
        displayPercentages: function(percentages) {
            let items = document.querySelectorAll(".item-percent");
            for (let i = 0; i < percentages.length; i++) {
                if (percentages[i] > 0) {
                    items[i].innerHTML = percentages[i] + " %";
                } else {
                    items[i].innerHTML = "-";
                }
            }
        },
        // month and year
        displayDate: function() {
            let months =  [
                "January", "February", "March", "April", 
                "May", "June", "July", "August", "September", 
                "October", "November", "December"
            ];

            let now = new Date;
            let monthIndex = now.getMonth();
            let month = months[monthIndex];
            let year = now.getFullYear();

            date.innerHTML = month + " " + year;
        },
        // change of item type
        changeOfItemType: function() {
            addButton.classList.toggle("red-btn");
            plusOrMinus.classList.toggle("red");
            description.classList.toggle("red");
            money.classList.toggle("red");
        }
    }
})();


let updateAmount = function() {
    // 1. calculation of budget
    budget.calcTotal();
    // 2. get budget
    let allAmount = budget.getAllAmount();
    // 3. display budget in ui
    userInterface.displayBudget(allAmount);
};


let updatePercent = function() {
    // 1. recalculating percentages
    budget.calcPercentages();
    // 2. reading percentages from the budget
    let expendesPercentages = budget.queryPercentages();
    // 3. update ui with new percentages
    userInterface.displayPercentages(expendesPercentages);
}


/************
MODUL CONTROL
************/
let control = ((bud, ui) => {
    // add a new item
    addButton.addEventListener("click", (e) => {
        e.preventDefault();

        // 1. getting input data
        let input = ui.getInput();

        if ( (input.dec.trim().length > 0) && (input.value > 0 && !isNaN(input.value)) ) {
            // 2. transfer input to budget modul
            let newItem = bud.addItems(input.type, input.dec, input.value);
            // 3. display item
            ui.displayItems(newItem, input.type);
            // 4. clear input fields
            ui.initInputField();
            // 5. updates
            updateAmount();
            updatePercent();
            bud.test();
        }  
    })
    
    // delete item
    container.addEventListener("click", (e) => {
        if (e.target.closest(".item-delete")) {
            // 1. find ID of item
            let itemId = e.target.parentNode.parentNode.parentNode.id;
            if (itemId) {
                let splitItemId = itemId.split("-");
                let type = splitItemId[0];
                let id = Number(splitItemId[1]);
                // 2. delete item from data
                bud.deleteItem(type, id);
                // 3. remove item from ui
                ui.removeItem(itemId);
                // 4. updates
                updateAmount();
                updatePercent();
            }
        }
    })

    // change of item type
    plusOrMinus.addEventListener("change", ui.changeOfItemType)

    // display date
    ui.displayDate();

})(budget, userInterface);