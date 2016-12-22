/**
 * Created by Administrator on 2016/12/16.
 */

/* 利用Object的create方法，创建homeObj的原型继承对象 */
var formObj = Object.create(homeObj);

/* 改变formObj的实例属性 */
/*formObj.name = '表单页';
formObj.elem = $('#form');*/

/* 利用zepto的extend方法，合并两个对象 */
formObj = $.extend(formObj,{
    name: '表单页',
    elem: $('#form'),
    elmBtn: $('#elm'),
    baiduBtn: $('#baidu'),
    input: $('#city-name'),
    meituanBtn: $('#meituan'),
    contentBox: $('#content'),
    init: function(){
        this.contentBox.html('');
        this.input.val('');
        this.changeCity()
        this.bindEvent()
        this.elm()
        this.baidu()
        this.meituan()
    },
    changeCity: function () {
        //console.log('changeCity')
        var hash = location.hash.split('-');
        var cityname = hash[1] || "上海";
        this.city_name = decodeURI(cityname);
        $('#form-city').html(this.city_name);
        //处理城市id
        this.city_id = hash[2] || 1;
        this.baidu_city_id = hash[3] || 269;
    },
    bindEvent: function(){

    },
    elm: function(){
        var that =this;
        //nginx反向代理
        this.elmBtn.click(function(){
            //console.log('elmBtn')
            //获取输入框内容
            var content = $('#city-name').val();
            $.ajax({
                url: "/v1/pois",
                data: {
                    city_id:that.city_id,
                    keyword:content,
                    type:'search'
                },
                type: 'get',
                success: function(res){
                    console.log(res)
                    //动态生成结果内容
                    //that.contentBox.empty();
                    var str = '';
                    for(var key in res){
                        var address = res[key].address;
                        var lat = res[key].latitude;
                        var lon = res[key].longitude;
                        str += '<li><a href="#home-'+ lat +'-'+ lon +'-elm">'+ address +'</a></li>'
                    }
                    that.contentBox.html(str);
                }
            })

            //jsonp test
            /*$.ajax({
                url: "https://mainsite-restapi.ele.me/v1/pois",
                data: {
                    city_id:that.city_id,
                    keyword:content,
                    type:'search'
                },
                type: 'get',
                dataType: "jsonp",
                success: function(res){
                    //console.log(res)
                    var str = '';
                    for( var i in res){
                        str += '<li>'+ res[i].address +'</li>'
                    }
                    that.contentBox.html(str);
                }
            })*/
        })
    },
    baidu: function(){
        var that =this;
        this.baiduBtn.click(function(){
            //console.log('click')
            //获取输入框内容
            var content = $('#city-name').val();
            if(that.baidu_city_id === "undefined"){
                alert('百度外卖暂时不支持此城市，敬请期待！');
                history.back();
                return;
            }
            // jsonp or nginx
            $.ajax({
                url: "http://waimai.baidu.com/waimai",
                dataType: "jsonp",
                /*dataType: "json",*/
                data: {
                    qt:'poisug',
                    wd: content,
                    /*cb:'suggestion_1482233874292',*/
                    cid: that.baidu_city_id,
                    b:'',
                    type:0,
                    newmap:1,
                    ie:'utf-8'
                },
                type: 'get',
                success: function (res) {
                    //动态生成结果内容
                    var str = '';
                    for(var key in res.s){
                        var position = res.s[key].split('$');
                        var address = position[3];
                        var lat = position[5].split(',')[0];
                        var lon = position[5].split(',')[1];
                        str += '<li><a href="#home-'+ lat +'-'+ lon +'-baidu">'+ address +'</a></li>'
                    }
                    that.contentBox.html(str);
                }
            })
        })

    },
    meituan: function(){
        var that =this;
        this.meituanBtn.click(function(){
            //获取输入框内容
            var content = $('#city-name').val();
            if(that.baidu_city_id === "undefined"){
                alert('美团外卖暂时不支持此城市，敬请期待！');
                history.back();
                return;
            }
            //cors or jsonp or nginx
            $.ajax({
                url: "http://restapi.amap.com/v3/place/text",
                dataType: "json",
                //dataType: "jsonp",
                data: {
                    s:'rsv3',
                    children:'',
                    key:'3f3868abdb36336114bde5ab6eecdb68',
                    types:'商务住宅|学校信息|生活服务|公司企业|餐饮服务|购物服务|住宿服务|交通设施服务|娱乐场所|医院类型|银行类型|风景名胜|科教文化服务|汽车服务',
                    offset:10,
                    city: that.city_name,
                    page:1,
                    language:'zh_cn',
                    platform:'JS',
                    logversion:2.0,
                    sdkversion:1.3,
                    appname: 'http://i.waimai.meituan.com/shanghai?city_id=310100',
                    csid:'74A7660A-7A88-430F-953E-DE46F95F7B81',
                    keywords: content
                },
                xhrFields: 'Access-Control-Allow-Origin:*',
                type: 'get',
                success: function (res) {
                    //console.log(res)
                    //动态生成结果内容
                    var str = '';
                    res = res.pois;
                    for(var key in res){
                        var address = res[key].address;
                        var lat = res[key].location.split(',')[1];
                        var lon = res[key].location.split(',')[0];
                        str += '<li><a href="#home-'+ lat +'-'+ lon +'-meituan">'+ address +'</a></li>'
                    }
                    that.contentBox.html(str);
                }
            })
        })
    }
});

