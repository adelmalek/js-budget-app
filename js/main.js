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
        this.id = is;
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
            allIncomes: [],
            allExpenditures: []
        },
        values: {
            allIncomes: [],
            allExpenditures: []
        }
    };

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
        console.log(input);
    })
})(budget, userInterface);