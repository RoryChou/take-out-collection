/**
 * Created by Administrator on 2016/12/16.
 */
var prev = null;
var current = null;
/* 建立对象与hash映射表 */
var HashModuleMap = {
    home: homeObj,
    foods: foodsObj,
    form: formObj,
    citylist: cityObj
};
var initMap = {

}
function routeController(id){
    var hash = id.split('-');
    //console.log(hash);
    if(hash[0] === 'form'){
        hash = 'form';
        HashModuleMap['form'].changeCity();
    }
    if(hash[0] === 'home'){
        hash = 'home';
        HashModuleMap['home'].hash();
    }
    if(hash[0] === 'foods'){
        hash = 'foods';
        HashModuleMap['foods'].hash();
    }
    hash = hash ||'home';
    /* 前一张leave，当前张enter*/
    prev&&prev.leave();
    current = HashModuleMap[hash];
    current.enter();
    prev = current;
    //location.hash = hash;
    //console.log(initMap);
    /*初始化每个页面*/
    if(!initMap[hash]){
        current.init();
        //console.log(current,"init")
        initMap.hash = true;
    }
}