export function chain(value){
    return {
        then: (f) => chain(f(value)),
        result: value
    }
}


// WEBPACK FOOTER //
// src/utils/utils.js