export function chain(value){
    return {
        then: (f) => chain(f(value)),
        result: value
    }
}

export function numberArray(length){
    const arr = [];
    for(let i=0; i<length; i++){
        arr.push(i);
    }
    return arr;
}


// WEBPACK FOOTER //
// src/utils/utils.js