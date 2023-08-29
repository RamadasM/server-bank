const mongoose = require('mongoose');

const emaraldBankCustomerSchema = new mongoose.Schema({
    customer_id: { type: Number, required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, unique: true },
    customer_mno: { type: Number, required: true },
})

const EmaraldBankCustomers = mongoose.model('emaraldbankcustomers', emaraldBankCustomerSchema)

module.exports = EmaraldBankCustomers