 /*
框架执行顺序：
1.用户进入到index.html文件
2.执行$(document).ready函数，并执行了app.init()函数，改函数包括了对commom和base得初始化
3.commom和base得初始完成后会回调到app.back函数，进行基本数据得赋值，并执行预加载函数loader.init();
4.预加载完成后，执行loader.handleComplete()函数，进入第一个页面
*/

//common.clearData();
$(document).ready(function(){
	//base.login();
	audioAutoPlay();
	app.init();

})



function buttonGo(page) {
	act = get_act();
	pageIn(page, act)
}
function get_act() {
	act = $('.main').find('.act').data('index');
	return act
}
function add_act(page) {
	$('.z' + page).addClass('act').siblings().removeClass('act')
}
function pageIn(inPage, outPage) {
	$(".z" + inPage).css({'opacity':0,left:  0});
	$(".z" + inPage).show().stop().delay(200).transition({  opacity: 1}, 1000, 'easeOutSine', function(){
		
	}); 
	$(".z" + outPage).stop().delay(200).transition({ left:  '-100%', opacity: 0}, 1000, 'easeOutSine', function(){
		$(".z" + outPage).hide();
	}); 

	add_act(inPage)
	
}

//常用数据

var app = { 
	//屏幕滑动
	useScroll: true ,
	//纯前端没有没后端交互模式
	mode     : false,
	//根路径
	rootPath :'http://h5.zhmicroera.com/',
	//路径
	path  :'./assets/',
	//用户信息
	user	 :{},
	//
	demo     :{},
	//其他信息
	other    :{},
	//token
	token    :'',
	//是否为活动结束，这里的时间只为提示和pv统计使用，必须与后端的时间设置一致
	over     : false,
	//
	overStr  :'',
	
	
	
	//初始化
	init : function(){
		var self = this;
		self.scroll();
		common.init({
			//数据保存
			'sign'		:'409',
		});
		if(self.mode){
			//用户没有后端的时候编辑模式
			var user,token,other;
			user  = "";
			token = "test";
			other = {"app_info":{"over":false,"overStr":"调试模式"}};
			self.back(user,token,other);
		}else{	
			common.sendFirst("./core/get_config.php",{},function(res){
				//base.login();
				//common.dump(res);return;
				
				if(res.code==1){
					app.demo = res.demo;
					app.path = res.data.path;
				
				
					base.init({
						//授权地址
						"oauthUrl": res.data.oauthUrl,
						//错误提示地址
						"errorUrl": res.data.errorUrl,
						//uv，pv统计
						"countUrl": res.data.countUrl,	
						//授权地址
						"backUrl" : res.data.backUrl,
						//项目唯一标识
						"sign"    : res.data.sign,
						//调试模式开启状态
						"debug"   : res.data.debug,
						//设置授权回调函数
						"back"    : self.back,
						//统计
						"isCount" : res.data.isCount,
						//后端统计pv标识	
						"shareUrl" : res.data.shareUrl,
							  
					});
				}else{
					alert(res.msg);
				}	
			});
		}
		
		
	
	},
	scroll:function(){
		window.addEventListener('touchmove', function(e){ !app.useScroll && e.preventDefault();});
	},
	//初始化回调地址，一切操作必须在此处进行
	back : function(user,token,other){
	
		app.user  = user;
		app.token = token;
		app.other = other;
		app.overStr = app.other.app_info.overStr;
		app.over    = app.other.app_info.over;
		
		
		base.loginClose();
		setTimeout(function(){
			if(app.over){
				alert(app.overStr);
			}
			$("#load").show();
			loader.init();
		},500)
	}

};
var game;
//预加载
var loader = {
	//文件列表
	files  :[],
	version:12,
	//预加载初始化
	init : function(config){
		var self = this;
		for(var i in config){
			self[i] = config[i];
		}
		
		
		self.files = [
			{id:"load", src:app.path+"images/load.png?v="+self.version},
			{id:"lag_box", src:app.path+"images/lag_box.png?v="+self.version},
			{id:"lag_close", src:app.path+"images/lag_close.png?v="+self.version},
			{id:"left", src:app.path+"images/left.png?v="+self.version},
			{id:"line1", src:app.path+"images/line1.png?v="+self.version},
			{id:"line2", src:app.path+"images/line2.png?v="+self.version},
			{id:"load_title", src:app.path+"images/load_title.png?v="+self.version},
			{id:"load_title2", src:app.path+"images/load_title2.png?v="+self.version},
			{id:"p1_bg", src:app.path+"images/p1_bg.jpg?v="+self.version},
			{id:"p1_btn1", src:app.path+"images/p1_btn1.png?v="+self.version},
			{id:"p1_guan", src:app.path+"images/p1_guan.png?v="+self.version},
			{id:"p1_head", src:app.path+"images/p1_head.png?v="+self.version},
			{id:"p1_title", src:app.path+"images/p1_title.png?v="+self.version},
			{id:"p1_title_en", src:app.path+"images/p1_title_en.png?v="+self.version},
			{id:"p2_bum_box", src:app.path+"images/p2_bum_box.png?v="+self.version},
			{id:"p2_foot", src:app.path+"images/p2_foot.png?v="+self.version},
			{id:"p2_head", src:app.path+"images/p2_head.png?v="+self.version},
			{id:"p2_m", src:app.path+"images/p2_m.png?v="+self.version},
			{id:"p3_bg", src:app.path+"images/p3_bg.jpg?v="+self.version},
			{id:"q_9A", src:app.path+"images/q_9A.png"},
			{id:"q_9B", src:app.path+"images/q_9B.png"},
			{id:"q_9C", src:app.path+"images/q_9C.png"},
			{id:"q_9D", src:app.path+"images/q_9D.png"},
			
			{id:"click", src:app.path+"sound/click.mp3"},
			
		];
		self.preload =  new createjs.LoadQueue(false);
		self.preload.installPlugin(createjs.Sound);  
		self.preload.on("error", self.handleError, self);
		self.preload.on("progress", self.handleProgress, self);
		self.preload.on("complete", self.handleComplete, self);	
		self.preload.loadManifest(self.files);
	},
	//加载进度
	handleProgress : function(event){
		var self = this;
		var percent = self.preload.progress*100|0;
		$("#percent").html(percent+"%");
		
		
		$("#progress").css("width",percent+"%");
		$(".load_title2_box").css("width",percent+"%");
	},
	//加载完成
	handleComplete : function(event){
		setTitle('测测你的CBRE专属色');
		// setShare("测测你的CBRE专属色","五种绿色，五型人格。来，测测你是哪类绿色“型”人？","https://mmbiz.qpic.cn/mmbiz_jpg/tISxN7hC6AJ8g6YqexADPiaCNWhGN2iapiavotPt6UJqV7ciamNJ02z7HviaqCictPNhznXWKf0lIbYmiak1B69lqTH4w/0?wx_fmt=jpeg");
		
		
		var self  = this;
		//common.dump(base64.decode(app.user.user_nickbase64));
		setTimeout(function(){	
		//	$("#load").transition({ opacity: 0}, 300, 'easeOutSine', function(){$("#load").hide() });  
			$("#main").show().transition({ opacity: 1}, 300, 'easeOutSine', function(){
				buttonGo('page1');
				//p3(1);
				makeGuan();
				game = new Games();
				game.questionList = app.other.q;
				game.ansList = app.other.a;
				/*	game.type  ={
					'1':3,
					'2':2,
					'3':3,
					'4':3,
				};
				
				console.log(game.getRes());*/
				setTimeout(function(){	
					layer_show("lag");
					$("#load").remove();
				},1500)
			});  
		},500)

	},
	//加载报错
	handleError    : function(event){
	}
}



function tips(con){
	$("#tip").html(con);
	layer_show('tip');
}
function layer_show(name){
	
	$("."+name).show().removeClass("animated bounceOutUp").addClass("animated bounceInDown");
}


function layer_close(name){
	
	$("."+name).removeClass("animated bounceInDown").addClass("animated bounceOutUp");
}



app.sound = {};
app.sound.bg = new Audio(app.path+'sound/music.mp3?v='+loader.version);
app.sound.bg.loop = true;

for (var i in app.sound) {
	if (app.sound[i].play) {
		continue
	}
	app.sound[i].play();
	app.sound[i].pause()
}
for (var i in app.sound) {
	if (!app.sound[i].load) {
		continue
	}
	app.sound[i].load()
}
//背景音乐播放
function audioAutoPlay(){  
    
	play = function(){  
		app.sound.bg.play();  
		document.removeEventListener("touchstart",play, false);  
	};  
    app.sound.bg.play();  
    document.addEventListener("WeixinJSBridgeReady", function () {  
        play();  
    }, false);  
    document.addEventListener('YixinJSBridgeReady', function() {  
        play();  
    }, false);  
    document.addEventListener("touchstart",play, false);  
}  


$(".music").on("click",function(){

	if ( $(this).hasClass("plays") )
	{
		$(this).removeClass("plays");
		$(".music_on").removeClass("moves");
		$("#music>span").addClass("zshow").html("关闭");
		setTimeout(function(){$("#music>span").removeClass("zshow")},1000);
		app.sound.bg.pause();

	}
	else
	{
		$(this).addClass("plays");
		$(".music_on").addClass("moves");
		$("#music>span").addClass("zshow").html("开启");
		setTimeout(function(){$("#music>span").removeClass("zshow")},1000);
		app.sound.bg.play();
	}
})


//设置标题
function setTitle(title){
	$('title').text(title)
}
// function setShare(title,desc,imgUrl){
	
// 	wx.ready(function () {
// 		wx.onMenuShareAppMessage({
// 			title: title,
// 			desc:  desc,
// 			link: 'http://h5.zhmicroera.com/409/',
// 			imgUrl: imgUrl,
// 			success: function () {   
// 				share();
// 			}
// 		});
		
// 		wx.onMenuShareTimeline({
// 			title: title,
// 			link: 'http://h5.zhmicroera.com/409/',
// 			imgUrl: imgUrl,
// 			success: function () {   
// 				share();
// 			}
// 		});
// 	});
// }
// function share(){

// 	common.send("./ajax/add_share.php",{},function(res){
// 		if(res.code==1){
			
// 		}else{
				
// 		}
// 	},function(){	
	
// 	},false);
		
	
// }
var tclear;
var c = 0;
function makeGuan(){
	c++;
	if(c>=8){
		clearTimeout(tclear);
		c = 0;

		return;
	}
	var index   = getNum(0,1);
	var arr   = ['big','midden','small'];
	var box   = [{width:560,height:100},{width:460,height:73}];
	var time  = getNum(1000,2500);
	var num   = getNum(2,4);
	var lay   =['yc400','yc800','yc1000','yc1200','yc1500']

	tclear = setTimeout(function(){
		var left = 0;
		var top  = 0;
		var type = 0;
		var l    = 'yc400';
		for(var i =0;i<num;i++){
			left = getNum(0,box[index].width);
			top  = getNum(0,box[index].height);
			type = getNum(0,2);
			l    = getNum(0,4);
			$(".p1_guan_box"+(index+1)).append('<div class="p1_guan '+arr[type]+' qq_move '+lay[l]+'" style="position: absolute;left:'+left+'px;top:'+top+'px;"></div>');
		}
		makeGuan();
	},time);

	
}

function getNum(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

var ltype = 'ch';
//语言选择
function selectLag(obj,type){
	$("#music").show();
	obj.addClass("active");
	obj.siblings().removeClass("active");
	ltype = type;
	if(ltype=='ch'){
		setTitle('测测你的CBRE专属色');
		// setShare("测测你的CBRE专属色","五种绿色，五型人格。来，测测你是哪类绿色“型”人？","https://mmbiz.qpic.cn/mmbiz_jpg/tISxN7hC6AJ8g6YqexADPiaCNWhGN2iapiavotPt6UJqV7ciamNJ02z7HviaqCictPNhznXWKf0lIbYmiak1B69lqTH4w/0?wx_fmt=jpeg");
	}else{
		setTitle('What is Your True CBRE Color?');
		
		// setShare(" What is Your True CBRE Color?","Take the simple test to see what it reveals about your personality type.","https://mmbiz.qpic.cn/mmbiz_jpg/tISxN7hC6AJ8g6YqexADPiaCNWhGN2iapiaTfEEgIADy5bHsq9RGqyPKIKr8cRsUw6ajfGfiaSvE0uoWmQUnQyQ4qA/0?wx_fmt=jpeg");
	}
	layer_close('lag');
	setTimeout(function(){
		$("."+ltype).show().addClass("animated zoomIn");
	},800);

	
}

//首页
function p2(){
	game.init();
	game.next();
	buttonGo('page2');
}


//答题，类型1文本2为图片
//ans_type 1青柠 2活力 3 奋进 4清晰
var Games = function(){
	this.questionList = [
		{id:1,question_name:'加油啊！',question_en_name:'fatting',type:1},
		{id:2,question_name:'图片',question_en_name:'imgs',type:2}
	];

	this.ansList =[
		{id:1,qid:1,ans_name:'加油啊！',ans_en_name:'fatting',ans_text:'A',ans_type:1},
		{id:2,qid:1,ans_name:'加油啊！',ans_en_name:'fatting',ans_text:'B',ans_type:2},
		{id:3,qid:1,ans_name:'加油啊！',ans_en_name:'fatting',ans_text:'C',ans_type:3},
		{id:4,qid:1,ans_name:'加油啊！',ans_en_name:'fatting',ans_text:'D',ans_type:4},
		{id:5,qid:2,ans_name:'./assets/images/lag_box.png',ans_en_name:'./assets/images/lag_box.png',ans_text:'A',ans_type:1},
		{id:6,qid:2,ans_name:'./assets/images/lag_box.png',ans_en_name:'./assets/images/lag_box.png',ans_text:'B',ans_type:2},
		{id:7,qid:2,ans_name:'./assets/images/lag_box.png',ans_en_name:'./assets/images/lag_box.png',ans_text:'C',ans_type:3},
		{id:8,qid:2,ans_name:'./assets/images/lag_box.png',ans_en_name:'./assets/images/lag_box.png',ans_text:'D',ans_type:4}
	];
	this.question =[];
	this.ans =[];

	this.num =0;
	
	this.list  =[];
	this.type  ={
		'1':0,
		'2':0,
		'3':0,
		'4':0,
	};
	
	this.res   ={
		'r23':3,
		'r32':3,
		'r24':2,
		'r42':2,
		'r21':1,
		'r12':1,
		'r34':4,
		'r43':4,
		'r41':1,
		'r14':1,
		'r31':3,
		'r13':3,
	
	}
}
Games.prototype = {
	init:function(){
		var  that = this;
		if(!$.isEmptyObject(that.questionList)&&!$.isEmptyObject(that.ansList)){
			var objq,obja;
			for(var i in that.questionList){
				objq = that.questionList[i];
				for(var j in that.ansList){
					obja = that.ansList[j];
					if(obja.qid == objq.id){
						if(!that.ans[objq.id]){
							that.ans[objq.id] = new Array();
						}
						that.ans[objq.id][obja.id] = obja;
					}
				
				}
			}
		}
	
		that.question = that.questionList;
		
	},
	next:function(){
		var  that = this;
		if(that.num>=that.question.length){
			that.gameOver();
			return;
		}
		that.setQ(that.num);

		$(".p2_bum_box").children().eq(that.num).transition({ opacity: 1}, 300, 'easeOutSine', function(){
			$(this).transition({rotate:that.num*32.5}, 500, 'easeOutSine', function(){	}); 
		});  
		$(".v-num").html('<span class="">'+(that.num+1)+'</span>/11');
	},
	setQ:function(index){
		var  that = this;
		var q = that.question[index];
		var a = that.ans[q.id];

		var title = '';
	
		if(ltype=='ch'){
			title = q.question_name;
		}else{
			title = q.question_en_name;

		}
		
		if(q.type==2){
			var li ='';
			for(var i in a){	
				li +='<li onclick="selecta($(this))" data-qid="'+q.id+'" data-aid="'+a[i].id+'" data-atext="'+a[i].ans_text+'" data-atype="'+a[i].ans_type+'"><p>'+a[i].ans_text+'</p><div class="img_box"><img src="'+a[i].ans_name+'"></div></li>';
			}
			var html ='<div class="p2_title">'+title+'</div><ul class="p2_img_box">'+li+'</ul>';
		}else{
			
			var li ='';
			for(var i in a){
				if(ltype=='ch'){
					li +=' <li onclick="selecta($(this))" data-qid="'+q.id+'" data-aid="'+a[i].id+'" data-atext="'+a[i].ans_text+'" data-atype="'+a[i].ans_type+'"><span><i>'+a[i].ans_text+'</i></span><p style="line-height:45px;">'+a[i].ans_name+'</p></li>';	
				}else{
					
				
					var line = "line-height:45px;";
			
					
						// line = "line-height:45px;";
					
					
					li +=' <li onclick="selecta($(this))" data-qid="'+q.id+'" data-aid="'+a[i].id+'" data-atext="'+a[i].ans_text+'" data-atype="'+a[i].ans_type+'"><span><i>'+a[i].ans_text+'</i></span><p style="'+line+'">'+a[i].ans_en_name+'</p></li>';
				}
				
			}
			var html ='<div class="p2_title">'+title+'</div><ul class="p2_text_box">'+li+'</ul>';
		}
		common.layerShow();
		setTimeout(function(){
			if(that.num!=0){
				$(".v-q").removeClass("animated fadeInLeft").addClass("animated fadeOutLeft");
			}
			
			$(".p2_foot").transition({opacity:0}, 500, 'easeOutSine', function(){}); 
			setTimeout(function(){
				
				
				$(".v-q").html(html);
				$(".v-q").removeClass("animated fadeOutLeft").addClass("animated fadeInLeft");
				setTimeout(function(){
					common.layerClose();
				},500)
				$(".p2_foot").transition({opacity:0.8}, 500, 'easeOutSine', function(){}); 
			},800)
		},500)
		
	},
	getRes:function(){
		var  that = this;
		var arr = [];
		var j = 0;

		for(var i in game.type){
			arr[j] = game.type[i];
			j++;
		}
		var max = Math.max.apply(null, arr);
		var min = Math.min.apply(null, arr);
		if(max-min<=2){
			//cbre绿5
			
			//alert("cbre绿5");
			return 5;
		}else{
			//获取最大值数组
		
			var countArr = [];
			var index='r';
			var j = 0;
			for(var i in game.type){
				if(max==game.type[i]){
					countArr[j] =i;
					j++;
					index+=i;
				}	
			}
			//
			
			if(countArr.length==1){
				//console.log(countArr[0]);
				return countArr[0];

			}else{
				var r = that.res[index];
			
				return r;
				
			}
		}
	},
	gameOver:function(){
		var that = this;
		$(".res").show();
	
		var datas = that.list;
		var resl  = that.getRes();

		var types = that.type;
			var arr =['青柠','活力','奋进','清新','cbre绿'];
	//	return;
		common.send("./ajax/add_record.php",{datas:JSON.stringify(datas),res:resl,types:JSON.stringify(types),ltype:ltype},function(res){
		
			setTimeout(function(){
				
				p3(resl);
			},500)
			
		},function(){	
			
			setTimeout(function(){
			
				p3(resl);
			},500)
		},false);
		
	}

}
function objtoArr(obj){
	var arr = new Array();
	if(!$.isEmptyObject(obj)){
		var i = 0;
		for(var j in obj){
			arr[i] = obj[j];
			i++;
		}
	}
	return arr;
}
//console.log(getLen('Co-working/shared working space'));
function getLen(str){
	var len = 0;  
    for (var i=0; i<str.length; i++) 
    {
        if ((str.charCodeAt(i) & 0xff00) != 0)
            len ++;
        len ++;  
    }  
    return len;  
}
function selecta(obj){
	createjs.Sound.play("click");
	var qid = obj.data('qid');
	var aid = obj.data('aid');
	var atext = obj.data('atext');
	var atype = obj.data('atype');
	obj.addClass("active");
	obj.siblings().removeClass("active");
	game.list[game.num] = {};
	game.list[game.num].qid =qid;
	game.list[game.num].aid =aid;
	game.list[game.num].atext =atext;
	game.type[atype]++;	
	
	game.num++;
	game.next();
}

function p3(res){
	p3_init(res);
	$(".res").show();
	if(ltype=='ch'){
		var top1 = 400;
		var top2 = 518;
		var height = 1183;
		var imgBg 	 = "./assets/images/p3_"+res+".jpg?v=7";
		var imgTitle ="./assets/images/p3_res"+res+".png?v=7";
		var imgRgb 	 = "./assets/images/p3_rgb"+res+".png?v=7";
	}else{
		var top1 = 400;
		var top2 = 518;
		var height = 1183;
		var imgBg 	 ="./assets/images/p3_"+res+"_en.jpg?v=7";
		var imgTitle = "./assets/images/p3_res"+res+"_en.png?v=7";
		var imgRgb 	 = "./assets/images/p3_rgb"+res+".png?v=7";
	}
	
	
	var img1 = new Image();
	img1.src = imgBg;
	img1.onload = function () {
		var canvas = document.getElementById("my"); 
		var ctx = canvas.getContext("2d"); 
		canvas.width = 640; 
		canvas.height = height; 
		ctx.drawImage(this, 0, 0, 640, height); 
		var img2 = new Image();
		img2.src = imgTitle;
		img2.onload = function () {
			$(".v-img").attr("src",imgBg);
			$(".v-title").attr("src",imgTitle);
			ctx.drawImage(this, 64.5, top1, 509, 80); 
			var img3 = new Image();
			img3.src = imgRgb;
			img3.onload = function () {
				ctx.drawImage(this, 147.5, top2, 345, 60); 
				convertCanvasToImage();
				
				setTimeout(function(){
					$(".res").hide();
					p3_move(res);
				},500)
				buttonGo('page3');
			}
		}
	} 
	
}
//convas转base64图片
function convertCanvasToImage() { 
	var zs=document.getElementById("my");
	var image = new Image();
　　image.src = zs.toDataURL("image/png"); 

　　$("#canvas_img").attr("src",image.src);
}
function p3_init(r){
	$(".p3_text2").html('<img src="'+app.path+'images/p3_rgb1.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb2.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb3.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb4.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb5.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb1.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb2.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb3.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb4.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb5.png?v='+loader.version+'"><img src="'+app.path+'images/p3_rgb'+r+'.png?v='+loader.version+'">')
	$(".p3_text1").hide().removeClass("animated pulse infinite").addClass("animated zoomIn");
	$(".p3_text2 img").css({"transform":"translate(0,-60px) scale(0.8)"});
	if(ltype=='ch'){
		$(".p3_text2").css("top","540px");
		
	}else{
		$(".p3_text2").css("top","520px");

	}
}
function p3_move(){
	$(".p3_text1").show().removeClass("animated zoomIn").addClass("animated pulse infinite");
	var list = $(".p3_text2").find("img");
	list.each(function(index){
		if(index==10){
			$(this).delay(index*200).transition({translate:[0,0],scale:[1,1]}, 400, 'linear', function(){}); 
		}else{
			$(this).delay(index*200).transition({translate:[0,0],scale:[1,1]}, 200, 'linear', function(){
				$(this).transition({translate:[0,60],scale:[0.8,0.8]}, 200, 'linear', function(){	
				}); 
			}); 
		}
		
	})
	
	
}