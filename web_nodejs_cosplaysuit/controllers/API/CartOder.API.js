var myMD = require('../../models/Bill.model');
var myMDshop = require('../../models/cosplau_suit_user_model');
var myMDsp = require('../../models/cosplay_suit_model');

var objReturn = {
    stu: 1,
    msg: 'ok'
}
exports.getidCartOder = async (req, res, next) => {
    //lấy danh sách giỏ hàng theo id
    let dieu_kien_loc = null;
    if (typeof (req.params.id) != 'undefined') {
        dieu_kien_loc = { _id: req.params.id};
    }
    var list = await myMD.tb_cartoderModel.find(dieu_kien_loc).populate('product_id').populate('properties_id');

    res.send(list);
}

exports.getShop = async (req, res, next) => {
    const id_user = req.params.id_user;
    // Tìm danh sách idproduct theo idUser
    const cartlist = await myMD.tb_cartoderModel.find({id_user: id_user }).select('product_id').lean();
    
    // Lấy danh sách idproduct từ kết quả trên
    const idproductList = cartlist.map(hd => hd.product_id);

    //Tìm ra bản ghi của idproduct
    const listIdShop = await myMDsp.tb_productModel.find({_id: { $in: idproductList }}).select('id_shop').lean();

    // Lấy danh sách idshop từ kết quả trên
    const idshoplist = new Set(listIdShop.map(hd => String(hd.id_shop)));
    const giaTriKhongTrungLap = [...idshoplist];
    console.log("ok: " + giaTriKhongTrungLap);

    //Lấy ds product từ ds không trùng
    const list = await myMDshop.tb_shopModel.find({_id: { $in: giaTriKhongTrungLap }});

    res.send(list);

}
exports.tets = async (req, res, next) => {
    const id_user = req.params.id_user;

    var list = await myMD.tb_cartoderModel.find({id_user: id_user})
    .populate('product_id')
    .populate({
        path: 'product_id',
        populate: {
          path: 'id_shop'
        }
      })
    .populate('properties_id');

    res.send(list);

}

exports.getUserCartOder = async (req, res, next) => {
    //Lấy ds giỏ hàng theo id_user
    let dieu_kien_loc = null;
    if (typeof (req.params.id_user) != 'undefined') {
        dieu_kien_loc = { id_user: req.params.id_user};
    }
    var list = await myMD.tb_cartoderModel.find(dieu_kien_loc).populate('product_id').populate('properties_id');

    res.send(list);
}

exports.AddCartOder = async (req, res, next) => {

    let add = new myMD.tb_cartoderModel();
        add.id_user = req.body.id_user;
        add.product_id = req.body.product_id;
        add.amount = req.body.amount;
        add.totalPayment = req.body.totalPayment; 
        add.properties_id = req.body.properties_id; 
    let new_CMD = await add.save();
    console.log(new_CMD);
    try{
        if(new_CMD){
            objReturn.data = add;
            objReturn.stu = 1;
            objReturn.msg = "Thêm thành công"
        }else{
            objReturn.stu = 0;
            objReturn.msg = "Thêm thất bại"
        }
    }catch(error){
        objReturn.stu = 0;
        objReturn.msg = error.msg;
    }

    res.json(objReturn);
}

exports.updateCartOder = async (req, res, next) => {
    let id = req.params.id;

    let sua = new myMD.tb_cartoderModel();
        sua.amount = req.body.amount;
        sua.totalPayment = req.body.totalPayment; 

    let newcart = await myMD.tb_cartoderModel.findByIdAndUpdate(id, req.body);
        try{
            if(newcart){
                objReturn.data = newcart;
                objReturn.stu = 1;
                objReturn.msg = "Sửa thành công"
            }else{
                objReturn.stu = 0;
                objReturn.msg = "Sửa thất bại"
            }
        }catch(error){
            objReturn.stu = 0;
            objReturn.msg = error.msg;
        }
    res.json(objReturn);
}

exports.deleteCartOder = async (req, res, next) => {
    let deletecart = await myMD.tb_cartoderModel.findByIdAndDelete(req.params.id, req.body);
    console.log(deletecart);
    try {
        if(deletecart){
            objReturn.data = deletecart;
            objReturn.stu = 1;
            objReturn.msg = 'Xóa thành công';
        }else{
            objReturn.stu = 0;
            objReturn.msg = "Xóa thất bại";
        }
    } catch (error) {
        objReturn.stu = 0;
        objReturn.msg = error.msg;
    }
    res.json(objReturn);

}

