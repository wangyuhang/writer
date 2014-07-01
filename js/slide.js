/*幻灯片通用组件2012-7-4 王宇航
	preBtn：必选表示上一个按钮
	nextBtn：必选表示下一个按钮
	listBox：表示要轮转的列表框
	navBox：表示导航标签框
	options：一些可选项

	eType:如何出发图片轮转参数可以为mouseover,click默认为mouseover

	type:图片轮换的类型，参数可以为show,fade,slide,默认为show

	slideDir：当图片轮转类型为slide的时候，slideDir可以设置为left,top
	
	triggerFun:触发图片轮转时可以执行的函数，比如触发按钮变色，改变边框样式等等
	
	调用函数如
	$.slide($("#preBtn"),$("#nextBtn"),$("#nbtvGbdsTopSlideList"),$("#nbtvGbdsSlideNav ul"),{type:"fade"});
*/
(function($){
	$.extend({
		slide: function(preBtn,nextBtn,listBox,navBox,options){
			defaults = {
				eType : "mouseover",
				type : "show",
				slideDir : "left",
				speed : 300,
				delay : 5000,
				listBox : null,
				navBox : null,
				triggerFun : function(){}
			};
			
			var o = $.extend(defaults, options)
				listArr = $(listBox).children(),
				navArr = $(navBox).children(),
				h = $(listArr[0]).height(),
				w = $(listArr[0]).width(),
				tabPic = function(){},
				funSetTime = function(){};//用于时间循环函数的重写。
				
			function init(){
				navArr.each(function(index){
					$(this).attr("rel",index);
				});
				
				if(o.type === "show"){
					$(listArr).css({"position":"absolute","left":"0","top":"0"});
					tabPic = showTab;
				}else if(o.type === "fade"){
					$(listArr).css({"position":"absolute","left":"0","top":"0","opacity":"0","filter":"alpha(opacity=0)"});
					$(listArr[0]).css({"opacity":1,"filter":"alpha(opacity=100)"});
					tabPic = fadeTab
				}else if(o.type === "slide"){
					if(o.slideDir === "left"){
						$(listBox).css("width",9999);
						tabPic = slideLeftTab;
					}else if(o.slideDir === "top"){
						tabPic = slideTopTab;
					}
				}
				
				//点击上一个按钮
				preBtn?preBtn.click(function(){
					var curIndex = parseInt(navBox.find(".cur").attr("rel")),
						index = (curIndex <= 0 ?($(navArr).length-1):curIndex-1);
					tabPic(index);
					on($(navArr[index]));
					o.triggerFun();
				}):null;
				//点击下一个按w钮
				nextBtn?nextBtn.click(function(){
					var curIndex = parseInt(navBox.find(".cur").attr("rel")),
						index = (curIndex >= ($(navArr).length-1)?0:curIndex+1);
					tabPic(index);
					on($(navArr[index]));
					o.triggerFun();
				}):null;
				
				setTimeFun(0);//定时函数，定时进行图片轮状
			};
			init();
			
			function showTab(curIndex){
				$(listArr[curIndex]).show().siblings().hide();
			};
			
			function fadeTab(curIndex){
				var curEle = $(listArr[curIndex]);
				curEle.siblings().css({"z-index":"1"}).stop(true,false).fadeTo(o.speed,0);
				curEle.css({"z-index":"2"}).stop(false,true).fadeTo(o.speed,1);
			};
			
			function slideLeftTab(curIndex){
				$(listBox).stop(true,false).animate({
					"margin-left": -(curIndex*w)+"px"
				},o.speed);
			};
			
			function slideTopTab(curIndex){
				$(listBox).stop(true,false).animate({
					"margin-top": -(curIndex*h)+"px"
				},o.speed);
			};
			
			function on(ele){
				ele.siblings().removeClass("cur");
				ele.addClass("cur");
			};
			
			function setTimeFun(index){
				funSetTime = setInterval(function(){
					tabPic(index);
					on($(navArr[index]));
					index = (index >= ($(navArr).length-1)?0:index+1);
					o.triggerFun();
				},o.delay);
			};
			
			navArr.bind(o.eType,function(){
				clearInterval(funSetTime);
				on($(this));
				tabPic($(this).attr("rel"));
				o.triggerFun();
			});
			navArr.bind("mouseout",function(){
				clearInterval(funSetTime);
				setTimeFun(parseInt($(navBox).children(".cur").attr("rel")));
			});
			
			preBtn?preBtn.mouseover(function(){
				clearInterval(funSetTime);
			}):null;
			
			preBtn?preBtn.mouseout(function(){
				clearInterval(funSetTime);
				setTimeFun(parseInt($(navBox).children(".cur").attr("rel")));
			}):null;
			
			nextBtn?nextBtn.mouseover(function(){
				clearInterval(funSetTime);
			}):null;
			
			nextBtn?nextBtn.mouseout(function(){
				clearInterval(funSetTime);
				setTimeFun(parseInt($(navBox).children(".cur").attr("rel")));
			}):null;
		}
	});
})(jQuery);