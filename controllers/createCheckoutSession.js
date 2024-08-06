const createCheckoutSession = async (req, res, stripe) => {

    let user = req.session.user;
    if(!user) {
        return res.status(400).send({ success: false, message: "Invalid session." });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: "price_1PkdNCByPRydIEK4C3qQs1LU",
                    quantity: 1,
                },
            ],
            client_reference_id: user,
            success_url: 'https://fukuin.dev/socrates/paymentSuccess',
            cancel_url: 'https://fukuin.dev/socrates/paymentFailed',
            automatic_tax: {enabled: true},
            metadata: {
                client_reference_id: user
            }
        });
        res.json({success: true, url: session.url});
    } catch(err) {
        console.error(err);
        res.status(400).json({success: false});
    }


}

module.exports = createCheckoutSession;