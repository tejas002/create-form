// require a connected instance of mongoose from ./connection.js
const mongoose = require('./connection');

// define a Schema variable to create a new schema with
const Schema = mongoose.Schema;

const FormDetails = new Schema(
    {
        
        formdata: Schema.Types.Mixed,
        formid: String,
        creationDate: { type: Date, default: Date.now },
        expireDate:{ type: Date, default: Date.now,expires:3600 },
        userfilledformdata:Schema.Types.Mixed
    }
)

// define schema
const FormSchema = mongoose.model("FormSchema", FormDetails)

module.exports = FormSchema
