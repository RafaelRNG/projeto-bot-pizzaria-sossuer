const token = '1351529088:AAESbSt01rfyG0k0W4Xaz7vW468aSZ-qNJs'
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const bot = new Telegraf(token)
const Markup = require('telegraf/markup')
const listaPizza = require('./cardapio')
const { default: Axios } = require('axios')
const unidades = require('./unidades')

const tecladoOpcoes = Markup.keyboard([
    ['Unidades', 'Cardápio'],
    ['Fazer_Pedido', 'Pedido_Realizado'],
    ['Mais_Informações']
]).resize().extra()

const tecladoBebidas = Markup.keyboard(['Sem bebidas', 'Pepsi', 'Coca-cola', 'Guaraná'], { columns: 2 }).resize().oneTime().extra()

bot.use(session())

bot.start(ctx => {
    const userId = ctx.update.message.from.id
    const nome = ctx.update.message.from.first_name

    ctx.replyWithHTML(` Olá ${nome}, Seja muito bem vindo a <i> Pizzaria Sossuer </i>!
    Abaixo irá aparecer um teclado de interações para você acessar nossos serviços!`, tecladoOpcoes)
    Axios.post('http://localhost:3333/cliente', { userId, nome })
        .then(() => console.log('salvo'))
        .then(() => console.log('deu erro'))
})

const pizza = []

listaPizza.forEach(valor => {
    pizza.push(valor)
})

bot.hears(/Unidades/, async ctx => {
    await ctx.reply('Nossas unidades são: ')
    unidades.forEach(valor => {
        ctx.reply(`${valor.unidade} \n \t ${valor.endereco} \n \t telefone: ${valor.telefone}`)
    })
})

bot.hears(/Cardápio/i, async (ctx, next) => {
    await ctx.reply('Nossos sabores de pizzas são: ')
    pizza.forEach(valor => {
        ctx.reply(`${valor}`)
    })
})

bot.hears(/Fazer_Pedido/i, async ctx => {
    console.log(ctx.update.message.from)
    await ctx.replyWithHTML(`Olá ${ctx.update.message.from.first_name} para fazer um pedido digite "<strong> meu pedido é </strong>"
     em seguida nos informe os sabores que o senhor deseja, em seguida nos informe 
    um telefone para contato, o endereço do senhor e o horário que o senhor deseja receber o seu pedido, 
    em seguida um de nossos atendentes irá atendê-lo para lhe passar o valor e o tempo de entrega`)
})

bot.hears(/meu pedido é/i, async ctx => {
    await ctx.reply(`Ok Sr.${ctx.update.message.from.first_name} anotamos o seu pedido, o senhor gostaria de levar alguma bebida?`, tecladoBebidas)
    const clienteId = ctx.update.message.from.id
    const pedido = ctx.update.message.text
    Axios.post('http://localhost:3333/pedido', { pedido, clienteId })
        .then(() => console.log('salvo'))
        .catch(() => console.log('erro'))
})

bot.hears([/Sem bebidas/i, /Pepsi/i, /Coca-cola/i, /Guaraná/i], async ctx => {
    await ctx.reply('Ok senhor!')
    await ctx.reply('Em poucos minutos um de nossos atendentes irá ligar para lhe passar o valor e o tempo de entrega')
    await ctx.reply('se o atendente pedir mais informações, passe para ele, é provável que o senhor tenha esquecido algo 😅')
    await ctx.reply('Muito obrigado por escolher a Pizzaria Sossuer 😄', tecladoOpcoes)
})

bot.hears(/Pedido_Realizado/i, async ctx => {
    await ctx.reply('sua lista de pedidos: ')
    const clienteId = ctx.update.message.from.id

    await Axios.get(`http://localhost:3333/pedido/${clienteId}`)
        .then(res => res.data)
        .then(res => Array.from(res))
        .then(res => res.map(e => ctx.reply(e.pedido)))
        .catch(() => console.log('erro lixo'))

})

bot.hears(/Mais Informações/i, ctx => {
    ctx.reply(`A Sossuer é uma Pizzaria Speranza, que faz 61 em 2020, tem uma história de sucesso, com definitivas contribuições à gastronomia de São Paulo.
    Tudo começou com o talento e a disposição da família Tarallo, que, no final dos anos 1950, deixou a terra natal, 
   estava o jeito napolitanm verdadeiros clássicos: Pizza Margherita, Pizza Napoletana, Calzone (pizza fechada), 
  Tortano (o genuíno pão de linguiça napolitano) e a Pastiera di Grano em receita exclusiva da família, do jeito que se faz na região de Nápoles`, tecladoOpcoes)
})

bot.startPolling()