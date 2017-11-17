// app/routes.js
// load up the user model
var User    = require('../app/models/users');
var request = require('request');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        if (req.isAuthenticated()){
            //res.redirect('/profile');
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        }else{
            res.render('index.ejs'); // load the index.ejs file
        }
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', blockifLoggedIn, function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', blockifLoggedIn, function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // app.get('/profile/user', function(req,res){
    //     User.findOne({'local.email': req.user.local.email}, function(err, user){
    //         if (err){
    //           res.send(err);
    //         }
    //         res.json(user);
    //     });

    // })

    app.get('/addcredit', isLoggedIn, function(req, res) {
        res.render('addcredit.ejs', {
            user : req.user // get the user out of session and pass to template
            //message: req.flash('mes');
        });
    });

    app.post('/addcredit', isLoggedIn, function(req, res) {
        User.findOne({'local.email': req.user.local.email}, function(err,user){
            user.local.credit= user.local.credit+Number(req.body.credit.trim())

            user.save(function(err){
                if(err) console.log(err);
                res.redirect('/profile');
            })
        });

    });

    app.get('/readarticle', function(req, res) {
        //console.log(req);

        //console.log(req.query.article);
        var url = 'http://192.227.217.77:8888/?url='+req.query.article;
        //var url='http://www.google.com'
        //console.log(typeof url, typeof req.headers);
        //req.get({url: url});
        //res.setHeader('Content-Type', 'application/json');
        //res.send('Req OK');
        request({
            uri: url,
            method: 'GET',
            responseType: 'html'
        }, function(error, response, body) {
            if (!error) {
                console.log(body);
                res.write(body);
            } else {
                //response.end(error);
                res.write(error);
            }
            res.end();
        });
        // res.render('readarticle.ejs',{
        //     url : url
        // }); 
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

//route back to where profile.ejs page if the user is already logged in
function blockifLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return res.redirect('/');
    next();
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}