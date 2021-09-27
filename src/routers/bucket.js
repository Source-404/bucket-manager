const express = require("express");
const Bucket = require("../models/bucket");
const auth = require("../middleware/auth");
const router = new express.Router();

//Create a bucket
router.post("/buckets", auth, async (req, res) => {
  const buck = new Bucket({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await buck.save();
    res.status(201).send(buck);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /buckets?limit=10&skip=20

//fetch all buckets
router.get("/buckets", auth, async (req, res) => {
  const match = {};
  try {
    await req.user
      .populate({
        path: "buckets",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
        },
      })
      .execPopulate();
    res.send(req.user.buckets);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

//find bucket by id
router.get("/buckets/:id", auth, async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  console.log(req.user._id);
  try {
    const buck = await Bucket.findOne({ _id, owner: req.user._id });
    if (!buck) {
      return res.status(404).send();
    }
    res.send(buck);
  } catch (e) {
    res.status(500).send();
  }
});

//update bucket
router.patch("/bucket/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const _id = req.params.id;

  try {
    const buck = await Bucket.findOne({ _id, owner: req.user._id });
    if (!buck) {
      return res.status(404).send();
    }
    updates.forEach((update) => (buck[update] = req.body[update]));
    await buck.save();
    res.send(buck);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

// delete a specific bucket
router.delete("/buckets/:id", auth, async (req, res) => {
  try {
    const buck = await Bucket.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!buck) {
      return res.status(404).send();
    }
    res.send(buck);
  } catch (e) {
    res.status(500).send;
  }
});

module.exports = router;
