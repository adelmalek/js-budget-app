const addButton = document.querySelector("#add-btn");
const plusOrMinus = document.querySelector("#select");
const description = document.querySelector("#add-description");
const money = document.querySelector("#add-value");

const budgetValue = document.querySelector("#budget-value");
const budgetIncomeValue = document.querySelector("#budget-income-value");
const budgetExpenditureValue = document.querySelector("#budget-expenditure-value");
const budgetExpenditurePercent = document.querySelector("#budget-expenditure-percent");


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

            if (type === "plus") {
                newItem = new Incomes(id, desc, val);
            } else if (type === "minus") {
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
        }
    }
})();


let control = ((bud, ui) => {
    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        let input = ui.getInput();
        let newItem = bud.addItems(input.type, input.dec, input.value);
    })
})(budget, userInterface);