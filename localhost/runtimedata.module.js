// here 'runtimedata' is stored
// this is data that only exists at the runtime
// usually its arrays of objects representing stuff
// objects can be named and then exported
// import {
//     O_person
// } from "./classes.module.js"

// let o_person__hans = new O_person(
//     'hans', 
//     80,
// );
// // also arrays of objects can be exported
// let a_o_person = [
//     o_person__hans, 
//     new O_person()// if you dont need the named object
//     // 'unnamed' objects can always be accessed with a_o.find(o=>...)
// ]
// export {
//     o_person__hans,
//     a_o_person
// }