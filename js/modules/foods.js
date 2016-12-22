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
    elem: $('#foods'),
    restaurants: $('.container'),
    menu: $('.menu'),
    init: function () {
        this.bindEvent()
    },
    bindEvent: function(){
        //iscroll


        //处理点击事件
        this.menu.on('click','li', function (ev) {
            console.log(this);

        })
    },
    renderResElm: function(){
        var that = this;
        //根据hash中的店铺ID来获取餐厅信息
        //商品列表
        $.ajax({
            url: '/shopping/restaurant/'+ this.lat +'',
            /*data: {
                extras:['activities'],
                extras:['album'],
                extras:['license'],
                extras:['identification'],
                extras:['statistics'],
                latitude:'31.21491',
                longitude:'121.46878'
            },*/
            success: function (res) {
                $('.logo img').attr('src','https://fuss10.elemecdn.com/'+ that.picSrc(res.image_path) +'?imageMogr/quality/80/format/webp/')
                $('.shop-name').html(res.name)
            }
        })

        //商品详情
        $.ajax({
            url: '/shopping/v1/menu',
            data: {
                restaurant_id:that.lat
            },
            success: function (res) {
                console.log(res)
                var str = '';
                var str2 = '';
                for(var i in res){
                    str +=  '<dl>'
                            +'<dt data-name="'+ res[i].name +'">'+ res[i].name +'</dt>'
                            + that.goods(res[i].foods)
                            +'</dl>'
                    str2 += '<li>'+ res[i].name +'</li>'
                }
                //that.restaurants.html(str);
                that.menu.html(str2);

                //当列表渲染完成之后，对模拟滚动条进行初始化操作

                if(that.leftScroll && that.rightScroll) {
                    that.leftScroll.destroy(); //破环掉
                    that.rightScroll.destroy(); //破环掉
                }
                that.leftScroll = new IScroll('.pane-left', {
                    scrollbars: true,
                    preventDefault: false //防止阻止事件
                });

                /*that.rightScroll = new IScroll('.pane-right', {
                    scrollbars: true,
                    preventDefault:false
                });*/
            }
        })
    },
    picSrc: function(str){
        if(str){
            var a = str.slice(0,1)
            var b = str.slice(1,3)
            var c = str.slice(3)
            var d = str.slice(32)
            var res = a+'/'+b+'/'+c+'.'+d;

        }else {
            var res = '2/60/71357242cd5ad2e6ca5e5aae5a567png.png'
        }
        return res
    },
    goods: function(data){
        var str1 = '';
        for(var i in data){
            str1 += '<dd>'
                +'<span class="food-img">'
                +'<img src="//fuss10.elemecdn.com/'+ this.picSrc(data[i].image_path) +'?imageMogr/thumbnail/140x140/format/webp/quality/85" alt="">'
                +'</span>'
                +'<section class="food-info">'
                +'<h1 class="food-tit">'+ data[i].name +'</h1>'
                +'<strong class="food-price">¥'+ data[i].specfoods[0].price +'</strong>'
                +'<div class="cart-btn"></div>'
                +'</section>'
                +'</dd>'
        }
        return str1;
    }
});
