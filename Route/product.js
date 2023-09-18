const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const product= require("../schema/productSchema");
// const formidable = require('express-formidable');

const route = express.Router();
// route.use(express.json());
route.use(express.urlencoded({extended:false})); 
var products_details = [];


fs.readFile('products.json', function (err, data) {
    var arr = JSON.parse(data);
    products_details = arr;
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, 'images/');
    },

    filename: function (req, file, cb) {
        var img_path = Date.now();
       return cb(null, img_path + ".png");
    }
});

var upload = multer({ storage: storage })

route.post("/add_product", upload.single("product_img"), async(req, res) => {
    console.log("req.file is =>",req.files);
    var product_name = req.fields.product_name;
    //var product_img = req.file.filename;
    var product_price = req.fields.product_price;
    var products_details= req.fields.products_details;
    console.log("Hello =>",req.files);
    console.log(products_details);
    try {
        const cust = await product.create({
            product_name:product_name,
            product_price:product_price
        })
        console.log(cust);
        res.json({ "message": "Customer registered successfully!" });
    } catch (e) {
        console.log("exception", e.message);
        res.json({ "message": "Something   went wrong" });
    }
    //product_img:product_img,
    // var product_id = Date.now();
    // var obj = { product_id: product_id, product_name: product_name, product_img: product_img, product_price: product_price };
    // products_details.push(obj);
    // console.log(product_img);
    // fs.writeFile('products.json', JSON.stringify(products_details), function (err) {
    //     if (err) {
    //         res.json([{ "message": "File Not Upload" }])
    //     }
    //     else {
    //         res.json([{ "message": "File Uploaded" }])
    //     }
    // })
})






route.post("/delete_product", async(req, res) => {
    var id = req.fields.id;
    const data= await product.deleteOne({_id:id});
    console.log(data);
    res.json({ "message": "Product Deleted successfully!" })
    // var arr = products_details.filter((v) => v.product_id !== id);
    // products_details = arr;

    // fs.writeFile('products.json', JSON.stringify(products_details), function (err) {
    //     if (!err) {
    //         res.json([{ "message": "Record Deleted Succesfully" }])
    //     }
    //     else {
            
    //         res.json([{ "message": "Error While Deleting" }])
    //     }
    // })

})

route.post("/update_product", async(req, res) => {
    var id = req.fields.id;
    const data= await product.findById(id);
    console.log(data);
    var name = "NAN";
    var price = "NAN";
    if (req.fields.name !== null && req.fields.name !== undefined && req.fields.name !== "") {
        name = req.fields.name;
    }
    if (req.fields.price !== null && req.fields.price !== undefined && req.fields.price !== "") {
        price = req.fields.price;
    }
    if (name != "NAN") {
        data.product_name = name;
    } else {
        data.product_name = data.product_name;
    }

    if (price != "NAN") {
        data.product_price = price;
    } else {
        data.product_price = data.product_price
    }
    await data.save();
    // products_details.map((v) => {
    //     console.log(v.product_name);

    //     if (v.product_id === id) {
    //         if (name != "NAN") {
    //             v.product_name = name;
    //         }
    //         else {
    //             v.product_name = v.product_name;
    //         }
    //         if (price != "NAN") {
    //             v.product_price = price;
    //         }
    //         else {
    //             v.product_price = v.product_price;
    //         }
    //     }



    //     console.log(v.product_name);
    // }
    // )

    // fs.writeFile('products.json', JSON.stringify(products_details), function (err) {
    //     if (!err) {
    //         res.json([{ "message": "Record Updated Succesfully" }])
    //     }
    //     else {
    //         res.json([{ "message": "Error While Updating" }])
    //     }
    // })

})



route.post("/show_product", (request, response) => {
    var product_id = request.fields.product_id;
   

    var data=products_details.filter((v)=> v.product_id===product_id)
    
    response.json({"Product":data});
})

module.exports = route;