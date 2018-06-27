
$(function () {
    /**
     * main-banner类的控制
     * 创建接口，一是不便于维护，二是开源便于别人重写function
     * @type {{clickAction, hoverAction, autoBannerAction, imgHoverAction}}
     */
    const main_banner_action = (function () {
        let bean = main_banner_bean();
        let count = bean.count;
        let item = bean.item;
        //创建hover指示器
        for (let i = 0; i < item.length; i++) {
            let $hoverAction = $('<span>');
            $hoverAction.addClass('action-hover-item');
            $('#wlittleyang-banner-fade .action-hover').append($hoverAction);
        }
        //单击事件下一张
        let click = bean.$actionRight.click(function () {
            let $hoverAction = $('.action-hover .action-hover-item');
            if (count === item.length - 1) {
                count = 0;
                $(item[item.length - 1]).css({opacity : 0});
                $(item[0]).css({opacity : 1});
            }else {
                $(item[count]).css({opacity : 0});
                $(item[count + 1]).css({opacity : 1});
                count += 1;
            }
            $hoverAction.css({background:'none'});
            $($hoverAction[count]).css({background : 'white'});
        });
        //自动轮播，模拟用户操作
        let timer = setInterval(function () {
            bean.$actionRight.click();
        },2000);
        //图片的抚摸，抚摸在上方时暂停自动播放，溢出抚摸开始自动播放
        let imgHover = bean.item.hover(function () {
            clearInterval(timer);
        },function () {
            timer = setInterval(function () {
                $('#wlittleyang-banner-fade .action-right').click();
            },2000);
        });
        //指示器的抚摸事件处理
        let hover = $('#wlittleyang-banner-fade .action-hover-item').hover(function () {
            clearInterval(timer);
            let $hoverAction = $('.action-hover .action-hover-item');
            //获取当前的索引
            let now_i = $(this).index();
            item.css({opacity : 0});
            $(item[now_i]).css({opacity : 1});
            console.log(now_i);
            //指示器样式改变
            count = now_i;
            $hoverAction.css({background:'none'});
            $($hoverAction[count]).css({background : 'white'});
        },function () {
            timer = setInterval(function () {
                $('#wlittleyang-banner-fade .action-right').click();
            },2000);
        });

        /**
         * 初始化main_banner_bean需要的参数
         * 这样设计可以保证不污染全局的节点选择，容易扩展功能和节点的操控
         * @returns {{count: number, item: (*|jQuery|HTMLElement), $actionRight: (*|jQuery|HTMLElement), $hoverAction: string, $actionItem: (*|jQuery|HTMLElement)}}
         */
        function main_banner_bean() {
            main_banner_autoGrowp();
            return {
                count : 0,
                item : $('#wlittleyang-banner-fade .item'),
                $actionRight : $('#wlittleyang-banner-fade .action-right'),
                $hoverAction : '',
                $actionItem : $('#wlittleyang-banner-fade .action-hover .action-hover-item')
            }
        }
        //创建接口，一是不便于维护，二是开源便于别人重写function
        return {
            clickAction : click,
            hoverAction : hover,
            autoBannerAction : timer,
            imgHoverAction : imgHover
        }
    })();
    //第一个大轮播的设备适配
    function main_banner_autoGrowp() {
        //大小设配
        let pageWidth = innerWidth;
        let $bannerHoverActionCon = $('#wlittleyang-banner-fade .action-hover');
        let $bannerWidth = $('#wlittleyang-banner-fade .container');
        $bannerWidth.css('height' , (pageWidth / 3));
        //热门景点适配
        $('.hot .hot-img-end').css('height' , (pageWidth / 3));
        //悬浮按钮居中
        $bannerHoverActionCon.css({left : ($bannerWidth.width()-$bannerHoverActionCon.width()) / 2 + 'px'});
    }

    /**
     * 热门景点类的控制
     * @type {{nextAction, prevAction}}
     */
    const hot_banner_action = (function () {
        //默认尺寸
        let bean = hot_banner_bean();
        let initImageData = bean.initImageData;
        let $img = bean.$img;
        let contaninerWidth =
            initImageData[initImageData.length - 1].left + initImageData[initImageData.length - 1].size;
            //容器宽度
        bean.$imgContainer.css('width' , contaninerWidth + 'px');
        //布局初始化
        function imgLayout() {
            for (let i = 0; i < $img.length; i++) {
                let imgData = initImageData[i];
                //上下居中
                $($img[i]).css({
                    left : imgData.left + 'px',
                    height : imgData.height + 'px',
                    width : imgData.size + 'px',
                    zIndex : imgData.zIndex,
                    top : imgData.top + 'px',
                    opacity : imgData.opacity,
                    background : imgData.background
                });
                //内容显示
                let $hotCon = $('.hot-content');
                $hotCon.find('header span').text(imgData.title);
                $hotCon.find('p').text(imgData.content);
                $hotCon.find('a').attr('href',imgData.href);
            }
        }
        //Next
        let next_action = (function Right_action() {
            let left_action =  $('#wlittleyang-banner-hot .action-right');
            left_action.click(function () {
                $img.css({transition: 'all 1s'});
                {
                    let temp = initImageData[0];
                    for (let i = 0; i < $img.length - 1; i++) {
                        //移位元数据
                        initImageData[i] = initImageData[i+1];
                    }
                    initImageData[$img.length - 1] = temp;
                }
                //重新布局
                imgLayout();
            });
        })();
        //Prev
        let prev_action = (function Left_action() {
            let left_action =  $('#wlittleyang-banner-hot .action-left');
            left_action.click(function () {
                $img.css({transition: 'all 1s'});
                {
                    let temp = initImageData[initImageData.length - 1];
                    for (let i = initImageData.length - 1; i > 0; i--)
                        initImageData[i] = initImageData[i - 1];
                    initImageData[0] = temp;
                }
                //重新布局
                imgLayout();
            });
        })();

        /**
         * 热门景点默认参数获取
         * @returns {{initImageData: *[], $imgContainer: (*|jQuery|HTMLElement), $img: (*|jQuery|HTMLElement)}}
         */
        function hot_banner_bean() {
            let initImageData = [
                {
                    size : 180,
                    height : 300,
                    zIndex : 1,
                    left : 0,
                    top : 20,
                    opacity : .7,
                    background : '#000',
                    title : "青海湖",
                    content : "青海湖的内容",
                    href : 'javascript:void(0)'
                },
                {
                    size : 200,
                    height : 340,
                    zIndex : 2,
                    left : 160 / 2,
                    top : 0,
                    opacity : 1,
                    background : 'none',
                    title : "共青湖",
                    content : "共青湖的内容",
                    href : 'javascript:void(0)'
                },
                {
                    size : 180,
                    height : 300,
                    zIndex : 1,
                    left :  180,
                    top : 20,
                    opacity : .7,
                    background : '#000',
                    title : "观山湖",
                    content : "观山湖的内容观山湖的内容观山湖的内容观山湖的内容观山湖的内容观山湖的内容观山湖的内容观山湖的内容",
                    href : 'javascript:void(0)'
                }
            ];
            let $imgContainer = $('#wlittleyang-banner-hot .container');
            let $img = $('#wlittleyang-banner-hot .item');
            return {
                initImageData : initImageData,
                $imgContainer : $imgContainer,
                $img : $img
            }
        }
        //初始化布局
        imgLayout();
        return {
            nextAction : next_action,
            prevAction : prev_action,
        }
    })();

    /**
     * 团队介绍类的控制
     * @type {{next_action, prev_action}}
     */
    const  team_banner_action = (function () {
        let bean = team_banner_bean();
        let initImageData = bean.initImageData;
        let $img = bean.$img;
        let left_action =  bean.$left_action;
        let right_action =  bean.$right_action;

        let contaninerWidth =
            initImageData[initImageData.length - 1].left + initImageData[initImageData.length - 1].size;
        //容器宽度
        bean.$imgContainer.css('width' , contaninerWidth + 'px');
        let next_action = function (initImageData) {
            right_action.click(function () {
                $img.css({transition: 'all 1s'});
                {
                    let temp = initImageData[0];
                    for (let i = 0; i < $img.length - 1; i++) {
                        //移位元数据
                        initImageData[i] = initImageData[i+1];
                    }
                    initImageData[$img.length - 1] = temp;
                }
                //重新布局
                team_banner_layout(initImageData);
            });
        };
        let prev_action = function (initImageData) {
            left_action.click(function () {
                $img.css({transition: 'all 1s'});
                {
                    let temp = initImageData[initImageData.length - 1];
                    for (let i = initImageData.length - 1; i > 0; i--) {
                        initImageData[i] = initImageData[i - 1];
                    }
                    initImageData[0] = temp;
                }
                //重新布局
                team_banner_layout(initImageData);
            });
        };
        let autoAction = function () {
            if ( innerWidth >= 768 ){
                team_banner_layout(bean.initImageDataPC);
                prev_action(bean.initImageDataPC);
                next_action(bean.initImageDataPC);
            } else {
                team_banner_layout(bean.initImageDataMP);
                prev_action(bean.initImageDataMP);
                next_action(bean.initImageDataMP);
            }
        };
        autoAction();
        return {
            next_action : next_action,
            prev_action : prev_action,
            autoAction : autoAction
        }
    })();
    /**
     * 初始化团队介绍（team_banner）相关属性
     * @returns {{initImageData: *[], initImageDataPC: *[], initImageDataMP: *[], $img: (*|jQuery|HTMLElement), $imgContainer: (*|jQuery|HTMLElement), $right_action: (*|jQuery|HTMLElement), $left_action: (*|jQuery|HTMLElement)}}
     */
    function team_banner_bean() {
        let initImageContent = {
            mayun : {
                name : '马云',
                en_position_name : 'FUNDING TEAM DESIGN DIRECTOR',
                ch_position_name : '创始团队总监'
            },
            mahuteng : {
                name : '马华腾',
                en_position_name : 'PLANNING DIRECTOR',
                ch_position_name : '策划总监'
            },
            wangjianling : {
                name : '王健林',
                en_position_name : 'TECHNICAL DIRECTOR',
                ch_position_name : '技术总监'
            },
            renzhengfei : {
                name : '任正非',
                en_position_name : 'FINANCIAL DIRECTOR',
                ch_position_name : '财政总监'
            },
            liuqiangdong : {
                name : '刘强东',
                en_position_name : 'SALES DIRECTOR',
                ch_position_name : '销售总监'
            },
        };
        let initImageDataPC = [
            {
                size : 160,
                zIndex : 1,
                left : 0,
                top : 70,
                content : initImageContent.mahuteng
            },
            {
                size : 180,
                zIndex : 2,
                left : 160 / 2,
                top : 60,
                content : initImageContent.liuqiangdong
            },
            {
                size : 200,
                zIndex : 3,
                left :  180 / 2 + 160 / 2,
                top : 50,
                content : initImageContent.wangjianling
            },
            {
                size : 180,
                zIndex : 2,
                left : 200 + 180 / 2,
                top : 60,
                content : initImageContent.renzhengfei
            },
            {
                size : 160,
                zIndex : 1,
                left : 200 + 180,
                top : 70,
                content : initImageContent.mayun
            }
        ];
        let initImageDataMP = [
            {
                size : 80,
                zIndex : 1,
                left : 0,
                top : 70,
                content : initImageContent.mahuteng
            },
            {
                size : 100,
                zIndex : 2,
                left : 80 / 2,
                top : 60,
                content : initImageContent.liuqiangdong
            },
            {
                size : 120,
                zIndex : 3,
                left :  80 / 2 + 100 / 2,
                top : 50,
                content : initImageContent.wangjianling
            },
            {
                size : 100,
                zIndex : 2,
                left : 120 + 100 / 2,
                top : 60,
                content : initImageContent.renzhengfei
            },
            {
                size : 80,
                zIndex : 1,
                left : 120 + 100,
                top : 70,
                content : initImageContent.mayun
            }
        ];
        let $img = $('#wlittleyang-banner-five .item');
        let $imgContainer = $('#wlittleyang-banner-five .container');
        let $right_action =  $('#wlittleyang-banner-five .action-right');
        let $left_action =  $('#wlittleyang-banner-five .action-left');
        team_banner_layout(initImageDataPC);
        return {
            initImageData : initImageDataPC,
            initImageDataPC : initImageDataPC,
            initImageDataMP : initImageDataMP,
            $img : $img,
            $imgContainer : $imgContainer,
            $right_action : $right_action,
            $left_action : $left_action
        }
    }
    //布局
    function team_banner_layout(initImageData) {
        let $img = $('#wlittleyang-banner-five .item');
        let $imgContainer = $('#wlittleyang-banner-five .container');
        innerWidth >= 768 ? $imgContainer.css('width' , 540 + 'px') : $imgContainer.css('width' , 300 + 'px');
        for (let i = 0; i < $img.length; i++) {
            let imgData = initImageData[i];
            //上下居中
            $($img[i]).css({
                left : imgData.left + 'px',
                height : imgData.size + 'px',
                width : imgData.size + 'px',
                zIndex : imgData.zIndex,
                top : imgData.top + 'px',
            });
            //内容显示
            let $hotCon = $('.team-content');
            $hotCon.find('header span').text(imgData.content.name);
            $hotCon.find('.en-position-name').text(imgData.content.en_position_name);
            $hotCon.find('.ch-position-name').text(imgData.content.ch_position_name);
        }
    }
    /**
     * 窗口变化适配
     */
    window.addEventListener('resize',function () {
        //这要注意，需要重新识别数据，而事件也要重新读取新的数据
        team_banner_action.autoAction();
        let $imgContainer = $('#wlittleyang-banner-five .container');
        main_banner_autoGrowp();
        let hot_bean = team_banner_bean();
        if (innerWidth > 768) {
            hot_bean.initImageData = hot_bean.initImageDataPC;
            $imgContainer.css('width' , 540 + 'px');
        }
        if (innerWidth < 768){
            hot_bean.initImageData = hot_bean.initImageDataMP;
            $imgContainer.css('width' , 300 + 'px');
        }
        let imageData = hot_bean.initImageData;
        team_banner_layout(imageData);
    });
    /**
     * 文本溢出省略号显示
     * @param textContainer 装载文本的dom
     */
    (function textOverFlow(textContainer) {
        let news = textContainer;
        for (let i = 0; i < news.length; i++){
            let el = news[i],
                str = el.textContent,
                el_ofHei = el.offsetHeight;
            for(let i=0; i<str.length; i++) {
                el.innerHTML = str.substr(0, i);
                if(el_ofHei < el.scrollHeight - 40) {
                    el.style.overflow = 'hidden';
                    el.innerHTML = str.substr(0, i-3) + '...';
                    break;
                }
            }
        }
    })($('.news .news-item .item-left p'));
});