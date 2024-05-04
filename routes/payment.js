const express=require("express");
const { payment, sendAPIKey, createSession } = require("../controllers/paymentController");

const router = express.Router();
const auth = require("../middleware/auth");

//new payment
router.route("/process/newpayment").post(payment)

//sending stripe API key
router.route("/stripeapi").get(sendAPIKey);
router.route("/create-checkout-session").post(createSession);

module.exports=router;