/**
 * Created by Administrator on 2016/12/16.
 */
var homeObj = {
    name:"首页",
    elem: $('#home'),
    restaurants: $('.restaurants'),
    init: function(){

        this.bindEvent();
    },
    bindEvent: function(){

    },
    enter: function(){
        this.elem.show()
    },
    leave: function(){
        this.elem.hide()
    },
    hash: function () {
        this.restaurants.html('正在刷新');
        var locations = location.hash.split('-');
        this.lat = locations[1];
        this.lon = locations[2];
        var platform = locations[3];
        if(platform == "elm"){
            this.renderResElm();
        }else if(platform == "baidu"){
            this.renderResBaidu();
        }else if(platform == "meituan"){
            document.cookie = 'w_latlng='+ this.lat.replace('.','') +','+ this.lon.replace('.','') +';';
            this.renderResMeituan();
        }else {
            this.restaurants.html('<a href="#citylist">选择城市</a>')
        }
    },
    renderResElm : function () {
        var that = this;
        //根据hash中的经纬度来获取餐厅信息
        $.ajax({
            url: '/shopping/restaurants',
            data: {
                latitude:that.lat,
                longitude:that.lon,
                offset:0,
                limit:20,
                extras:['activities']
            },
            success: function (res) {
                //console.log(res)
                var str = '';
                for(var i in res){
                    str += '<li>'+ res[i].name +'</li>'
                }
                that.restaurants.html(str);
            }
        })
    },
    renderResBaidu: function () {
        var that = this;
        //根据hash中的经纬度来获取餐厅信息
        $.ajax({
            url: '/mobile/waimai',
            data: {
                qt:'shoplist',
                lat:that.lat,
                lng:that.lon,
                page:0,
                count:20,
                display:'json'
            },
            dataType: 'json',
            success: function (res) {
                res = res.result.shop_info;
                var str = '';
                for(var i in res){
                    str += '<li>'+ res[i].shop_name +'</li>'
                }
                that.restaurants.html(str);
            }
        })
    },
    renderResMeituan: function () {
        var that = this;
        //根据hash中的经纬度来获取餐厅信息
        $.ajax({
            url: '/ajax/v6/poi/filter',
            data: {
                lat: that.lat,
                lng: that.lon,
                page_index:0,
                apage:1
            },
            type: 'post',
            //dataType: 'json',
            success: function (res) {
                //console.log(res)
                var obj = (function m(e) {
                    var t = (e.length & 7) + 1
                        , n = "";
                    for (var r = 0, i = e.length; r < i; r++)
                        n += String.fromCharCode(e.charCodeAt(r) - t);
                    return n = JSON.parse(n), n
                })(res.data);
                obj = obj.poilist;
                var str = '';
                for(var i in obj){
                    str += '<li>'+ obj[i].name +'</li>'
                }
                that.restaurants.html(str);
            }
        })
    }
};