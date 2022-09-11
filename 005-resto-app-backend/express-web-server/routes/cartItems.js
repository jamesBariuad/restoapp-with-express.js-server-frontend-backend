const { response } = require("express");
const express = require("express");
const  router = express.Router(); 
const fs = require('fs');
const path = require("path");



const taskFile="./cartItems.json";
const taskFilePath = path.resolve(__dirname, taskFile);

router.get("/", (request,response)=>{
    const cartItems = fs.readFileSync(taskFilePath);
    response.send(cartItems);
});



router.post("/", (request,response)=>{
    fs.writeFileSync(taskFilePath,JSON.stringify(request.body))
    response.status(201).send();
});

router.delete("/:id",(request,response)=>{
    const cartItems = JSON.parse(fs.readFileSync(taskFilePath));

    const filteredCartItems = cartItems.filter(
        (cartItem)=> cartItem.id !=request.params.id
    );

    fs.writeFileSync(taskFilePath,JSON.stringify(filteredCartItems));
    response.status(200).send();
});

router.put("/decrementItem/:id",(request,response)=>{
    // find index with id from request
    const cartItems = JSON.parse(fs.readFileSync(taskFilePath));
    const index = cartItems.findIndex((item)=> item.id===request.params.id);
    // const check = cartItems.map(item=>{
    //     item.id===request.params.id? item.quantity-- : item;
    // })
    cartItems[index].quantity=cartItems[index].quantity-1;
   
    fs.writeFileSync(taskFilePath, JSON.stringify(cartItems))
    console.log(cartItems[index].quantity)
    // console.log(typeof request.params.id)
    // console.log(JSON.parse(fs.readFileSync(taskFilePath)))
    response.status(200).send();
});

router.put("/incrementItem/:id",(request,response)=>{
    const cartItems = JSON.parse(fs.readFileSync(taskFilePath));
    const index = cartItems.findIndex((item)=> item.id===request.params.id);
  
    cartItems[index].quantity=cartItems[index].quantity+1;
   
    fs.writeFileSync(taskFilePath, JSON.stringify(cartItems))
    console.log(cartItems[index].quantity)
    response.status(200).send();
});

router.put("/:id", (request, response) => {
    const forSaleItems = JSON.parse(fs.readFileSync(taskFilePath));
    forSaleItems.forEach((item) => {
        if (item.id==request.params.id){   
            item.name=request.body.name
            item.price=request.body.price
            item.category=request.body.category
            item.image=request.body.image
            item.desc=request.body.desc
        }
    });
    // console.log(forSaleItems)

    fs.writeFileSync(taskFilePath, JSON.stringify(forSaleItems));
    response.status(200).send();
})

module.exports=router;
