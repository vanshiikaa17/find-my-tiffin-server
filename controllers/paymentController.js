const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
    console.log("entered payment");
    try {
        const newPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            metadata: {
                company: "Garden Beans"
            }
        });

        res.status(200).json({ success: true, client_secret: newPayment.client_secret });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const sendAPIKey = async (req, res) => {
    try {
        res.status(200).json({
            stripeAPIKey: process.env.STRIPE_API_KEY,
        });
    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message,
        });
    }

}
const createSession = async(req, res)=>{
const {products} = req.body;
console.log(products);
const lineItems=products.map((product)=>(
    {
        price_data:{
            currency:"inr",
            product_data:{
                name: product.itemId.title
            },
            unit_amount:product.itemId.price * 100,
        },
        quantity: product.quantity
    }
)

)
const session =await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    
    mode:"payment",
    line_items:lineItems,
    success_url:"http://localhost:3000/orders",
    cancel_url:"http://localhost:3000/cancel"
});

res.json({id:session.id})

}
module.exports = {
    payment, sendAPIKey, createSession
}