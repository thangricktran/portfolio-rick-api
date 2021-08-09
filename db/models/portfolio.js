const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  title: { type: String, required: true, maxlength: 128, trim: true },
  company: { type: String, required: true, maxlength: 64, trim: true },
  companyWebsite: { type: String, required: true, maxlength: 128, trim: true },
  location: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  userId: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
