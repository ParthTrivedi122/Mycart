const express= require('express');
const app= express();
const fs = require("fs");
const session = require("express-session");
const mongoose = require("mongoose")


const PORT=8000;
// app.use(express.json());
const formidable = require('express-formidable');
app.use(formidable());
app.use('/static',express.static("static"));



mongoose.connect("mongodb://127.0.0.1:27017/mycart");

const session_duration = 86400000;
app.use(session({
    secret: 'the secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: session_duration }
}))

const customer=require("./Route/customer");
const products=require("./Route/product");
// const vendor=require("./Route/vendor");
const seller=require("./Route/seller");
const mycart=require("./Route/mycart.js");

app.use("/customer",customer);
app.use("/product",products);
// app.use("/vendor",vendor);
app.use("/seller",seller);
app.use("/mycart",mycart);
app.use('/static',express.static("static")); // to server external files to ejs

app.listen(PORT,(err)=>{
    if(err)
    {
        console.log("Something went wrong");
    }
    else
    {
        console.log("Server Succesfully started on Port :",PORT);
    }
})

app.get('/login_page',(req,res)=>
{
    res.render('login/login.ejs');
})

app.post('/login',(request,response)=>
{
    var username=request.fields.username;
    request.session.username = username;
    console.log("Hello",request.session.username);
    if(request.session.url==undefined)
    {
        request.session.url="/customer/products"
    }
    response.json({'login':'1',url:request.session.url});

})

app.get('/logout',(req,res)=>
{
    req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          res.status(500).json({ message: "Error destroying session" });
        } else {
          res.render('login/login.ejs'); // Redirect to the login page or any other appropriate action after logout.
        }
      });

})


// const express = require('express')
// const app = express()
// const userRouter = require("./route/users")

// const PORT = 3000

// app.use(express.json()) // to accept JSON and urlencoded request

// app.get('/hello', function (request, response) {
//     console.log(request.query)
//     var name = request.query.name
//     response.send(`<h1>Hello ${name}</h1>`)
// })

// app.post('/mypost', function (request, response) {
//     console.log(request.body)
//     var num1 = request.body.num1
//     var num2 = request.body.num2
//     var total = num1+num2
//     response.json([{"total":total}])
// });

// app.use("/users",userRouter)

// app.listen(PORT,(err)=>{
//     if(err){
//         console.log("Something went wrong")
//     }
//     else{
//         console.log("Server started on PORT:",PORT)
//     }
// });

app.get('/cart', async (request, response) => {
    var inx = request.fields.index;
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
                response.render('customer/cart.ejs', { readData: readData });
            }
            else {
                response.redirect('/login_page');
            }
        }
    }
    )
})