let budget = (() => {
    let a = 10;
    let sum = (b) => {
        return a + b;
    }

    return {
        test: (c) => {
            return sum(c)
        }
    }
})();

let userInterface = (() => {

})();

let control = ((bud, ui) => {
    let num = bud.test(20);
    
    return {
        test: () => {
            console.log(num);
        }
    }
})(budget, userInterface);

control.test();