const express = require("express")
const fs = require("fs");
const { request } = require("http");
const router = express.Router();
const session = require("express-session");
const seller= require("../schema/sellerSchema");



router.post("/add_seller", async(request, response) => {
    var name = request.fields.name; // fields when using formidable/form-data
    var email = request.fields.email;
    var mobile = request.fields.mobile;
    var address = request.fields.address;

    try {
        const sellers = await seller.create({
            seller_name: name,
            seller_email: email,
            seller_mobile: mobile,
            seller_address: address
        })
        console.log(sellers)
        response.json({ "message": "Customer registered successfully!" })
    } catch (e) {
        console.log("exception", e.message)
        response.json({ "message": "Something went wrong" })
    }
    // var name = request.fields.name; // fields when using urlencoded ot json
    // var email = request.fields.email;
    // var mobile = request.fields.mobile;
    // var address = request.fields.address;


    // var readData = [];//[{},[]]
    // var seller_obj = {
    //     seller_id: Date.now(),
    //     seller_name: name,
    //     seller_email: email,
    //     seller_mobile: mobile,
    //     seller_address: address,
    // }

    // console.log("------------------------1.", readData)
    // fs.readFile("seller.json", function (err, data) {
    //     if (err) {
    //         response.json({ "message": "Something went wrong!!" });
    //     } else {
    //         dd = JSON.parse(data);
    //         readData = dd;
    //         readData.push(seller_obj);
    //         console.log("------------------------2.", readData)
    //         fs.writeFile("seller.json", JSON.stringify(readData), function (err) {
    //             if (err) {
    //                 response.json({ "message": "Something went wrong!" });
    //             } else {
    //                 response.json({ "message": "seller registered successfully!" })
    //             }
    //         })
    //     }
    // })
})


router.post("/delete_seller", async(req, res) => {
    var id = req.fields.id;
    var cust = await seller.deleteOne({_id:id});
    console.log(cust);
    // fs.readFile("seller.json", function (err, data) {
    //     if (err) {
    //         response.json({ "message": "Something went wrong!!" });
    //     } else {

    //         dd = JSON.parse(data);
    //         readData = dd;
    //         var arr = readData.filter((v) => v.seller_id !== id);
    //         readData = arr;
    //         fs.writeFile("seller.json", JSON.stringify(readData), function (err) {
    //             if (err) {
    //                 res.json({ "message": "Something went wrong!" });
    //             } else {
    //                 res.json({ "message": "seller Deleted successfully!" })
    //             }
    //         })
    //     }
    // })



})



router.post("/update_seller", async(request, response) => {
    var id = request.fields.id;
    const data = await seller.findById(id);
    var name = "N/A";
    console.log(request.fields.name);
    var email = "N/A";
    var mobile = "N/A";
    var address = "N/A";
    if (request.fields.name != "" && request.fields.name != undefined && request.fields.name != null) {
        console.log("under validate name")
        name = request.fields.name;
    }
    if (request.fields.email != "" && request.fields.email != undefined && request.fields.email != null) {
        console.log("under validate name")
        email = request.fields.email;
    }
    if (request.fields.mobile != "" && request.fields.mobile != undefined && request.fields.mobile != null) {
        console.log("under validate name")
        mobile = request.fields.mobile;
    }
    if (request.fields.address != "" && request.fields.address != undefined && request.fields.address != null) {
        console.log("under validate name")
        address = request.fields.address;
    }

    if (name != "N/A") {
        data.seller_name = name;
    } else {
        data.seller_name = data.seller_name;
    }

    if (email != "N/A") {
        data.seller_email = email;
    } else {
        data.seller_email = data.seller_email
    }

    if (mobile != "N/A") {
        data.seller_mobile = mobile;
    } else {
        data.seller_mobile = data.seller_mobile
    }

    if (address != "N/A") {
        data.seller_address = address;
    } else {
        data.seller_address = data.seller_address;
    }

    await data.save();
    response.json({ "message": "Customer Updated Sussesfully" });
    // var readData = [];
    // //readData.push(seller_obj);
    // console.log("------------------------1.", readData)
    // fs.readFile("seller.json", function (err, data) {
    //     if (err) {
    //         response.json({ "message": "Something went wrong!!" });
    //     } else {
    //         dd = JSON.parse(data);
    //         readData = dd;
    //         console.log("------------------------2.", readData)

    //         readData.map((v, i) => {
    //             if (v.seller_id == id) {
    //                 if (name != "N/A") {
    //                     v.seller_name = name;
    //                 } else {
    //                     v.seller_name = v.seller_name
    //                 }

    //                 if (email != "N/A") {
    //                     v.seller_email = email;
    //                 } else {
    //                     v.seller_email = v.seller_email
    //                 }

    //                 if (mobile != "N/A") {
    //                     v.seller_mobile = mobile;
    //                 } else {
    //                     v.seller_mobile = v.seller_mobile
    //                 }

    //                 if (address != "N/A") {
    //                     v.seller_address = address;
    //                 } else {
    //                     v.seller_address = v.seller_address;
    //                 }
    //             }
    //         })
    //         fs.writeFile("seller.json", JSON.stringify(readData), function (err) {
    //             if (err) {
    //                 response.json({ "message": "Something went wrong!" });
    //             } else {
    //                 response.json({ "message": "seller updated successfully!" })
    //             }
    //         })
    //     }
    // })
})

router.get('/seller_add',(request,response)=>
{
    request.session.url="seller/seller_add";
    console.log(request.session.username);
    if(request.session.username !=undefined && request.session.username !=null && request.session.username !="")
    {
        response.render('seller/seller_add.ejs');
    }
    else
    {
        response.redirect('/login_page');
    }
})

router.get('/seller_delete',(request,response)=>
{
    request.session.url="seller/seller_delete";
    if(request.session.username !=undefined && request.session.username !=null && request.session.username !="")
    {
        response.render('seller/seller_delete.ejs');
    }
    else
    {
        response.redirect('/login_page');
    }
})

router.get('/add_product',(request,response)=>
{
    request.session.url="seller/add_product";
    if(request.session.username !=undefined && request.session.username !=null && request.session.username !="")
    {
        response.render('seller/add_product.ejs');
    }
    else
    {
        response.redirect('/login_page');
    }
})

router.get('/delete_product',(request,response)=>
{
    request.session.url="seller/delete_product";
    if(request.session.username !=undefined && request.session.username !=null && request.session.username !="")
    {
        response.render('seller/delete_product.ejs');
    }
    else
    {
        response.redirect('/login_page');
    }
})

router.get('/product_update',(request,response)=>
{
    request.session.url="seller/product_update";
    if(request.session.username !=undefined && request.session.username !=null && request.session.username !="")
    {
        response.render('seller/update_product.ejs');
    }
    else
    {
        response.redirect('/login_page');
    }
})

router.get('/seller_update',(request,response)=>
{
    request.session.url="seller/seller_update";
    if(request.session.username !=undefined && request.session.username !=null && request.session.username !="")
    {
        response.render('seller/seller_update.ejs');
    }
    else
    {
        response.redirect('/login_page');
    }
})



router.post("/update_purchaseProduct", (request, response) => {
    var product_id = request.fields.product_id;
    var customer_id = request.fields.customer_id;
    var status = "N/A";
    // console.log(request.fields.name);
    var delivery_date = "N/A";
    if (request.fields.status != "" && request.fields.status != undefined && request.fields.status != null) {
        console.log("under validate status")
        status = request.fields.status;
    }
    if (request.fields.delivery_date != "" && request.fields.delivery_date != undefined && request.fields.delivery_date != null) {
        console.log("under validate delivery")
        delivery_date = request.fields.delivery_date;
    }
    var readData = [];
    //readData.push(seller_obj);
    console.log("------------------------1.", status)
    fs.readFile("purchseProduct.json", function (err, data) {
        if (err) {
            response.json({ "message": "Something went wrong!!" });
        } else {
            dd = JSON.parse(data);
            readData = dd;
            console.log("------------------------2.", status)

            readData.map((v, i) => {
                if (v.product_id === product_id && v.customer_id === customer_id) {
                    console.log("------------------------3.", status)
                    if (status != "N/A") {
                        v.status = status;
                        console.log("hello");
                    } else {
                        v.status = v.status;
                    }

                    if (delivery_date != "N/A") {
                        v.delivery_date = delivery_date;
                    } else {
                        v.delivery_date = v.delivery_date;
                    }

                }
            })
            fs.writeFile("purchseProduct.json", JSON.stringify(readData), function (err) {
                if (err) {
                    response.json({ "message": "Something went wrong!" });
                } else {
                    response.json({ "message": "Purchase Product Details updated successfully!" })
                }
            })
        }
    })
})

router.post("/set_discount", (request, response) => {
    var product_id = request.fields.product_id;
    var discount_id = Date.now();
    var temp_arr = [];
    var discount_type = request.fields.discount_type;
    var discount_value = request.fields.discount_value;
    var obj = { discount_id: discount_id, product_id: product_id, discount_type: discount_type, discount_value: discount_value }
    fs.readFile("discount.json", (err, data) => {
        if (err) {

        }
        else {
            var dd = JSON.parse(data);
            temp_arr = dd;

            temp_arr.push(obj);
            fs.writeFile("discount.json", JSON.stringify(temp_arr), (err) => {
                if (err) {
                    response.json({ "message": "Something went wrong!!" });
                }
                else {
                    response.json({ "message": "Discount Updated Succesfully" });
                }
            })
        }
    }
    )
}
)

router.post("/delete_discount", (req, res) => {
    var discount_id = req.fields.discount_id;
    fs.readFile("discount.json", function (err, data) {
        if (err) {
            response.json({ "message": "Something went wrong!!" });
        } else {

            dd = JSON.parse(data);
            readData = dd;
            var arr = readData.filter((v) => v.discount_id !== discount_id);
            readData = arr;
            fs.writeFile("discount.json", JSON.stringify(readData), function (err) {
                if (err) {
                    res.json({ "message": "Something went wrong!" });
                } else {
                    res.json({ "message": "seller Deleted successfully!" })
                }
            })
        }
    })
}
)


router.post("/update_discount", (request, response) => {
    var discount_id=request.fields.discount_id;
    var discount_type = "N/A";
    // console.log(request.fields.name);
    var discount_value = "N/A";
    if (request.fields.discount_type != "" && request.fields.discount_type != undefined && request.fields.discount_type != null) {
        console.log("under validate status")
        discount_type = request.fields.discount_type;
    }
    if (request.fields.discount_value != "" && request.fields.discount_value != undefined && request.fields.discount_value != null) {
        console.log("under validate delivery")
        discount_value = request.fields.discount_value;
    }
    var readData = [];
    fs.readFile("discount.json", function (err, data) {
        if (err) {
            response.json({ "message": "Something went wrong!!" });
        } else {
            dd = JSON.parse(data);
            readData = dd;
            // console.log("------------------------2.", status)

            readData.map((v, i) => {
                if (v.discount_id === discount_id) {
                    // console.log("------------------------3.", status)
                    if (discount_type != "N/A") {
                        v.discount_type = discount_type;
                        console.log("hello");
                    } else {
                        v.discount_type = v.discount_type;
                    }

                    if (discount_value != "N/A") {
                        v.discount_value = discount_value;
                    } else {
                        v.discount_value = v.discount_value;
                    }

                }
            })
            fs.writeFile("discount.json", JSON.stringify(readData), function (err) {
                if (err) {
                    response.json({ "message": "Something went wrong!" });
                } else {
                    response.json({ "message": "Discount Details updated successfully!" })
                }
            })
        }
    })
})



router.post("/seller_show", (request, response) => {
    var id = request.fields.id;
    var readData = [];


    console.log("------------------------1.", readData)
    fs.readFile("seller.json", function (err, data) {
        if (err) {
            response.json({ "message": "Something went wrong!!" });
        } else {
            dd = JSON.parse(data);
            var seller = dd.filter((v) => v.seller_id == id)
            if (seller != "" && seller != undefined) {
                response.json({ "data": seller })
            } else {
                response.json({ "message": "Something went wrong!" })
            }
        }
    })
})

module.exports = router;