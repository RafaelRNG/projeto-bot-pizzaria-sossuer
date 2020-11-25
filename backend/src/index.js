const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const knex = require('../connection')
const porta = 3333

app.use(bodyParser.json())
app.use(cors())

app.get('/cliente', async (req, res) => {
    const data = await knex('clientes')
    return res.json(data)
})

app.get('/cliente/:userId', async (req, res) => {
    const { userId } = req.params
    const data = await knex('clientes').where("userId", userId)
    return res.json(data)
})

app.post('/cliente', async (req, res) => {
    const { userId, nome } = req.body;
    await knex('clientes').insert({ userId, nome });
    const clienteExistente = knex('clientes').where('userId', userId)
    console.log(clienteExistente)
    res.send('salvo')
})

app.get('/pedido', async (req, res) => {
    const data = await knex('pedidos')
    return res.json(data)
})

app.get('/pedido/:clienteId', async (req, res) => {
    const { clienteId } = req.params

    const data = await knex('pedidos').where("clienteId", clienteId)

    return res.json(data)
})

app.post('/pedido', async (req, res) => {
    const { pedido, clienteId } = req.body
    await knex('pedidos').insert({ pedido, clienteId })
    return res.send('salvo')
})

app.listen(porta, () => console.log('servidor rodando...'));