/**
 * Created by Administrator on 2016/12/16.
 */
/**
 * Created by Administrator on 2016/12/16.
 */

/* 利用Object的create方法，创建homeObj的原型继承对象 */
var foodsObj = Object.create(homeObj);

/* 利用zepto的extend方法，合并两个对象 */
foodsObj = $.extend(foodsObj,{
    name: '排名页',
    restaurants: $('#foods'),
    init: function () {
        this.bindEvent()
    },
    bindEvent: function(){

    },
    renderResElm: function(){
        alert(1)
    }
});
