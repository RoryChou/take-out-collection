/**
 * Created by Administrator on 2016/12/20.
 */

/* onhashchange compatibility ==> director.js*/

var config = {
    //任意匹配hash
    '/:aksjd': function(id){
        routeController(id)
    }
};
var t = new Router(config);
//没有hash的时候，hash为home
t.init('home');

