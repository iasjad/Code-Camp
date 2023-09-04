const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('sucsses', 'Welcome to the camp champ!');
            res.redirect('/campgrounds')
        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('sucsses', 'Welcome back champ');
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('sucsses', 'see you soon champ');
    res.redirect('/campgrounds');
}