const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, index: true },
    product: { type: String, required: true },
    category: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    channel: { type: String, required: true }, // e.g. Online, Retail, Partner
    units: { type: Number, required: true, min: 0 },
    revenue: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
