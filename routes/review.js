const express = require("express");
const { body } = require("express-validator");

const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/create-review",
  [
    body("title", "Title needs to be at least 4 characters long")
      .trim()
      .isLength({ min: 4 }),
    body("description", "Description cannot be empty").trim().not().isEmpty(),
    body("rating", "Rating cannot be empty").trim().not().isEmpty(),
  ],
  reviewController.createReview
);

// router.delete(
//   "/delete-item/:itemId",
//   auth.verifySeller,
//   itemController.deleteItem
// );

// router.put(
//   "/edit-item/:itemId",
//   auth.verifySeller,
//   [
//     body("title", "Title needs to be at least 4 characters long")
//       .trim()
//       .isLength({ min: 4 }),
//     body("description", "Description cannot be empty").trim().not().isEmpty(),
//     body("price", "Price cannot be empty").trim().not().isEmpty(),
//   ],
//   itemController.editItem
// );

router.get("/get-reviews", reviewController.getReviews);

// router.get("/get-item/:itemId", auth.verifySeller, itemController.getItem);

module.exports = router;
