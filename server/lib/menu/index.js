var request = require("request");



// Save/Update menu

var saveMenuDetails = function(config, menu, reqsession, cb) {

    // if (menu.name === null || menu.name.trim().length === 0) {
    //     return cb({ error: 'invalid menu name ' });
    // }
    if (menu._id) {

        menu._id = config.ObjectID(menu._id);
        menu.type = "updated";

    } else {
        menu.type = "created";
    }
    menu.createdon = new Date();
    menu.updatedon = new Date();
    menu.logoimageopacity = (menu.logoimageopacity / 100);
    menu.navbaropacity = (menu.navbaropacity / 100);
    menu.navbarimageopacity = (menu.navbarimageopacity / 100);
    menu.orgid = reqsession.user.orgid;
    menu.isenable = (menu.isenable) ? menu.isenable : false;
    menu.iscustomerenable = (menu.iscustomerenable) ? menu.iscustomerenable : false;

    config.collections.menus.save(menu, function(e, response) {
        saveMenuActivty(config, menu, reqsession)
        return cb(response);
    });
};
var saveMenuActivty = function(config, menu, reqsession) {

    var menus = {};
    menus.objecttype = "menu";
    menus.type = menu.type;
    menus.activity_name = menu.name;
    menus.activity_date = new Date();
    menus.activity_by = reqsession.user.username;
    menus.user_id = reqsession.user.userid.toString();
    menus.org_id = menu.orgid;
    menus.presentation_id = menu.presentid;
    menus.client_id = menu.clientid;
    config.collections.recentactivity.save(menus, function(err, response) {

    });

};

/*************public function************/
exports.saveMenuDetails = saveMenuDetails;