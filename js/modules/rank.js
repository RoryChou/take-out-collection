/**
 * Created by Administrator on 2016/12/16.
 */
/**
 * Created by Administrator on 2016/12/16.
 */

/* 利用Object的create方法，创建homeObj的原型继承对象 */
var rankObj = Object.create(homeObj);

/* 利用zepto的extend方法，合并两个对象 */
rankObj = $.extend(rankObj,{
    name: '排名页',
    elem: $('#rank')
});
