/**
 * shadowbar is a js scrollbar,
 * but it doesn't listen mouse and touch event to scroll the element, instead it listen to the native scroll event and use js to draw a mac-lion style scrollbar. I use css3 border-radius to draw the scrollbar, so in ie8- the scrollbar is a rectangle;
 * in short, it just hide the native scrollbar and draw a shadow of it.
 * the advantage is that: it won't change the native scroller behaviour
 * the disadvantage is that: it change the dom tree, so you can't listen scroll event of the container, instead you must listen to shadowbar's scroll event;
 * I find facebook's inbox opoup window use this method, so I just write a jQuery plugin to implement.
 * @example:
 * $("#container").shadowbar({color:"#ff0000"}); //create shadowbar, args is the optional settings;
 *  // if shadowbar was create, but the content change(ie: use js to change the innerHTML), you can use the following method to update the scrollbar:
 *  $("#container").shadowbar("update");
 *  @autor: axun
 *  @time: 2012/10/3
 *  TODO: scroll event
 *  TODO: allow mouse drag the scrollbar
 */
(function($){
    $.fn.shadowbar = function(options){
        
        var settings = $.extend({
            stopPropagation : true, //prevent the scroll event bubble to parent element;
            color: "#000",  //the scrollbar color;
            opacity: 0.5,   //the scrollbar opacity when it's shown;
            top: 2,     //the scrollbar margin top and bottom (px);
            width: 6,   //the scrollbar width;
            right: 2,   //the scrollbar margin right (px);
            auto_hide: true,    //auto hide the scrollbar
            hide_delay: 1000
        }, options);

        var createDom = function($this){
            $this.addClass("shadow-scroller").css({position: "relative", overflow: "hidden"}).wrapInner("<div class=\"shadow-scroller-content\"></div>");
            $this.wrapInner("<div class=\"shadow-scroller-inner\"></div>");
            $this.append("<div class=\"shadow-scroller-bar\"></div>");
            var $inner = $this.children(".shadow-scroller-inner");
            var $bar = $this.children(".shadow-scroller-bar");
            var $content = $inner.children(".shadow-scroller-content");
            $inner.css({height: "100%", width: "150%", overflow: "auto"});
            $bar.css({position: "absolute", right: settings.right, top: settings.top, opacity: settings.opacity, background: settings.color, width: settings.width, "border-radius": 3});
        };

        var onScroll = function($bar, $inner, $content){
            var scrollTop = $inner.scrollTop();
            var contentHeight = $content.height();
            var innerHeight = $inner.height();
            var top = scrollTop / contentHeight * (innerHeight - settings.top * 2);
            $bar.stop().css({opacity: settings.opacity}).show();
            $bar.css({top: (top + settings.top)});
        };

        var update = function($bar, $inner, $content) {
            var innerHeight = $inner.height();
            var contentHeight = $content.height();
            if(innerHeight >= contentHeight) {
                $bar.hide();    //no scrollbar is need
            }else{
                $bar.show();
            }
            var h = (innerHeight / contentHeight) * (innerHeight - settings.top * 2);
            $bar.css({height: h});
        };

        var hide = function($el) {
            $el.stop().fadeOut("slow");
        };

        var show = function($el) {
            $el.stop().show();
        };

        var bindEvents = function($bar, $inner, $content) {
            $inner.scroll(function(e){
                show($bar);
                onScroll($bar, $inner, $content);
            });


            if(settings.stopPropagation) {
                //to stop scrollevent bubble to parent,  @link:http://stackoverflow.com/questions/7571370/jquery-disable-scroll-when-mouse-over-an-absolute-div/#answer-7571867
                $inner.bind("mousewheel DOMMouseScroll", function(e){
                    var scrollTo = null;
                    if (e.type == 'mousewheel') {
                        scrollTo = (e.originalEvent.wheelDelta * -1);
                    }
                    else if (e.type == 'DOMMouseScroll') {
                        scrollTo = 40 * e.originalEvent.detail;
                    }
                    if (scrollTo) {
                        e.preventDefault();
                        var $this = $(this);
                        $this.scrollTop(scrollTo + $this.scrollTop());
                    }
                });
            };

            var _delaying = false;
            if(settings.auto_hide) {    
                setInterval(function(){
                    if($bar.is(":visible") && !($bar.is(":animated")) && !_delaying) {
                        _delaying = true;
                        setTimeout(function(){
                            hide($bar);
                            _delaying = false;
                        }, settings.hide_delay);   //
                    }
                }, 100);
            }
        };

        return this.each(function(){
            var $this = $(this);
            !(options === "update") && createDom($this);
            var $inner = $this.children(".shadow-scroller-inner");
            var $bar = $this.children(".shadow-scroller-bar");
            var $content = $inner.children(".shadow-scroller-content");

            !(options === "update") && bindEvents($bar, $inner, $content);
            update($bar, $inner, $content);
        });

    }
})(jQuery);
