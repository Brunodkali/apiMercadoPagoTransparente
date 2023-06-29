const request = require("supertest");
const server = require("../index");

describe('Consultar cliente', () => {
    it('Dados cliente', async () => {
        jest.setTimeout(30000);
        const response = await request(server)
        .get('/consultaCliente')
        .send({
            cardholderEmail: "duartebruno581@gmail.com",
        });
        
        console.log(response.text);
        expect(response.status).toBe(200);
    });
});

describe('Consultar transacao', () => {
    it('Dados transacao', async () => {
        jest.setTimeout(30000);
        const response = await request(server)
        .get('/consultaTransacao/idPayment')
        
        console.log(response.text);
        expect(response.status).toBe(200);
    });
});