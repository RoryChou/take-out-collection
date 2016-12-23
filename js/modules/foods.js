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
    },
    renderResBaidu: function(){
        var that = this;
        //根据hash中的店铺ID来获取餐厅信息
        document.cookie = 'wm_city=%7B%22city%22%3A%22%5Cu4e0a%5Cu6d77%22%2C%22code%22%3A%22289%22%7D; BAIDUID=CC57F06952870DA6E4399C89D03CEA47:FG=1; PSTM=1475907726; BIDUPSID=5CA5A6E9AB9AA954EF427DB058E74144; MCITY=-289%3A; wm_search_addr=[{"name":"Always%E5%9B%BD%E9%99%85%E5%BD%B1%E5%9F%8E","address":"%E4%B8%8A%E6%B5%B7%E5%B8%82%E6%B5%A6%E4%B8%9C%E6%96%B0%E5%8C%BA%E5%B9%B3%E5%BA%A6%E8%B7%AF258","lat":3644299.39,"lng":13536324.08,"shopnum":883,"city_id":289}]; BDSFRCVID=WoAsJeCCxG3GHeTiVhywQYV6OPqB_UvQiB5N3J; H_BDCLCKID_SF=JJAj_D0KJIvqDbKkht_QbtADBpoJ2lRea5TH3bKBKJjEe-5x-n3EhRIJ5fQXqhby067Z0lOnMp05spnN3-r4MbFW0JrptfRT-mrd-4Ql2l_h8CO_e4bK-Tr0eHuDqU5; PSINO=2; H_PS_PSSID=1423_19033_21122_17001_21554_20927; WMID=64765db05afc23591e95de863dd544a9; THIRDPARTY=https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3Dpf5lUhw36zOuFSQtIkwFJsWsX24lF6fJvc_oyjJenT4nCABTicSiWZEKmIAKX1D7lMMd8l69dpaxRwLmmrqxPS6BXcyMOMEl8G7xI57Nd1S%26wd%3D%26eqid%3De5ec1d060001a7fc00000002585ce7d9; WMRT=1482483675; Hm_lvt_e0401ea6bbde08becd704794fb788176=1482328268,1482398306,1482404758,1482483680; Hm_lpvt_e0401ea6bbde08becd704794fb788176=1482483680; wm_city=%7B%22code%22%3A%22289%22%2C%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%7D; wm_addr=%7B%22address%22%3A%22%E6%B2%83%E5%B0%94%E7%8E%9B(%E5%B1%B1%E5%A7%86%E4%BC%9A%E5%91%98%E5%95%86%E5%BA%97)%22%2C%22lat%22%3A%224701386.51%22%2C%22lng%22%3A%2213049212.96%22%7D; WM_USER_CURRENT_URL=http%3A%2F%2Fwaimai.baidu.com%2Fmobile%2Fwaimai%3Fqt%3Dshoplist%26address%3D%25E6%25B2%2583%25E5%25B0%2594%25E7%258E%259B(%25E5%25B1%25B1%25E5%25A7%2586%25E4%25BC%259A%25E5%2591%2598%25E5%2595%2586%25E5%25BA%2597)%26lat%3D4701386.51%26lng%3D13049212.96; SYS_CONFIRM={"language":"zh-CN","colorDepth":24,"screen_resolution":"667x375","timezone":-480,"openDatabase":"function","sessionStorage":true,"localStorage":true,"indexedDB":true,"addBehavior":"undefined","platform":"Win32","doNotTrack":null,"plugins":1257683291,"canvas":3543194128}; SYS_TIMEOUT=2004185918; WMST=1482483695; Hm_lpvt_d871b03edd8e1216cd554f781a1f34e1=1482483695; Hm_lvt_d871b03edd8e1216cd554f781a1f34e1=1482483695'
        $.ajax({
            url: 'http://waimai.baidu.com/mobile/waimai?qt=shopmenu&is_attr=1&shop_id=1449413427&address=%E6%B2%83%E5%B0%94%E7%8E%9B(%E5%B1%B1%E5%A7%86%E4%BC%9A%E5%91%98%E5%95%86%E5%BA%97)&lat=4701386.51&lng=13049212.96',
            /*data: {
             extras:['activities'],
             extras:['album'],
             extras:['license'],
             extras:['identification'],
             extras:['statistics'],
             latitude:'31.21491',
             longitude:'121.46878'
             },*/
            dataType: 'jsonp',
            success: function (res) {
                console.log(res)
            }
        })
    }
});
