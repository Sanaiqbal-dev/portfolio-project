const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  
  companyName: {
    required: true,
    type: String,
  },
  startDate: {
    required: true,
    type: String,
  },
  endDate: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
});


module.exports = mongoose.model('Data', dataSchema);