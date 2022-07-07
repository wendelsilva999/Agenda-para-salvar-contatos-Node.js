module.exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user;
    next()
}

module.exports.checkCsrfError = (error, req, res, next) => {
    //se for qualquer erro renderiza a pagina de erro logo
    if(error){
        return res.render('404')
    }
    next()
}
//csrfToken e o nome da var que eu quis por eu escolho
module.exports.csrfMiddleware = (req, res, next)=>{
    res.locals.csrfToken = req.csrfToken()
    next()
}



exports.loginRequired = (req, res, next) =>{
    if(!req.session.user){
        req.flash('errors', 'Você precisa fazer login.')
        req.session.save(()=> res.redirect('/'));
        return;
    }
    next()
}