var pdf = require("pdfkit");
var fs = require("fs");
var async = require("async");
 

 
var printSlide = function (doc, data){
    doc.addPage(); //always  on new page.
    var imgUrl =  data.background_image; //get from config
    console.log(imgUrl)
    doc.image(imgUrl, {
        x: 0.2 * 72,
        y: 0.095 * 72,
        width: (612 - 2* 0.2 * 72),
        height: (792 - 2 * 0.095 * 72)
    });
};

var printMainPage = function (doc, data){
    var imgUrl = data.presentation.main_backgroundimage; //get from config
    doc.image(imgUrl, {
        x: 0.2 * 72,
        y: 0.095 * 72,
        width: (612 - 2* 0.2 * 72),
        height: (792 - 2 * 0.095 * 72)
    });

};

var print = function (presentationid, stream, cb){

    //steap 1 : get all presentation data ..
    
    var data = {
        slides : [{
             "background_image": __dirname  + "/temp/1/" +  'pansy.jpg',
            "contents": [{
                "type": "image",
                "url": "https://a10.gaanacdn.com/images/radio_rect_mirchi/18.jpg"
                }, {
                "type": "text",
                "content": "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
                }],
            }],
        presentation : {
            main_backgroundimage: __dirname  + "/temp/1/" + 'EZvw8.jpg'
   
        }
    };

    printDoc(data, stream, function (e, r){
        cb (e, r);
    });
    

};

//data will be of type : 
// [{text : xxx, row : xxxx , col : xx}]
var printDoc = function(data, stream,  cb) {
    
    var offsets = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    

    /*
    oreientation: Portrait
Paper Size: Letter
CPI: 10.05
Left Margin: 0.20 inches (where do I adjust this?) 
LPI: 6.0 (where do I adjust this?)
Top Margin: 0.095 (where do I adjust this?)
Text Len: 64 lines
    */

    var doc = new pdf({ 
        size: 'letter', 
        layout  : 'portrait',

        margin : {
            top : 0.095 * 72,
            left: 0.2 * 72,
            right: 0.2 * 72
        } 
    });
 

      
    // doc.pipe (fs.createWriteStream('foo.pdf'));
    doc.pipe(stream);

    printMainPage (doc, data);

    for (var i=0; i< data.slides.length; i++){
        printSlide(doc, data.slides[i]);
    }

     

    //-
    doc.on('end', function() {
         
        return cb(null, true);
    });
    //--

    doc.end();
};

exports.print = print;

print ("soemthig", fs.createWriteStream(__dirname + "/p.pdf"), function (e, r){
    console.log (e, r);
});

 
