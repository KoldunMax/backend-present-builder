
var lib = require ("../../lib/builder/index.js");
 
var printer = require("../../lib/printer/index.js"); 


var getPresentionByName = function (req, res){

    lib.getPresentationByName (req.config, req.body, function (e, r){
        if (e){
            return res.json (e);
        }
        return res.json (r);
    });

};


 
var download = function (req, res){
    var id = req.params.id; 
    console.log(id);
    printer.print (req.config, id, res, function (e, r){
        console.log (e,r);
        if (e){
           // return res.json (e);
        }
        //else .. res has already been pushed.
    });
 
 

 

};
/**** All public */

exports.getPresentionByName = getPresentionByName;
exports.download = download; 