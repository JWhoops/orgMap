var mongoose = require("mongoose")

//building schema config
var codeSchema = new mongoose.Schema({
    email: String,
    code: String,
})
module.exports = mongoose.model("Code", codeSchema);