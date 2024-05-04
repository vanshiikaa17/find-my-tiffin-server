const path = require("path");
const fs = require("fs");

const { validationResult } = require("express-validator");

const Item = require("../models/item");
const Review = require("../models/review");
const Seller = require("../models/seller");
const Account = require("../models/account");
const User = require("../models/user");

exports.createReview = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  // if (!req.file) {
  //   const error = new Error("Upload an image as well.");
  //   error.statusCode = 422;
  //   throw error;
  // }

  const title = req.body.title;
  const description = req.body.description;
  const rating = req.body.rating;
  const userId = req.body.userId;
  let sellerId = req.body.sellerId;
  //632b4599f7d44b0904fefd96 - seller id

  // Account.findById(userId)
  //   .then((account) => {
  //     return Seller.findOne({ account: account._id });
  //   })
  //   .then((seller) => {

  //        const review = new Review({
  //    title: title,
  //    description: description,
  //    rating:rating,
  //    sellerId: sellerId,
  //    userId:userId,
  // });

  //     review
  //       .save()
  //       .then((savedItem) => {
  //         seller.reviews.push(review);
  //         return seller.save();
  //       })
  //       .then((updatedSeller) => {
  //         res.status(201).json({
  //           message: "Item created, hurray!",
  //           review: review,
  //         });
  //       });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) err.statusCode = 500;
  //     next(err);
  //   });

  const review = new Review({
    title: title,
    description: description,
    rating:rating,
    sellerId: sellerId,
    userId:userId,
  });
Seller.findById(sellerId)
.then((seller)=>{
  review
    .save()
    .then((savedItem) => {
      seller.rating = (seller.rating*(seller.reviews.length)+parseInt(rating))/(seller.reviews.length+1);
      seller.reviews.push(review);
      return seller.save();
    })
    .then((savedItem) => {
      res.status(201).json({
        message: "Review created, hurray!",
        review: review,
        sellerId: { _id: sellerId._id, name: sellerId.name },
      });
    })
  })
  .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
  };
// exports.deleteItem = (req, res, next) => {
//   const itemId = req.params.itemId;
//   Item.findById(itemId)
//     .then((item) => {
//       if (!item) {
//         const error = new Error(
//           "Could not find any Item with the given itemId"
//         );
//         error.statusCode = 404;
//         throw error;
//       }

//       clearImage(item.imageUrl);

//       return Item.findByIdAndRemove(itemId);
//     })
//     .then((deletedItem) => {
//       return Account.findById(req.loggedInUserId);
//     })
//     .then((account) => {
//       return Seller.findOne({ account: account._id });
//     })
//     .then((seller) => {
//       seller.items.pull(itemId);
//       return seller.save();
//     })
//     .then((result) => {
//       res.status(200).json({
//         message: "Item deleted successfully.",
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCode) err.statusCode = 500;
//       next(err);
//     });
// };

// exports.editItem = (req, res, next) => {
//   const itemId = req.params.itemId;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation Failed, Incorrect data entered.");
//     error.statusCode = 422;
//     error.errors = errors.array();
//     throw error;
//   }

//   let imageUrl = req.body.image;
//   const title = req.body.title;
//   const price = req.body.price;
//   const tags = req.body.tags;
//   const description = req.body.description;

//   if (req.file) imageUrl = req.file.path;
//   if (!imageUrl) {
//     const error = new Error("Image was not found, try again.");
//     error.statusCode = 404;
//     throw error;
//   }

//   Item.findById(itemId)
//     .then((fetchedItem) => {
//       if (!fetchedItem) {
//         const error = new Error(
//           "Could not find any Item with the given itemId"
//         );
//         error.statusCode = 404;
//         throw error;
//       }

//       if (imageUrl !== fetchedItem.imageUrl) {
//         clearImage(fetchedItem.imageUrl);
//       }

//       fetchedItem.title = title;
//       fetchedItem.description = description;
//       fetchedItem.price = price;
//       fetchedItem.tags = tags;
//       fetchedItem.imageUrl = imageUrl;

//       return fetchedItem.save();
//     })
//     .then((updatedItem) => {
//       res.status(200).json({
//         message: "Item updated",
//         item: updatedItem,
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCode) err.statusCode = 500;
//       next(err);
//     });
// };

exports.getReviews = (req, res, next) => {
  Account.findById(req.loggedInUserId)
    .then((account) => {
      return Seller.findOne({ account: account._id });
    })
    .then((seller) => {
      return Item.find({ _id: { $in: seller.items } });
    })
    .then((items) => {
      res.json({ items: items });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

// exports.getItem = (req, res, next) => {
//   const itemId = req.params.itemId;
//   Item.findById(itemId)
//     .then((item) => {
//       if (!item) {
//         const error = new Error(
//           "Could not find any Item with the given itemId"
//         );
//         error.statusCode = 404;
//         throw error;
//       }
//       res
//         .status(200)
//         .json({ message: "Item fetched successfully", item: item });
//     })
//     .catch((err) => {
//       if (!err.statusCode) err.statusCode = 500;
//       next(err);
//     });
// };