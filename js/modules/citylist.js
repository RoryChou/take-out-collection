/**
 * Created by Administrator on 2016/12/16.
 */

/* 利用Object的create方法，创建homeObj的原型继承对象 */
var cityObj = Object.create(homeObj);

/* 利用zepto的extend方法，合并两个对象 */
cityObj = $.extend(cityObj,{
    name: '城市列表',
    elem: $('#citylist'),
    init: function () {
        this.getBaidu();
        this.eventBind();
    },
    getBaidu: function(){
        var that = this;
        //获得百度的城市编号
        //nginx
        $.ajax({
            url: '/mobile/waimai',
            data: {
                qt:'confirmcity',
                pagelets:['pager'],
                t:207896
            },
            //dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res).pagelets[1].html;
                var city_name = new RegExp('data-name="(.+)"','g');
                var city_id = /data-val="(\d+)"/g;
                var result;
                var arr_city_name = [];
                var arr_city_id = [];
                while ((result = city_name.exec(res)) != null)  {
                    ////console.log(result[1])
                    arr_city_name.push(result[1])
                }
                var result1;
                while ((result1 = city_id.exec(res)) != null)  {
                    ////console.log(result1)
                    arr_city_id.push(result1[1])
                }
                that.baidu_city_obj = {};
                for( var i in arr_city_name){
                    that.baidu_city_obj[arr_city_name[i]] = arr_city_id[i]
                }

                that.guessCity();
                that.hotCity();
                that.al();
            }
        })
        //jsonp 获取的居然都是html
        /*$.ajax({
            url: 'http://waimai.baidu.com/mobile/waimai',
            data: {
                qt:'confirmcity',
                pagelets:['pager'],
                t:207896
            },
            dataType: 'jsonp',
            success: function (res) {
                console.log(res)
            }
        })*/
    },
    eventBind: function () {
        $('.al-list').on('click','li', function () {
            //console.log(this);
            var selector = '[data-key="'+ this.textContent +'"]';
            window.scrollTo(0,$(selector).offset().top)
        })
    },
    guessCity: function () {
        var that = this;
        $.ajax({
            url: '/v1/cities',
            type: "get",
            data: {
                type: 'guess'
            },
            success: function (res) {
                var t = encodeURI(res.name);
                var id = res.id;
                var baidu_id = that.baidu_city_obj[res.name];
                $('.guess').html(res.name)[0].href = '#form-'+ t +'-'+ id +'-'+ baidu_id;
            }
        })
    },
    hotCity: function () {
        var that = this;
        $.ajax({
            url: '/v1/cities',
            type: "get",
            data: {
                type: 'hot'
            },
            success: function (res) {
                var str = '';
                for(var key in res){
                    var t = encodeURI(res[key].name);
                    var id = res[key].id;
                    var baidu_id = that.baidu_city_obj[res[key].name];
                    str += '<li><a href="#form-'+ t +'-'+ id +'-'+ baidu_id +'">'+ res[key].name +'</a></li>';
                }
                $('#hotcity').html(str);
            }
        })
    },
    al: function () {
        var that = this;
        $.ajax({
            url: '/v1/cities',
            type: "get",
            data: {
                type: 'group'
            },
            success: function (res) {
                var arr = [];
                var str = '';
                for(var key in res){
                    arr.push(key);
                    str += '<li></li>'
                }
                $('.al-list').html(str);
                arr.sort();
                that.lists(arr);

                var str2 = '';
                for(var i in arr){
                    var content = res[arr[i]];
                    str2 += '<div class="item-city">'
                           + '<h1 data-key="'+ arr[i] +'">'+ arr[i] +'</h1>'
                           + '<ul class="city-list">'
                           + that.details(content)
                           + '</ul>'
                           + '</div>'
                }
                $('.list-wrapper').html(str2);
            }
        })
    },
    lists: function (arr) {
        var als = $('.al-list li');
        for(var i in als){
            als[i].innerHTML = arr[i]
        }
    },
    details: function (res) {
        var str = '';
        for(var key in res){
            var t = encodeURI(res[key].name);
            var id = res[key].id;
            var baidu_id = this.baidu_city_obj[res[key].name];
            str += '<li><a href="#form-'+ t +'-'+ id +'-'+ baidu_id +'">'+ res[key].name +'</a></li>';
        }
        return str
    }
});
