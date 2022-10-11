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
    let Incomes = function(id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val
    };

    let Expenditures = function(id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val;
    };

    let datas = {
        descriptions: {
            plus: [],
            minus: []
        },
        values: {
            plus: [],
            minus: []
        }
    };

    return {
        addItems: function(type, desc, val) {
            let newItem;
            let id;

            if (datas.descriptions[type].length > 0) {
                id = datas.descriptions[type][datas.descriptions[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            if (type === "plus" &&  desc.trim().length > 0) {
                newItem = new Incomes(id, desc, val);
            } else if (type === "minus" && desc.trim().length > 0) {
                newItem = new Expenditures(id, desc, val);
            }

            datas.descriptions[type].push(newItem);

            return newItem;
        },
        test: function() {
            console.log(datas);
        }
    }

})();


let userInterface = (() => {
    return {
        getInput: () => {
            return {
                type: plusOrMinus.value,
                dec: description.value,
                value: money.value
            }
        },
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


let control = ((bud, ui) => {
    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        let input = ui.getInput();
        let newItem = bud.addItems(input.type, input.dec, input.value);
        ui.displayItems(newItem, input.type);
        ui.initInputField();
    })
})(budget, userInterface);