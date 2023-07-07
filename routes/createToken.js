const axios = require('axios');
const access_token = process.env.ACCESS_TOKEN;

module.exports.createToken = async(req, res, next) => {
    try {
        const cardData = {
            card_number: req.body.cardNumber,
            cardholder: {
                name: req.body.cardName,
                identification: {
                    type: req.body.identificationType,
                    number: req.body.identificationNumber,
                },
            },
            expiration_month: req.body.expirationMonth,
            expiration_year: req.body.expirationYear,
            security_code: req.body.securityCode,
            transaction_amount: req.body.transaction_amount,
            installments: req.body.installments,
        };
        const response = await axios.post(
            'https://api.mercadopago.com/v1/card_tokens',
            cardData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const paymentToken = response.data.id;

        req.middlewareToken = paymentToken;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Erro ao gerar Token de pagamento', err});
    }
}