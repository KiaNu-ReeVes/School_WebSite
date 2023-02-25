
const {check} = require('express-validator')
class registerValidator {
    handle() {
        return[
            check('nationalID').isLength({min : 10}).withMessage('کد ملی باید 10 رقمی باشد'),
            check('nationalSerial').isLength({min : 6}).withMessage('سریال وارد شده باید 6 رقمی باشد'),
        ]
    }
}
module.exports = new registerValidator();