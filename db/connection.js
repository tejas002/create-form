const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

// establish mongo connection
mongoose.connect(process.env.MONGOHQ_URL || process.env.MONGODB_URI || "mongodb://localhost/agency")


mongoose.Promise = Promise
module.exports = mongoose;
