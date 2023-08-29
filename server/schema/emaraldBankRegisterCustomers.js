const mongoose = require('mongoose');

const emaraldBankRegisterCustomerSchema = new mongoose.Schema({
    customer_id: { type: Number, required: true },
    customer_email: { type: String, unique: true },
    customer_mno: { type: Number, required: true },
    otp: { type: Number, required: true },
    forgotPassword_otp: { type: Number },
    name:{ type: String },
    fieldName:{ type: String },
    size: { type: Number },
    lastModifiedDate:{type: String},
    uploadedAt: { type: Date, default: Date.now },
    registered_user: { type: Boolean, default: false },
    password: { type: String, default: null },
    customer_firstName: { type: String },
    customer_secondName: { type: String },
    customer_dob: { type: String },
    customer_gender: { type: String },
    customer_addressLine1: { type: String },
    customer_addressLine2: { type: String },
    customer_country: { type: String },
    customer_documentType: { type: String },
    status: { type: String },
    reason: { type: String }
}, { timestamps: true })

const EmaraldBankRegisterCustomers = mongoose.model('emaraldbankregistercustomers', emaraldBankRegisterCustomerSchema)

module.exports = EmaraldBankRegisterCustomers