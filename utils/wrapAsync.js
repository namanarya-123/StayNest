// utlis mae extra chije rakho jaise warpAsync and error class and others
// here make warpAsync function in which function call itself
// module.exports =  (fn) => {
//     return  (req, res, next) =>
//     {
//         fn(req, res, next).catch(next);
//     }
// }

module.exports = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};



// function wrapAsync(fn) {
//     return function (req, res, next)
//     {
//         fn(req, res, next).catch(next);
//     }
// }