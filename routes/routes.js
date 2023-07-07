const { Router } = require('express');
const routes = new Router();
const mercadopago = require('mercadopago');
const { createToken } = require("./createToken.js")

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
    integrator_id: process.env.INTEGRATOR_ID
});

routes.get('/consultaCliente', async (req, res) => {
    try {
        const existingCustomer = await mercadopago.customers.search({ email: req.body.cardholderEmail });
        let costumer;
        
        if (existingCustomer.body.results.length > 0) {
            costumer = existingCustomer.body.results[0];

            res.status(200).json({ costumer });
        } else {
            res.status(404).json({ message: "Cliente não encontrado" });
        }

    } catch (err) {
        res.status(400).json({ error: 'Erro ao encontrar cliente' });
    }
});

routes.get('/consultaTransacao/:id', async (req, res) => {
    try {
        const paymentId = req.params.id;
        
        mercadopago.payment.capture(paymentId, mercadopago, (err, response) => {
            if (err) {
                res.status(404).json({ message: "Transação não encontrada:", err });
            } else {
                res.status(200).json({ response });
            }
        });

    } catch (err) {
        res.status(400).json({ error: 'Erro ao encontrar transação' });
    }
});

routes.post('/checkout', createToken, async (req, res) => {
    try {
        const payment = {
            payer: {
                email: req.body.email,
                identification: {
                    type: req.body.identificationType,
                    number: req.body.identificationNumber
                }
            },
            payment_method_id: req.body.payment_method_id,
            transaction_amount: Number(req.body.transaction_amount),
            installments: Number(req.body.installments),
            token: req.middlewareToken
        }
        const response = await mercadopago.payment.create(payment);
        const { status, status_detail, id, card, payment_method, date_approved } = response.body;

        return res.status(201).json({ 
            status, 
            status_detail, 
            id, 
            card, 
            payment_method, 
            date_approved 
        });
    } catch(err) {
        if (err.cause && err.cause.length > 0) {
          if (err.cause[0].code === 2131) {
            return res.status(405).json({ message: 'Erro de inferência de métodos de pagamento', err });
          } else if (err.cause[0].code === 3003) {
            return res.status(401).json({ message: "Processamento card_id_token inválido", err });
          }
        }
        return res.status(400).json({ message: "Erro ao processar pagamento", err });
      }
});

module.exports = routes;