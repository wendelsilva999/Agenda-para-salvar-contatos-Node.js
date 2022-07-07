const { async } = require('regenerator-runtime');
const Contato = require('../models/ContatoModel')
exports.index = (req, res) =>{
    res.render('contato',{
        contato: {}
    });
};

//essa função só vai receber e salvar os dados e redirecionar para outra página
exports.register = async (req, res) => {
    try{
        const contato = new Contato(req.body);
        await contato.register();

        if(contato.errors.length > 0){
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('back'));//tava back antes
            return;
        }

        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    }catch(e){
        console.log(e)
        return res.render('404');
    }
}

exports.editIndex = async function(req, res){
    //se não tiver contato
    if(!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id)
    if(!contato) return res.render('404');

    res.render('contato', {contato})
};


exports.edit = async function(req, res){
    if(!req.params.id) return res.render('404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if(contato.errors.length > 0){
        req.flash('errors', contato.errors);
        req.session.save(() => res.redirect('/contato/index'));//tava back antes
        return;
    }

    req.flash('success', 'Contato editado com sucesso.');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;
}

exports.delete = async function(req, res){
    if(!req.params.id) return res.render('404');

    const contato = await Contato.delete(req.params.id);
    if(!contato) return res.render('404');

    req.flash('success', 'Contato deletado com sucesso.')
    req.session.save(() => res.redirect('back'));
    return;
};