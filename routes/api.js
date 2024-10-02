const express = require('express');
const router = express.Router();
const XeMay = require('../models/XeMay');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', async (req, res) => {
    try {
        const xeMays = await XeMay.find();
        res.json(xeMays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/xemay/search', async (req, res) => {
    try {
        const query = req.query.q; // Lấy chuỗi tìm kiếm từ query string
        console.log(query);

        if (!query) return res.status(400).json({ message: 'Chuỗi tìm kiếm không được để trống' });

        // Tìm kiếm các xe máy có tên chứa chuỗi tìm kiếm
        const xeMays = await XeMay.find({
            ten_xe_PH46164: { $regex: query, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
        });

        res.json(xeMays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Hiển thị danh sách xe máy
router.get('/xemay', async (req, res) => {
    try {
        const xeMays = await XeMay.find();
        res.json(xeMays);
        console.log(xeMays);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xem chi tiết một xe máy
router.get('/xemay/:id', async (req, res) => {
    try {
        const xeMay = await XeMay.findById(req.params.id);
        if (!xeMay) return res.status(404).json({ message: 'Xe máy không tồn tại' });
        res.json(xeMay);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm mới một xe máy
router.post('/xemay', async (req, res) => {
    const { ten_xe_PH46164, mau_sac_PH46164, gia_ban_PH46164, mo_ta_PH46164, hinh_anh_PH46164 } = req.body;

    if (!ten_xe_PH46164 || !mau_sac_PH46164 || gia_ban_PH46164 === undefined) {
        return res.status(400).json({ message: 'Các trường bắt buộc không được để trống' });
    }

    const xeMay = new XeMay({
        ten_xe_PH46164,
        mau_sac_PH46164,
        gia_ban_PH46164,
        mo_ta_PH46164,
        hinh_anh_PH46164,
    });

    try {
        const newXeMay = await xeMay.save();
        res.status(201).json(newXeMay);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa một xe máy
router.delete('/xemay/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await XeMay.findByIdAndDelete(id);
        res.json({ message: 'Xe máy đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cập nhật thông tin xe máy
router.put('/xemay/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedXeMay = await XeMay.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedXeMay) return res.status(404).json({ message: 'Xe máy không tồn tại' });
        res.json(updatedXeMay);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add-xemay-withImage', upload.single('hinh_anh_PH46164'), async (req, res) => {
    try {
        const data = req.body; // Lấy dữ liệu từ body
        const file = req.file; // Lấy file đã upload

        // Tạo URL cho hình ảnh
        const imageUrl = file ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : null;

        // Tạo đối tượng XeMay mới
        const xeMay = new XeMay({
            ten_xe_PH46164: data.ten_xe_PH46164,
            mau_sac_PH46164: data.mau_sac_PH46164,
            gia_ban_PH46164: data.gia_ban_PH46164,
            mo_ta_PH46164: data.mo_ta_PH46164,
            hinh_anh_PH46164: imageUrl, // Thêm URL hình ảnh
        });

        // Lưu vào cơ sở dữ liệu
        const result = await xeMay.save();

        if (result) {
            res.json({
                status: 200,
                messenger: "Thêm thành công",
                data: result
            });
        } else {
            res.json({
                status: 400,
                messenger: "Lỗi, thêm không thành công",
                data: []
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            messenger: "Lỗi server",
            error: error.message
        });
    }
});


// Cập nhật thông tin xe máy với hình ảnh
router.put('/xemay/:id/withImage', upload.single('hinh_anh_PH46164'), async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body; // Lấy dữ liệu từ body
        const file = req.file; // Lấy file đã upload

        // Tạo URL cho hình ảnh nếu có
        const imageUrl = file ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : undefined;

        // Cập nhật thông tin xe máy
        const updatedXeMay = await XeMay.findByIdAndUpdate(id, {
            ten_xe_PH46164: data.ten_xe_PH46164,
            mau_sac_PH46164: data.mau_sac_PH46164,
            gia_ban_PH46164: data.gia_ban_PH46164,
            mo_ta_PH46164: data.mo_ta_PH46164,
            hinh_anh_PH46164: imageUrl, // Cập nhật URL hình ảnh nếu có
        }, { new: true });

        if (!updatedXeMay) return res.status(404).json({ message: 'Xe máy không tồn tại' });

        res.json({
            status: 200,
            messenger: "Cập nhật thành công",
            data: updatedXeMay
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            messenger: "Lỗi server",
            error: error.message
        });
    }
});






module.exports = router;
