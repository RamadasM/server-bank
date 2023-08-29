const mongoose = require('mongoose');

const emaraldBankUsersSchema = new mongoose.Schema({
    User_mobileNo: { type: Number, required: true },
    User_email: { type: String, required: true },
    User_password: { type: String, required: true }
}) 

const EmaraldBankUsers = mongoose.model('emaraldbankusers', emaraldBankUsersSchema)
module.exports = EmaraldBankUsers
