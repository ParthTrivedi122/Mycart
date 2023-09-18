const express = require("express")
const fs = require("fs");
const { request } = require("http");
const router = express.Router();
const customer = require("../schema/customerSchema")
const cart = require("../schema/cartSchema")
const product = require("../schema/productSchema")

var cust_id = Date.now();
router.post("/add_cust", async function (request, response) {
    var name = request.fields.name; // fields when using formidable/form-data
    var email = request.fields.email;
    var mobile = request.fields.mobile;
    var address = request.fields.address;
    console.log(name);
    // var name = request.fields.name; // fields when using urlencoded ot json
    // var email = request.fields.email;
    // var mobile = request.fields.mobile;
    // var address = request.fields.address;
    // var readData = [];//[{},[]]
    try {
        const cust = await customer.create({
            cust_name: name,
            cust_email: email,
            cust_mobile: mobile,
            cust_address: address
        })
        console.log(cust)
        response.json({ "message": "Customer registered successfully!" })
    } catch (e) {
        console.log("exception", e.message)
        response.json({ "message": "Something went wrong" })
    }


    // console.log("------------------------1.", readData)
    // fs.readFile("customer.json", function (err, data) {
    //     if (err) {
    //         response.json({ "message": "Something went wrong!!" });
    //     } else {
    //         dd = JSON.parse(data);
    //         readData = dd;
    //         readData.push(cust_obj);
    //         console.log("------------------------2.", readData)
    //         fs.writeFile("customer.json", JSON.stringify(readData), function (err) {
    //             if (err) {
    //                 response.json({ "message": "Something went wrong!" });
    //             } else {
    //                 response.json({ "message": "Customer registered successfully!" })
    //             }
    //         })
    //     }
    // })
})


router.post("/delete_cust", async (req, res) => {
    var id = req.fields.id;
    var cust = await customer.deleteOne({ _id: id });
    console.log("Deleted Record =>", cust);
    res.json({ "message": "Customer Deleted successfully!" })
    // fs.readFile("customer.json", function (err, data) {
    //     if (err) {
    //         response.json({ "message": "Something went wrong!!" });
    //     } else {

    //         dd = JSON.parse(data);
    //         readData = dd;
    //         var arr = readData.filter((v) => v.cust_id !== id);
    //         readData = arr;
    //         fs.writeFile("customer.json", JSON.stringify(readData), function (err) {
    //             if (err) {
    //                 res.json({ "message": "Something went wrong!" });
    //             } else {
    //                 res.json({ "message": "Customer Deleted successfully!" })
    //             }
    //         })
    //     }
    // })



})
router.post("/update_customer", async (request, response) => {
    var id = request.fields.id;
    const data = await customer.findById(id);
    console.log(data);
    var name = "N/A";
    // console.log(request.fields.name);
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
        data.cust_name = name;
    } else {
        data.cust_name = data.cust_name;
    }

    if (email != "N/A") {
        data.cust_email = email;
    } else {
        data.cust_email = data.cust_email
    }

    if (mobile != "N/A") {
        data.cust_mobile = mobile;
    } else {
        data.cust_mobile = data.cust_mobile
    }

    if (address != "N/A") {
        data.cust_address = address;
    } else {
        data.cust_address = data.cust_address;
    }

    await data.save();
    response.json({ "message": "Customer Updated Sussesfully" });
    // var readData = [];
    // //readData.push(cust_obj);
    // console.log("------------------------1.", readData)
    // fs.readFile("customer.json", function (err, data) {
    //     if (err) {
    //         response.json({ "message": "Something went wrong!!" });
    //     } else {
    //         dd = JSON.parse(data);
    //         readData = dd;
    //         console.log("------------------------2.", readData)

    //         readData.map((v, i) => {
    //             if (v.cust_id == id) {
    //                 if (name != "N/A") {
    //                     v.cust_name = name;
    //                 } else {
    //                     v.cust_name = v.cust_name
    //                 }

    //                 if (email != "N/A") {
    //                     v.cust_email = email;
    //                 } else {
    //                     v.cust_email = v.cust_email
    //                 }

    //                 if (mobile != "N/A") {
    //                     v.cust_mobile = mobile;
    //                 } else {
    //                     v.cust_mobile = v.cust_mobile
    //                 }

    //                 if (address != "N/A") {
    //                     v.cust_address = address;
    //                 } else {
    //                     v.cust_address = v.cust_address;
    //                 }
    //             }
    //         })
    //         fs.writeFile("customer.json", JSON.stringify(readData), function (err) {
    //             if (err) {
    //                 response.json({ "message": "Something went wrong!" });
    //             } else {
    //                 response.json({ "message": "Customer updated successfully!" })
    //             }
    //         })
    //     }
    // })
})

router.get('/cust_register', (request, response) => {
    var inx = request.fields.index;
    console.log(inx);
    request.session.url = "customer/cust_register";
    if (request.session.username != undefined && request.session.username != null && request.session.username != "") {
        response.render('customer/cust_register.ejs');
    }
    else {
        response.redirect('/login_page');
    }
})

router.get('/cust_delete', (request, response) => {
    // console.log(request.session.username);
    // if(request.session.username != undefined && request.session.username != null && request.session.username != "")
    // {
    request.session.url = "customer/cust_delete";
    if (request.session.username != undefined && request.session.username != null && request.session.username != "") {
        response.render('customer/cust_delete.ejs');
    }
    else {
        response.redirect('/login_page');
    }
    // }
    // else
    // {
    //     response.render('login.ejs');
    // }
})

router.get('/cust_update', (request, response) => {
    request.session.url = "customer/cust_update";
    if (request.session.username != undefined && request.session.username != null && request.session.username != "") {
        response.render('customer/update_cust.ejs');
    }
    else {
        response.redirect('/login_page');
    }
})

router.get('/cart', async (request, response) => {
    var inx = request.fields.index;
    const data = await product.find();
    fs.readFile("products.json", async function (err, datas) {
        if (err) {
            response.json({ "message": "Something went wrong!!" });
        } else {
            dd = JSON.parse(datas);
            readData = dd;
            console.log(readData[0].product_name);
            // const data = await cart.create(
            //     {
            //         product_name: readData[inx].product_name,
            //         product_img: readData[inx].product_img,
            //         product_price: readData[inx].product_price
            //     }
            // )
            console.log(datas);
            if (request.session.username != undefined && request.session.username != null && request.session.username != "") {
                response.render('customer/cart.ejs', { readData: data });
            }
            else {
                response.redirect('/login_page');
            }
        }
    }
    )
})

// router.get('/products', (request, response) => {
//     // fs.readFile("products.json", function (err, data) {
//     //     if (err) {
//     //         response.json({ "message": "Something went wrong!!" });
//     //     } else {
//     //         dd = JSON.parse(data);
//     //         readData = dd;
//     //         console.log(readData[0].product_name);
//     //         if (request.session.username != undefined && request.session.username != null && request.session.username != "") {
//     //             response.render('customer/products.ejs', { readData: readData });
//     //         }
//     //         else {
//     //             response.redirect('/login_page');
//     //         }
//     //     }
//     // }
//     // )

// })

router.get('/products', async (request, response) => {
    // var readData = [];
    // fs.readFile('products.json', (err, data) => {
    //     if (err) {
    //         response.json({ "message": "Something went wrong!!" });
    //     } else {
    //         dd = JSON.parse(data);
    //         readData = dd;
    //         //console.log(readData);
    //         if (request.session.username != undefined && request.session.username != null && request.session.username != "") {
    //             //console.log("readData=>",readData)
    //             response.render('customer/products.ejs', { readData: readData });
    //         }
    //         else {
    //             response.redirect('/login_page');
    //         }
    //     }
    // })
    const data = await product.find();
    console.log(data);
    if (request.session.username != undefined && request.session.username != null && request.session.username != "") {

        response.render('customer/products.ejs', { readData: data });
    }
    else {
        response.redirect('/login_page');
    }

})

// router.get('/cart', (req, res) => {
//     var readData = [];
//     fs.readFile('purchseProduct.json', (err, data) => {
//         if (err) {
//             response.json({ "message": "Something went wrong!!" });
//         } else {
//             dd = JSON.parse(data);
//             readData = dd;
//             console.log(readData);
//             res.render('my-account.ejs', { readData: readData });
//         }
//     })
//     // console.log(readData);

// })

router.post("/cust_show", (request, response) => {
    var id = request.fields.id;
    var readData = [];


    console.log("------------------------1.", readData)
    fs.readFile("customer.json", function (err, data) {
        if (err) {
            response.json({ "message": "Something went wrong!!" });
        } else {
            dd = JSON.parse(data);
            var cust = dd.filter((v) => v.cust_id == id)
            if (cust != "" && cust != undefined) {
                response.json({ "data": cust })
            } else {
                response.json({ "message": "Something went wrong!" })
            }
        }
    })
})

router.post("/place_order", (request, response) => {
    var name = request.fields.name;
    var product_id;
    var arr = [];
    fs.readFile("products.json", (err, data) => {
        if (err) {
            response.json({ "message": "Something went wrong!!!" })
        }
        else {
            arr = JSON.parse(data);
            var d = arr.filter((v) => v.product_name === name);
            product_id = d[0].product_id;
            console.log(d[0].product_id);
            var dd = new Date();
            var obj = { customer_id: cust_id, product_id: product_id, purchased_date: `${dd.getDate()}/${dd.getMonth()}/${dd.getFullYear()}`, status: "Order Placed", delivery_date: `${dd.getDate() + 5}/${dd.getMonth()}/${dd.getFullYear()}`, ordered_date: `${dd.getDate()}/${dd.getMonth()}/${dd.getFullYear()}` }
            fs.readFile('purchseProduct.json', (err, data) => {
                if (err) {

                }
                else {
                    var arr2 = JSON.parse(data);
                    arr2.push(obj);
                    fs.writeFile('purchseProduct.json', JSON.stringify(arr2), (err) => {
                        if (err) {
                            response.json({ "message": "Something went wrong!!" })
                        }
                        else {
                            response.json({ "message": "Product Ordered Succesfully!" })
                        }
                    })
                }
            })

        }
    })
})


module.exports = router;