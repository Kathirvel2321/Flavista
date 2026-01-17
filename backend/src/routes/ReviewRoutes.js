import express from "express";
import GuestReview from "../models/GuestReview.js";

const router = express.Router();

router.post("/:foodId", async (req, res) => {
    try {
    const { user, rating, comment, date } = req.body;
    const newReview = new GuestReview({ 
      foodId: req.params.foodId,
      user, 
      rating, 
      comment,
      date 
    });
    await newReview.save();
    res.status(201).json(newReview);
    } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    }
});

router.get("/:foodId", async (req, res) => {
    try {
    const reviews = await GuestReview.find({ foodId: req.params.foodId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
    } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    }
});

export default router;