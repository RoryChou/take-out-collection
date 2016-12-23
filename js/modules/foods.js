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
    paneRight: $('.pane-right'),
    menuLists: null,
    scrollFlag: true,
    scrT: $('.pane-right').scrollTop(),
    init: function () {
        this.bindEvent()
    },
    bindEvent: function(){
        //scroll event
        var that = this;
        this.paneRight.on('scroll',function(){
            if(that.scrollFlag) {
                that.scrollFlag = false;
                //判断每个dt的相对高度,当其小于零的时候，进行menu的切换操作
                that.scrT = this.scrollTop;
                //console.log(scrT)
                for (var i in that.dtMenuArr) {
                    if (that.scrT < that.dtMenuArr[i]) {
                        i = (i == 0? 1:i);
                        that.menuActive(that.menuLists.eq(i - 1));
                        that.scrollFlag = true;
                        break;
                    }
                }
            }
        });

        /*处理点击事件*/
        var move = 0;
        this.menu.on('click','li', function () {
            if(that.scrollFlag){
                that.scrollFlag = false;
                that.menuActive($(this));
                var attr = 'dt[data-name="'+ this.innerHTML +'"]';
                var target = $(attr);
                var fatherTop = $('.container').offset().top;
                var y = target.offset().top - fatherTop;

                //$('.pane-right').scrollTop(y);
                var dis = y-that.scrT;
                var timer = setInterval(function () {
                    that.scrT += dis/(500/13);
                    if((dis >= 0 && that.scrT >= y)||(dis <= 0 && that.scrT <= y)){
                        that.scrT = y;
                        that.scrollFlag = true;
                        console.log(1)
                        clearInterval(timer)
                    }
                    $('.pane-right').scrollTop(that.scrT+2);
                },13)
            }
        })
        //添加商品
        this.restaurants.on('click','.cart-btn', function () {
            console.log()
        })

    },
    menuActive: function (elem) {
        elem.addClass('active').siblings().removeClass('active');
    },
    renderResElm: function(){
        var that = this;
        //根据hash中的店铺ID来获取餐厅信息
        //店铺信息
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
                that.restaurants.html(str)
                that.menu.html(str2);
                that.menuLists = $('.menu li');
                that.menuActive(that.menuLists.eq(0));
                //当列表渲染完成之后，对模拟滚动条进行初始化操作

                if(that.leftScroll && that.rightScroll) {
                    that.leftScroll.destroy(); //破环掉
                    that.rightScroll.destroy(); //破环掉
                }
                /*that.leftScroll = new IScroll('.pane-left', {
                    scrollbars: true,
                    preventDefault: false //防止阻止事件
                });*/

                /*that.rightScroll = new IScroll('.pane-right', {
                    scrollbars: true,
                    preventDefault:false
                });*/

                //建立dt高度与名字的映射表
                that.dtMenu = [];
                that.dtMenuArr = [];
                var dts = that.restaurants.find('dt');
                dts.each(function(){
                    //console.log(this)
                    var value = this.getAttribute('data-name');
                    var key = this.offsetTop - that.paneRight.offset().top;
                    that.dtMenuArr.push(key);
                    that.dtMenu.push(value);
                })
                console.log(that.dtMenuArr)
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
