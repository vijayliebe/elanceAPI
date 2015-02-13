var phantom 	= require('phantom');
//var webserver 	= require('webserver');
//var phridge 	= require('phridge');
//var casper = require('casperjs');

////define ip and port to web service
//var ip_server = '127.0.0.1:1337';
//
////includes web server modules
//var server = require('webserver').create();

module.exports = {

    getElanceTitle : function(){


        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.open('https://api.elance.com/api2/oauth/authorize?client_id=54db1119e4b0ce56b5a32eb8&redirect_uri=http://localhost:1337/back&scope=basicInfo&response_type=code', function (status) {
                //page.open('https://www.elance.com/php/landing/main/login.php?redirect=http%3A%2F%2Fwww.elance.com%2Fmyelance', function (status) {
                    if ( status === "success" ) {
                        //page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function () { //it was creating issue - undefiend $('loginForm')
                            page.evaluate(function () {
                                //$('form#loginForm input#login_name').val('vijayliebe');
                                //$('form#loginForm input#passwd').val('iliebe101251');
                                //$('a#spr-sign-in-btn-standard').click();


                                document.getElementById('login_name').value = '';
                                document.getElementById('passwd').value = '';

                                var a = document.querySelector('a#spr-sign-in-btn-standard');
                                var e = document.createEvent('MouseEvents');
                                e.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
                                a.dispatchEvent(e);
                                waitforload = true;

                            });
                        //});

                        page.render('login0.png');

                        setTimeout(function () {
                            console.log('Trust Page');


                            page.evaluate(function () {

                                document.getElementById('challengeAnswerId').value = 'abhinash';

                                var a = document.querySelector('a#ContinueLogin');
                                var e = document.createEvent('MouseEvents');
                                e.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
                                a.dispatchEvent(e);
                                waitforload = true;

                            });

                            page.render('login1.png');

                            //ph.exit();
                        }, 7000);

                        setTimeout(function () {
                            console.log('Auth Page');
                            page.render('login2.png');

                            page.evaluate(function () {

                                var a = document.querySelector('a.btn-large-normal');
                                var e = document.createEvent('MouseEvents');
                                e.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
                                a.dispatchEvent(e);
                                waitforload = true;

                            });

                        }, 14000);

                        setTimeout(function () {
                            console.log('Auth redirected Page');
                            page.render('login3.png');

                            page.evaluate((function () {
                                 return document.URL;
                            }),function(currentURL){
                                console.log(currentURL);
                            });

                            //ph.exit();
                        }, 20000);

                        setTimeout(function () {
                            console.log('Finished');
                            ph.exit();
                        }, 25000);

                    }



                });

            });
        });







        //using casperjs

        //start web server
//        var service = server.listen(ip_server, function(request, response) {
//
//            var links = [];
//            var casper = require('casper').create();
//
//            function getLinks() {
//                var links = document.querySelectorAll('h3.r a');
//                return Array.prototype.map.call(links, function(e) {
//                    return e.getAttribute('href')
//                });
//            }
//
//            casper.start('http://google.fr/', function() {
//                // search for 'casperjs' from google form
//                this.fill('form[action="/search"]', { q: 'casperjs' }, true);
//            });
//
//            casper.then(function() {
//                // aggregate results for the 'casperjs' search
//                links = this.evaluate(getLinks);
//                // now search for 'phantomjs' by filling the form again
//                this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
//            });
//
//            casper.then(function() {
//                // aggregate results for the 'phantomjs' search
//                links = links.concat(this.evaluate(getLinks));
//            });
//
//            //
//            casper.run(function() {
//                response.statusCode = 200;
//                //sends results as JSON object
//                response.write(JSON.stringify(links, null, null));
//                response.close();
//            });
//
//        });
//        console.log('Server running at http://' + ip_server+'/');







//phridge.spawn() creates a new PhantomJS process
//        phridge.spawn()
//
//            .then(function (phantom) {
//                // phantom.openPage(url) loads a page with the given url
//                var linkURL = "https://api.elance.com/api2/oauth/authorize?client_id=54d7fa1be4b0ce56b5a32eb5&scope=basicInfo&response_type=code";
//                return phantom.openPage(linkURL);
//            })
//
//            .then(function (page) {
//                // page.run(fn) runs fn inside PhantomJS
//                page.run(function () {
//                    // Here we're inside PhantomJS, so we can't reference variables in the scope
//
//                    // 'this' is an instance of PhantomJS' WebPage as returned by require("webpage").create()
//                    this.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function () {
//                    this.evaluate(function () {
//                        //return document.querySelector("h1").innerText;
//                        //return document.title;
//
//                                $('form#loginForm input#login_name').val('vijayliebe');
//                                $('form#loginForm input#passwd').val('iliebe101251');
//                                //$('a#spr-sign-in-btn-standard').click();
//
//                                var a = document.querySelector('a#spr-sign-in-btn-standard');
//                                var e = document.createEvent('MouseEvents');
//                                e.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
//                                a.dispatchEvent(e);
//                                waitforload = true;
//                    });
//                    });
//
//
//                });
//
//                setTimeout(function () {
//                    console.log('stop waiting...');
//                    page.render('login.png');
//                    phridge.disposeAll;
//
//                }, 15000);
//
//            });
//
//            // phridge.disposeAll() exits cleanly all previously created child processes.
//            // This should be called in any case to clean up everything.
////            .finally(phridge.disposeAll)
////
////            .done(function (text) {
////                console.log("Headline on example.com: '%s'", text);
////                return text;
////            }, function (err) {
////                // Don't forget to handle errors
////                // In this case we're just throwing it
////                throw err;
////            });

    },

    trustPageEvalute : function(){
        document.getElementById('challengeAnswerId').value = 'abhinash';

        var a = document.querySelector('a#ContinueLogin');
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
        a.dispatchEvent(e);
        waitforload = true;
    },

    authPageEvaluate : function(){
        document.getElementById('challengeAnswerId').value = 'abhinash';

        var a = document.querySelector('a#ContinueLogin');
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
        a.dispatchEvent(e);
        waitforload = true;
    }
}



