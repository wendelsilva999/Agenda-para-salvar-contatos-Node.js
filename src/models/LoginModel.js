const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login(){
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({email: this.body.email})

        if(!this.user){
            this.errors.push('Usuário não existe.');
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha inválida');
            this.user = null; 
            return
        }
    }


    async register(){
        this.valida()

        if(this.errors.length > 0) return;

        await this.userExists();

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        this.user = await LoginModel.create(this.body)//aqui salvo na base de dados, depois de garantido que, só tem email e password, e quero preencher a variavel user com o usuario que está sendo criado aqui, o try e porque senão fica promesas sem resolver e com erro ai o programa para de funcionar né   
    }

    async userExists(){
        //procura no DB se já tem o email igual o email enviado aqui retorar o user ou null
        this.user = await LoginModel.findOne({email: this.body.email})
        if(this.user) this.errors.push('Usuário já existe.')
    }


    valida(){
        this.cleanUp()
        //validação
        //O e-mail precisa ser válido
        if(!validator.isEmail(this.body.email)){
            this.errors.push('E-mail inválido')
        }
        //A senha precisa ter de 3 a 50 caractere
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('A senha precisa ter entre 3 a 50 caracteres');
        }
    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Login;