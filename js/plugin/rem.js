/**
 * Created by Administrator on 2016/12/16.
 */
/* 计算当前页面的root font-size */
(function (){
    var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
    document.documentElement.style.fontSize = deviceWidth*(20/320)+"px";
})();