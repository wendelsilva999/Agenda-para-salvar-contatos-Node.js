require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Base de Dados conectada')
        app.emit('pronto')
    })
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo')
const flash = require ('connect-flash')


const routes = require('./routes')
const path = require('path')
const helmet = require('helmet')
const csrf = require('csurf')

const meuMiddleware = require('./src/middlewares/middleware')


app.use(helmet())

app.use(express.urlencoded({extended: true}))//pode postar formularios pra dentro da aplicação e tem outra muito utilizada que e json
app.use(express.json());

//conteudo estatico
app.use(express.static(path.resolve(__dirname, 'public')))



app.use(
    session({
    secret: 'chuvachuva',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60* 60 * 24 * 7,
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTIONSTRING
    })
}))
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')


app.use(csrf())
//nossos próprios middlewares
app.use(meuMiddleware.middlewareGlobal)
app.use(meuMiddleware.checkCsrfError)
app.use(meuMiddleware.csrfMiddleware)
app.use(routes)


app.on('pronto', () => {
    app.listen(process.env.PORT || 3000, () => {
        console.log('Acessar http://localhost:3000')
        console.log('servidor executando na porta 3000')
    });
});