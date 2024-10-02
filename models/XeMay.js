const mongoose = require('mongoose');

const XeMaySchema = new mongoose.Schema({
    ten_xe_PH46164: { type: String, required: true },
    mau_sac_PH46164: { type: String, required: true },
    gia_ban_PH46164: { type: Number, required: true, default: 0 },
    mo_ta_PH46164: { type: String },
    hinh_anh_PH46164: { type: String },
});

const XeMay = mongoose.model('XeMay', XeMaySchema);

module.exports = XeMay;
