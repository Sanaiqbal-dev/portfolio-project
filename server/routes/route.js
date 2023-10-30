const express = require("express");

const router = express.Router();
const Model = require("../model/model");

module.exports = router;

router.post("/post", async (req, res) => {
  const data = new Model({
    id: req.body.id,
    companyName: req.body.companyName,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  res.send("Post API");
});

router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Update by ID Method
router.patch("/update/:id", async(req, res) => {

    try{
        const id  = req.params.id;
        const updatedDate = req.body;
        const options  = {new : true};

        const result = await Model.findByIdAndUpdate(id, updatedDate, options);
        res.send(result);
    }
    catch(error){

        res.status(400).json({message:  error.message});
    }


});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  res.send("Delete by ID API");
});
