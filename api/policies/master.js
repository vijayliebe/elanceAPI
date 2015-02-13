
module.exports = function(req, res, next) {
    console.log('checking master');
    req.viewData = {};


    if(req.isAjax == true){
        req.viewData.layout = "popover";
    }else{
        req.viewData.layout = "layout";
    }
  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
