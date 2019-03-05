var pdf = require('html-pdf');
var uuid = require('node-uuid');
var builder = require("../builder/index.js");
var fs = require("fs");
var documentLib = require("../document/index.js");
var async = require("async");
var handlebars = require('handlebars');
var path = require("path");


var getOptions = function(config, base, temp) {
    return {
        directory: temp,
        base: base,
        phantomPath: config.phantomjs,
        "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid 
        "orientation": "landscape",
        childProcessOptions: config.childProcessOptions
    };
};





var hexToRgba = function(hex, opac) {

    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opac + ')';
    return result;
};

//main menu opacity
var opacMenu = function(menu) {
    if(menu && menu.navbarcolor && menu.navbaropacity) {
        var hex = menu.navbarcolor;
        var opac = menu.navbaropacity;
        return hexToRgba(hex, opac);
    }
};
//opacity of content text presentation home page
var opacContentText = function(opacity,color){
    var hex = color;
    var opac = opacity / 100;
    return hexToRgba(hex, opac);
};

//opacity of content text of slide
var opacContentTextSlide = function(opacity,color){
    var hex = color;
    var opac = opacity / 100;
    return hexToRgba(hex, opac);
};

// Main title opacity
var opacTitleText = function(pres) {
    var hex = pres.presentation.titlebackcolor;
    var opac = pres.presentation.titleopacity / 100;
    return hexToRgba(hex, opac);
};

// Main subtitle opacity
var opacSubTitleText = function(pres) {
    var hex = pres.presentation.secondtitlebackcolor;
    var opac = pres.presentation.secondtitleopacity / 100;
    return hexToRgba(hex, opac);
};

// Main subtext opacity
var opacSubText = function(pres) {
    var hex = pres.presentation.backcolor;
    var opac = pres.presentation.subopacity / 100;
    return hexToRgba(hex, opac);
};

// Opac opacity
var opacHeader = function(slide) {

    var hex = slide.headerbackcolor;
    var opac = slide.headerbackopacity / 100;
    return hexToRgba(hex, opac);

};

// content opacity
var opacContent = function(content) {
    var hex = content.backgroundcolor;
    var opac = content.backgroundimageopacity / 100;
    return hexToRgba(hex, opac);

};



var print = function(opts, html, stream, cb) {

    pdf.create(html, opts).toStream(function(e, s) {
        if (e) {
            console.log(e);
        }

        if (s) {
            s.on("end", function() {
                cb();
            });
            s.pipe(stream);
        } else {
            cb();
        }
    });
};


var printFrontPage = function(config, data, stream, cb) {
    var html = fs.readFileSync(path.join(__dirname + '/template/frontpage.html'), 'utf8');
    data.templateLocation = path.join(__dirname + "/template")
    var template = handlebars.compile(html);
    console.log('printFront', data.opts, finalHtml, stream, cb);
    var finalHtml = template(data);
    //var writeable = fs.createWriteStream (data.dir + "/main.pdf");
    print(data.opts, finalHtml, stream, cb);
};

var startPrint = function(config, data, stream, cb) {
    printFrontPage(config, data, stream, cb);

};

function replaceAll(str, find, replace) {
    
    if(str && str != 'undefined'){
         return str.replace(new RegExp(find, 'g'), replace);
    }else{
        return str;
    }
}

function renderfont(content1){
    
    content1 = replaceAll(content1,'font-size: 14pt','font-size: 5pt');
    content1 = replaceAll(content1,'font-size: 14px','font-size: 5px');
    content1 = replaceAll(content1,'font-size: 15pt','font-size: 5pt');
    content1 = replaceAll(content1,'font-size: 15px','font-size: 5px');
    content1 = replaceAll(content1,'font-size: 16pt','font-size: 6pt');
    content1 = replaceAll(content1,'font-size: 16px','font-size: 6px');
    content1 = replaceAll(content1,'font-size: 17pt','font-size: 7pt');
    content1 = replaceAll(content1,'font-size: 17px','font-size: 7px');
    content1 = replaceAll(content1,'font-size: 18pt','font-size: 8pt');
    content1 = replaceAll(content1,'font-size: 18px','font-size: 8px');
    content1 = replaceAll(content1,'font-size: 19pt','font-size: 9pt');
    content1 = replaceAll(content1,'font-size: 19px','font-size: 9px');
    content1 = replaceAll(content1,'font-size: 20pt','font-size: 10pt');
    content1 = replaceAll(content1,'font-size: 20px','font-size: 10px');
    content1 = replaceAll(content1,'font-size: 21pt','font-size: 11pt');
    content1 = replaceAll(content1,'font-size: 21px','font-size: 11px');
    content1 = replaceAll(content1,'font-size: 22pt','font-size: 12pt');
    content1 = replaceAll(content1,'font-size: 22px','font-size: 12px');
    content1 = replaceAll(content1,'font-size: 23pt','font-size: 13pt');
    content1 = replaceAll(content1,'font-size: 23px','font-size: 13px');
    content1 = replaceAll(content1,'font-size: 24pt','font-size: 14pt');
    content1 = replaceAll(content1,'font-size: 24px','font-size: 14px');
    content1 = replaceAll(content1,'font-size: 25pt','font-size: 15pt');
    content1 = replaceAll(content1,'font-size: 25px','font-size: 15px');
    content1 = replaceAll(content1,'font-size: 26pt','font-size: 16pt');
    content1 = replaceAll(content1,'font-size: 26px','font-size: 16px');
    content1 = replaceAll(content1,'font-size: 27pt','font-size: 17pt');
    content1 = replaceAll(content1,'font-size: 27px','font-size: 17px');
    content1 = replaceAll(content1,'font-size: 28pt','font-size: 18pt');
    content1 = replaceAll(content1,'font-size: 28px','font-size: 18px');
    content1 = replaceAll(content1,'font-size: 29pt','font-size: 19pt');
    content1 = replaceAll(content1,'font-size: 29px','font-size: 19px');
    content1 = replaceAll(content1,'font-size: 30pt','font-size: 20pt');
    content1 = replaceAll(content1,'font-size: 30px','font-size: 20px');
    content1 = replaceAll(content1,'font-size: 31pt','font-size: 20pt');
    content1 = replaceAll(content1,'font-size: 31px','font-size: 20px');
    content1 = replaceAll(content1,'font-size: 32pt','font-size: 20pt');
    content1 = replaceAll(content1,'font-size: 32px','font-size: 20px');
    content1 = replaceAll(content1,'font-size: 33pt','font-size: 21pt');
    content1 = replaceAll(content1,'font-size: 33px','font-size: 21px');
    content1 = replaceAll(content1,'font-size: 34pt','font-size: 22pt');
    content1 = replaceAll(content1,'font-size: 34px','font-size: 22px');
    content1 = replaceAll(content1,'font-size: 35pt','font-size: 23pt');
    content1 = replaceAll(content1,'font-size: 35px','font-size: 23px');
    content1 = replaceAll(content1,'font-size: 36pt','font-size: 24pt');
    content1 = replaceAll(content1,'font-size: 36px','font-size: 24px');

    return content1;
}


var prepSlide = function(config, slide, cb) {
    slide.slidename = slide.name;
    slide.sequence = slide.sequence;


    async.eachSeries(slide.contents, function(content, callback) {

        if (content.index === '0') {

            content.cutindexOne = content.index === '0';
            //content.cuttextOne = new handlebars.SafeString(p.present[j].typevalue);
            if (content.contentType === 'text') {
                content.isOneText = content.contentType === 'text';
                 if(content.typevalue.length > 1000){

                    content.fontsize = "9";
                 
                }else{
                    content.fontsize = "12";
                     
                }
                if(content.textbackopacity && content.backcolor){
                    content.textbackopacityslide1 = opacContentTextSlide(content.textbackopacity,content.backcolor);
                }
            } else if (content.contentType === 'image') {
                content.isOneImage = content.contentType === 'image';
                content.contentImageOpacity1 = content.typevalue/100;
            } else if (content.contentType === 'circlecounter') {
                 content.isOneCirclecounter = content.contentType === 'circlecounter';
                 var deg = getDegrees(content.number);
                 content.highlight = setHighlight(deg);
            } else if (content.contentType === 'barcounter') {
                content.isOneBarcounter = content.contentType === 'barcounter';
            } else if (content.contentType === 'pricingtable') {
                content.isOnePricingtable = content.contentType === 'pricingtable';
            } else if (content.contentType === 'tab') {
                content.isOneTab = content.contentType === 'tab';
            } else if (content.contentType === 'toggle') {
                content.isOneToggle = content.contentType === 'toggle';
            }
        }

        if (content.index === '1') {
            content.cutindexTwo = content.index === '1';
            //content.cuttextOne = new handlebars.SafeString(p.present[j].typevalue);
            if (content.contentType === 'text') {
                content.isTwoText = content.contentType === 'text';
               
                if(content.textbackopacity && content.backcolor){
                    content.textbackopacityslide2 = opacContentTextSlide(content.textbackopacity,content.backcolor);
                }
            } else if (content.contentType === 'image') {
                content.isTwoImage = content.contentType === 'image';
                content.contentImageOpacity2 = content.typevalue/100;
            } else if (content.contentType === 'circlecounter') {
                content.isTwoCirclecounter = content.contentType === 'circlecounter';
                 var deg = getDegrees(content.number);
                 content.highlight = setHighlight(deg);
            } else if (content.contentType === 'barcounter') {
                content.isTwoBarcounter = content.contentType === 'barcounter';
            } else if (content.contentType === 'pricingtable') {
                content.isTwoPricingtable = content.contentType === 'pricingtable';
            } else if (content.contentType === 'tab') {
                content.isTwoTab = content.contentType === 'tab';
            } else if (content.contentType === 'toggle') {
                content.isTwoToggle = content.contentType === 'toggle';
            }
        }

        if (content.index === '2') {
            content.cutindexThree = content.index === '2';
            //content.cuttextOne = new handlebars.SafeString(p.present[j].typevalue);
            if (content.contentType === 'text') {
                content.isThreeText = content.contentType === 'text';
                
                if(content.textbackopacity && content.backcolor){
                    content.textbackopacityslide3 = opacContentTextSlide(content.textbackopacity,content.backcolor);
                }
            } else if (content.contentType === 'image') {
                content.isThreeImage = content.contentType === 'image';
                content.contentImageOpacity3 = content.typevalue/100;
            } else if (content.contentType === 'circlecounter') {
                content.isThreeCirclecounter = content.contentType === 'circlecounter';
            } else if (content.contentType === 'barcounter') {
                content.isThreeBarcounter = content.contentType === 'barcounter';
            } else if (content.contentType === 'pricingtable') {
                content.isThreePricingtable = content.contentType === 'pricingtable';
            } else if (content.contentType === 'tab') {
                content.isThreeTab = content.contentType === 'tab';
            } else if (content.contentType === 'toggle') {
                content.isThreeToggle = content.contentType === 'toggle';
            }
        }

        if (content.index === '3') {
            content.cutindexFour = content.index === '3';
            //content.cuttextOne = new handlebars.SafeString(p.present[j].typevalue);
            if (content.contentType === 'text') {
                content.isFourText = content.contentType === 'text';
               
                if(content.textbackopacity && content.backcolor){
                    content.textbackopacityslide4 = opacContentTextSlide(content.textbackopacity,content.backcolor);
                }
            } else if (content.contentType === 'image') {
                content.isFourImage = content.contentType === 'image';
                content.contentImageOpacity4 = content.typevalue/100;
            } else if (content.contentType === 'circlecounter') {
                content.isFourCirclecounter = content.contentType === 'circlecounter';
            } else if (content.contentType === 'barcounter') {
                content.isFourBarcounter = content.contentType === 'barcounter';
            } else if (content.contentType === 'pricingtable') {
                content.isFourPricingtable = content.contentType === 'pricingtable';
            } else if (content.contentType === 'tab') {
                content.isFourTab = content.contentType === 'tab';
            } else if (content.contentType === 'toggle') {
                content.isFourToggle = content.contentType === 'toggle';
            }
        }

        if (content.contentType === 'text') {
            var content1 = content.typevalue;
            var finalcontent = renderfont(content1);
            content.content = new handlebars.SafeString(finalcontent);
        }


        var content2 = content.contenttext;
        var finaltextcontent = renderfont(content2);
        content.contenttext = new handlebars.SafeString(finaltextcontent);
          

        if(slide.islayout === 'islayoutone'){

             if(content.typevalue && content.typevalue.length > 700){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

        if(slide.islayout === 'islayouttwo'){

             if(content.typevalue && content.typevalue.length > 500){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

        if(slide.islayout === 'islayoutthree'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

        if(slide.islayout === 'islayoutfour'){

             if(content.typevalue && content.typevalue.length > 300){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

        if(slide.islayout === 'islayoutfive'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

        if(slide.islayout === 'islayoutsix'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

         if(slide.islayout === 'islayoutseven'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

         if(slide.islayout === 'islayouteight'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "7";
                 
                }else{

                    content.fontsize = "10";
                     
             }
        }

         if(slide.islayout === 'islayoutnine'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

         if(slide.islayout === 'islayoutten'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

         if(slide.islayout === 'islayouteleven'){

             if(content.typevalue && content.typevalue.length > 400){
        
                    content.fontsize = "9";
                 
                }else{

                    content.fontsize = "12";
                     
             }
        }

        if (content.contentType === 'image') {

            content.imageurl = slide.dir + "/" + content._id.toString() + "_content.jpeg";

            documentLib.getDocumentByContextId(config, { contextid: content._id.toString(), doctype: "contentimage" },
                fs.createWriteStream(content.imageurl),
                function(e, r) {

                    //  return callback();
                });
        }
        return callback();

    }, function() {

        //prepare slide image
        //
        prepBackgroundSlide(config, slide, cb);
        // cb ();
    });


};



var prepBackgroundSlide = function(config, slide, cb) {
    var backgroundimage = slide.dir + "/" + slide._id.toString() + ".png";

    slide.backgroundimage = backgroundimage;
    if(slide.slidegeneralsettings){
    slide.slidebackgroundimageopacity = slide.slidegeneralsettings.backgroundimageopacity/100;
}else{
    slide.slidebackgroundimageopacity = 1;
}
    //console.log("slide.slidebackgroundimageopacity =",slide.slidebackgroundimageopacity);
    documentLib.getDocumentByContextId(config, { contextid: slide._id.toString(), doctype: "slidebackground" },
        fs.createWriteStream(backgroundimage),
        function(e, r) {
            if(r){
                slide.isBackImage = true;
            } else{
                slide.isNotBackImage = true;
            }
            cb();
        });


};

var setHighlight = function(deg) {
    var colors = {};
    colors.center = '#F5FBFC';
    colors.highlight = '#2BCBED';
    colors.remaining = '#C8E0E8';
    if (deg <= 180) {
        var highlight = {};
        highlight.highback = 'linear-gradient(' + (90 + deg) + 
            'deg, transparent 50%,' + colors.remaining + ' 50%),linear-gradient(90deg,' 
             + colors.remaining + ' 50%, transparent 50%)';
    } else {
         var highlight = {};
         highlight.highback = 'linear-gradient(' + (deg - 90) + 'deg, transparent 50%,' + colors.highlight + ' 50%),linear-gradient(90deg,' + colors.remaining + ' 50%, transparent 50%)';
       
    }
    return highlight;
};

var getDegrees = function(percent) {

    return (percent / 100) * 360;
};


var prepBackgroundPresentation = function(config, data, cb) {
    var backgroundimage = data.dir + "/presentationbackground.png";
    data.presentation.mainbackop = data.presentation.backgroundopacity / 100;
    data.presentation.backgroundimage = backgroundimage;
    if (data.presentation && data.presentation.titlebackcolor) {
        data.presentation.mainTitleOpac = opacTitleText(data);
    }
    if (data.presentation && data.presentation.secondtitlebackcolor) {
        data.presentation.mainSubTitleOpac = opacSubTitleText(data);
    }
    if (data.presentation && data.presentation.backcolor) {
        data.presentation.mainSubTextOpac = opacSubText(data);
    }
    documentLib.getDocumentByContextId(config, { contextid: data.presentation._id.toString(), doctype: "backgroundimage" },
        fs.createWriteStream(backgroundimage),
        function(e, r) {

            cb();
        });


};

var prepFloatPresentation = function(config, data, cb) {
    var floatingimage = data.dir + "/presentationfloat.png";

    data.presentation.floatingimage = floatingimage;
    if (floatingimage) {
        documentLib.getDocumentByContextId(config, { contextid: data.presentation._id.toString(), doctype: "floatingimage" },
            fs.createWriteStream(floatingimage),
            function(e, r) {

                cb();
            });
    }

};

var prepMenuPresentation = function(config, data, cb) {
    var menulogo = data.dir + "/presentationmenu.png";
    data.menu = data.menu;
    if(data && data.menu){
        data.menu.menuNavbaropacity = opacMenu(data.menu);
        data.menu.contentmenuopacity = opacMenu(data.menu);
    }
    data.presentation.menulogo = menulogo;
    documentLib.getDocumentByContextId(config, { contextid: data.presentation._id.toString(), doctype: "menulogo" },
        fs.createWriteStream(menulogo),
        function(e, r) {

            cb();
        });


};


var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


//https://github.com/wycats/handlebars.js/

var prepBooleans = function(p) {

    for (var i = 0; i < p.slides.length; i++) {
        var slide = p.slides[i];
        for (var j = 0; j < slide.contents.length; j++) {
            slide.contents[j].isText = slide.contents[j].contentType == 'TEXT' || 'text';
            slide.contents[j].isImage = slide.contents[j].contentType == 'IMAGE' || 'image';
            slide.contents[j].iscircularcounter = slide.contents[j].contentType == 'CIRCULARCOUNTER' || 'circlecounter';
            slide.contents[j].istab = slide.contents[j].contentType == 'TAB' || 'tab';
            slide.contents[j].istoggle = slide.contents[j].contentType == 'TOGGLE' || 'toggle';
            slide.contents[j].ispricingtable = slide.contents[j].contentType == 'PRICINGTABLE' || 'pricingtable';
            slide.contents[j].isbarcounter = slide.contents[j].contentType == 'BARCOUNTER' || 'barcounter';
            slide.contents[j].isvideo = slide.contents[j].contentType == 'VIDEO' || 'video';
            slide.contents[j].isaudio = slide.contents[j].contentType == 'AUDIO' || 'audio';


        }
    }
};

var printPresentation = function(config, presentationId, writeable, cb) {
    var session = uuid.v4();

    builder.getPresentationById(config, presentationId, function(e, p) {

        builder.getCurrentHomePresent(config, presentationId, function(err, res) {
            // getting presentation data
            p.present = res;
            p.backgroundimageopacity = p.presentation.sectionsettings.backgroundopacity/100;

            p.layoutone = p.presentation.islayout === 'islayoutone';
            p.layouttwo = p.presentation.islayout === 'islayouttwo';
            p.layoutthree = p.presentation.islayout === 'islayoutthree';
            p.layoutfour = p.presentation.islayout === 'islayoutfour';
            p.layoutfive = p.presentation.islayout === 'islayoutfive';
            p.layoutsix = p.presentation.islayout === 'islayoutsix';
            p.layoutseven = p.presentation.islayout === 'islayoutseven';
            p.layouteight = p.presentation.islayout === 'islayouteight';
            p.layoutnine = p.presentation.islayout === 'islayoutnine';
            p.layoutten = p.presentation.islayout === 'islayoutten';
            p.layouteleven = p.presentation.islayout === 'islayouteleven';

    
            for (var j = 0; j < p.present.length; j++) {

                 p.currentPresent = p.present[j];

                if (p.present[j].index === '0') {

                    p.cutindexOne = p.present[j].index === '0';
                    p.currentPresentOne = p.present[j];
                  
                    if( p.present[j].typevalue && p.present[j].typevalue !== 100){
                      var cutfinalone = renderfont(p.present[j].typevalue);
                     }
                    p.cuttextOne = new handlebars.SafeString(cutfinalone);
                    var cutfinaltogone = renderfont(p.present[j].contenttext);
                    p.cutTogleOneValue = new handlebars.SafeString(cutfinaltogone);
                    if (p.currentPresent.type === 'text') {
                        p.isOneText = p.currentPresent.type === 'text';
                        if(p.currentPresentOne.textbackopacity && p.currentPresentOne.backcolor){
                            p.textbackopacity1 = opacContentText(p.currentPresentOne.textbackopacity,p.currentPresentOne.backcolor);
                        }
                    } else if (p.currentPresent.type === 'image') {
                        p.isOneImage = p.currentPresent.type === 'image';
                        p.floatImageOpacity1 = p.currentPresentOne.typevalue/100;
                    } else if (p.currentPresent.type === 'circlecounter') {
                        p.isOneCirclecounter = p.currentPresent.type === 'circlecounter';
                        var deg = getDegrees(p.currentPresent.number);
                        p.highlight = setHighlight(deg);
                    } else if (p.currentPresent.type === 'barcounter') {
                        p.isOneBarcounter = p.currentPresent.type === 'barcounter';
                    } else if (p.currentPresent.type === 'pricingtable') {
                        p.isOnePricingtable = p.currentPresent.type === 'pricingtable';
                    } else if (p.currentPresent.type === 'tab') {
                        p.isOneTab = p.currentPresent.type === 'tab';
                        p.firstTabDataOne = p.currentPresentOne.data[0].content;
                    } else if (p.currentPresent.type === 'toggle') {
                        p.isOneToggle = p.currentPresent.type === 'toggle';
                    }
                }

                if (p.present[j].index === '1') {
                    p.cutindextwo = p.present[j].index === '1';
                    p.currentPresentTwo = p.present[j];
                   
                    if( p.present[j].typevalue && p.present[j].typevalue !== 100){
                        var cutfinaltwo = renderfont(p.present[j].typevalue);
                       }
                    p.cuttexttwo = new handlebars.SafeString(cutfinaltwo);
                    var cutfinaltogtwo = renderfont(p.present[j].contenttext);
                  
                    p.cutTogleTwoValue = new handlebars.SafeString(cutfinaltogtwo);
                    if (p.currentPresent.type === 'text') {
                        p.isTwoText = p.currentPresent.type === 'text';
                        if(p.currentPresentTwo.textbackopacity && p.currentPresentTwo.backcolor){
                            p.textbackopacity2 = opacContentText(p.currentPresentTwo.textbackopacity,p.currentPresentTwo.backcolor);
                        }
                    } else if (p.currentPresent.type === 'image') {
                        p.isTwoImage = p.currentPresent.type === 'image';
                        p.floatImageOpacity2 = p.currentPresentTwo.typevalue/100;
                    } else if (p.currentPresent.type === 'circlecounter') {
                        p.isTwoCirclecounter = p.currentPresent.type === 'circlecounter';
                    } else if (p.currentPresent.type === 'barcounter') {
                        p.isTwoBarcounter = p.currentPresent.type === 'barcounter';
                    } else if (p.currentPresent.type === 'pricingtable') {
                        p.isTwoPricingtable = p.currentPresent.type === 'pricingtable';
                    } else if (p.currentPresent.type === 'tab') {
                        p.isTwoTab = p.currentPresent.type === 'tab';
                        p.firstTabDataTwo = p.currentPresentTwo.data[0].content;
                    } else if (p.currentPresent.type === 'toggle') {
                        p.isTwoToggle = p.currentPresent.type === 'toggle';
                    }
                }

                if (p.present[j].index === '2') {
                    p.cutindexthree = p.present[j].index === '2';
                    p.currentPresentThree = p.present[j];
                    if( p.present[j].typevalue && p.present[j].typevalue !== 100){
                        var cutfinalthree = renderfont(p.present[j].typevalue);
                    }
                    p.cuttextthree = new handlebars.SafeString(cutfinalthree);
                    var cutfinaltogthree = renderfont(p.present[j].contenttext);
                    p.cutTogleThreeValue = new handlebars.SafeString(cutfinaltogthree);
                    if (p.currentPresent.type === 'text') {
                        p.isThreeText = p.currentPresent.type === 'text';
                        if(p.currentPresentThree.textbackopacity && p.currentPresentThree.backcolor){
                            p.textbackopacity3 = opacContentText(p.currentPresentThree.textbackopacity,p.currentPresentThree.backcolor);
                        }
                    } else if (p.currentPresent.type === 'image') {
                        p.isThreeImage = p.currentPresent.type === 'image';
                        p.floatImageOpacity3 = p.currentPresentThree.typevalue/100;
                    } else if (p.currentPresent.type === 'circlecounter') {
                        p.isThreeCirclecounter = p.currentPresent.type === 'circlecounter';
                        var deg = getDegrees(p.currentPresent.number);
                        p.highlight = setHighlight(deg);
                    } else if (p.currentPresent.type === 'barcounter') {
                        p.isThreeBarcounter = p.currentPresent.type === 'barcounter';
                    } else if (p.currentPresent.type === 'pricingtable') {
                        p.isThreePricingtable = p.currentPresent.type === 'pricingtable';
                    } else if (p.currentPresent.type === 'tab') {
                        p.isThreeTab = p.currentPresent.type === 'tab';
                        p.firstTabDataThree = p.currentPresentThree.data[0].content;
                    } else if (p.currentPresent.type === 'toggle') {
                        p.isThreeToggle = p.currentPresent.type === 'toggle';
                    }
                }

                if (p.present[j].index === '3') {
                    p.cutindexfour = p.present[j].index === '3';
                    p.currentPresentFour = p.present[j];
                    if( p.present[j].typevalue && p.present[j].typevalue !== 100){
                        var cutfinalfour = renderfont(p.present[j].typevalue);
                    }
                    p.cuttextfour = new handlebars.SafeString(cutfinalfour);
                    var cutfinaltogfour = renderfont(p.present[j].contenttext);
                    p.cutTogleFourValue = new handlebars.SafeString(cutfinaltogfour);
                    if (p.currentPresent.type === 'text') {
                        p.isFourText = p.currentPresent.type === 'text';
                        if(p.currentPresentFour.textbackopacity && p.currentPresentFour.backcolor){
                            p.textbackopacity4 = opacContentText(p.currentPresentFour.textbackopacity,p.currentPresentFour.backcolor);
                        }
                    } else if (p.currentPresent.type === 'image') {
                        p.isFourImage = p.currentPresent.type === 'image';
                        p.floatImageOpacity4 = p.currentPresentFour.typevalue/100;
                    } else if (p.currentPresent.type === 'circlecounter') {
                        p.isFourCirclecounter = p.currentPresent.type === 'circlecounter';
                    } else if (p.currentPresent.type === 'barcounter') {
                        p.isFourBarcounter = p.currentPresent.type === 'barcounter';
                    } else if (p.currentPresent.type === 'pricingtable') {
                        p.isFourPricingtable = p.currentPresent.type === 'pricingtable';
                    } else if (p.currentPresent.type === 'tab') {
                        p.isFourTab = p.currentPresent.type === 'tab';
                        p.firstTabDataFour = p.currentPresentFour.data[0].content;
                    } else if (p.currentPresent.type === 'toggle') {
                        p.isFourToggle = p.currentPresent.type === 'toggle';
                    }
                }

            }

        });

        if (e || !p) {
            return cb(e, p);
        }
        //1. create this new director.
        var dir = config.tempdir + "/" + session;
        console.log('new dir print----------', dir);
        console.log("config.phantomjs--------------------", config.phantomjs);
        var opts = getOptions(config, dir, config.tempdir);


        p.dir = dir;
        p.opts = opts;
        // prepBooleans (p);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        prepBackgroundPresentation(config, p, function() {

            prepFloatPresentation(config, p, function() {

                prepMenuPresentation(config, p, function() {

                    async.each(p.slides, function(slide, caback) {

                        slide.dir = dir;
                        slide.menu = p.menu;
                        //console.log("slide.menu",slide.menu);
                        slide.menulogo = slide.dir + "/presentationmenu.png";
                        slide.layoutone = slide.islayout === 'islayoutone';
                        slide.layouttwo = slide.islayout === 'islayouttwo';
                        slide.layoutthree = slide.islayout === 'islayoutthree';
                        slide.layoutfour = slide.islayout === 'islayoutfour';
                        slide.layoutfive = slide.islayout === 'islayoutfive';
                        slide.layoutsix = slide.islayout === 'islayoutsix';
                        slide.layoutseven = slide.islayout === 'islayoutseven';
                        slide.layouteight = slide.islayout === 'islayouteight';
                        slide.layoutnine = slide.islayout === 'islayoutnine';
                        slide.layoutten = slide.islayout === 'islayoutten';
                        slide.layouteleven = slide.islayout === 'islayouteleven';

                        prepSlide(config, slide, function(e, r) {

                            caback();
                        });
                    }, function() {
                        var file = path.join(dir+ "/main.pdf");
                        console.log('start printing--------------------------', file);
                        startPrint(config, p, fs.createWriteStream(file), function(e, r) {


                            var img = fs.readFileSync(file);
                            writeable.writeHead(200, { 'Content-Type': 'application/pdf' });
                            writeable.end(img, 'binary');
                            //  deleteFolderRecursive (dir); 
                        })
                    });
                });
            });
        });
    });
};

var test = function() {
    var config = require("../../config/config.js");
    printPresentation(config, "5885e52b97a98626071a068e", function(e, r) {
        console.log(e, r);
    });
};

//test ();


exports.print = printPresentation;