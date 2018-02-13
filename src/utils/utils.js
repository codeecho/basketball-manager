export function chain(value){
    return {
        then: (f) => chain(f(value)),
        result: value
    }
}