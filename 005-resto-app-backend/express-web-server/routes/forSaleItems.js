const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { parse } = require("path");

const taskFile = "./forSaleItems.json";
const taskFilePath = path.resolve(__dirname, taskFile);

router.get("/", (request, response) => {
    const forSaleItems = fs.readFileSync(taskFilePath);
    response.send(forSaleItems);
});

router.post("/", (request, response) => {
    const forSaleItems = JSON.parse(fs.readFileSync(taskFilePath));
    forSaleItems.push(request.body);
    fs.writeFileSync(taskFilePath, JSON.stringify(forSaleItems));
    response.status(201).send();
});

router.delete("/:id", (request, response) => {
    const forSaleItems = JSON.parse(fs.readFileSync(taskFilePath));
    const filteredItems = forSaleItems.filter((task) => task.id != request.params.id)

    fs.writeFileSync(taskFilePath, JSON.stringify(filteredItems));
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
    console.log(forSaleItems)

    fs.writeFileSync(taskFilePath, JSON.stringify(forSaleItems));
    response.status(200).send();
})


module.exports = router;