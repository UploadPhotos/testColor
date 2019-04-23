//定义常用函数
/*
common包含一些基础操作，包括同步后端的
1.时间戳函数getNowTime,getTime
2.前端变量是否定义，值是否存在的判断函数checkVal
3.url参数获取函数get
4.本地localStorage的操作库，setData，getData，removeData，clearData
5.封装好的异步ajax交互send
6.透明的弹出层，防止重复点击，layerShow，layerClose
7.数据提交的弹出层submitShow，submitClose
8.数据调试展示函数dump
9.变量sign用于localStorage数据前缀保存
10.init配置初始化
*/
var common = {
	//sign用于前端数据保存前缀
	sign	  :'common',
	//配置初始化
	init:function(config){
		var self = this;
		for(var i in config){
			self[i] = config[i];
		}
	},
	//变量验证，参数val是变量名称
	checkVal: function(val) {
		if (val == "undefined"||val==""||val==null) {
			return false;
		} else {
			return true;
		}
	},
	//获取url参数，name是参数名称
	get: function(name) {
		var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
		if (result == null || result.length < 1) {
			return "";
		}
		return result[1];
	},
		
	//生成当前时间戳
	getNowTime:function(){
		var myDate = new Date();
		var time = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
		var t = Date.parse(time.replace(/-/g,"/"))+'';
		return parseInt(t.substring(0,10));
	
	},
	//时间转时间戳
	getTime:function(time){
		var t = Date.parse(time.replace(/-/g,"/"))+'';
		return parseInt(t.substring(0,10));
	
	},
	/************************本地存储操作***********************/
	//保存值
	setData: function(key,value){
		var self = this;
		if(typeof value == 'object'){
			value = JSON.stringify(value);
			localStorage.setItem(self.sign+key+'Type', 'object');
		}else{
			localStorage.setItem(self.sign+key+'Type', 'string');
		}
		localStorage.setItem(self.sign + key, value);
	},
	//获取值
	getData: function(key){
		var self = this;
		var type  = localStorage.getItem(self.sign+key+'Type');
		var value = localStorage.getItem(self.sign + key);
		if(type == 'object'){
			return JSON.parse(value);
		}else{
			return value;
		}
	},
	//移除值
	removeData: function(key){
		var self = this;
		localStorage.removeItem(self.sign + key);
		localStorage.removeItem(self.sign + key+'Type');
	
	},
	//清空
	clearData: function(){
		localStorage.clear();
	},
	/************************本地存储操作结束***********************/
	
	//异步发送ajax请求，这个函数是封装与后台交互得ajax，参数必须包括token，X-Custom-Headers且值为wsd
	//参数isShow，代表是否需要进行提交效果
	send : function(url,data,callback,error,isShow){
		
		
		var self = this;
		return $.ajax({
			type : "POST",
			url : url,
			data : data,
			timeout: 6000, //超时时间：6秒
			async: true,
			dataType : "json",
			success : callback,
			error:error,
			beforeSend: function (xhr) {
				self.layerShow();
				if(isShow){self.submitShow();}
				xhr.setRequestHeader("X-Custom-Headers", "wsd");
				xhr.setRequestHeader("X-Custom-Token", app.token);
			},
			complete: function(){
				setTimeout(function(){self.layerClose();},600);
				if(isShow){setTimeout(function(){self.submitClose();},600);}
			}
		});
	},
	sendFirst : function(url,data,callback,error,isShow){
		
		
		var self = this;
		return $.ajax({
			type : "POST",
			url : url,
			data : data,
			timeout: 6000, //超时时间：6秒
			async: true,
			dataType : "json",
			success : callback,
			error:error,
			beforeSend: function (xhr) {
				self.layerShow();
				if(isShow){self.submitShow();}
				xhr.setRequestHeader("X-Custom-Headers", "wsd");
							
			},
			complete: function(){
				setTimeout(function(){self.layerClose();},600);
				if(isShow){setTimeout(function(){self.submitClose();},600);}
			}
		});
	},
	/************************隐藏遮罩层，防止重复点击***********************/
	//生成遮罩层
	layerShow : function(){
		var html='<div id="layer" style="position: fixed;width: 100%;height: 100%;top: 0;left: 0;z-index:99;"></div>';
		$('body').append(html);
	},
	//移除遮罩层
	layerClose : function(){
		$("#layer").remove();
	},
	
	submitShow :function(){
		var html='<div id="submit" style="    position: fixed;width: 200px;height: 200px;top: calc(50% - 130px); left: calc(50% - 100px);z-index: 99;border-radius: 20px;"><img src="./assets/images/load.png" style="    width: 50px;height: 50px;position: absolute;left: calc(50% - 25px);top: calc(50% - 25px);" class="loaddh"></div>';
		$('body').append(html);
	},
	submitClose : function(){
		
		$("#submit").remove();
	},
	/************************隐藏遮罩层结束***********************/
	//前台输出
	dump : function (data){
		var outData = '输出类型：'+typeof data+'<br>输出内容：';
		if($.trim(data) == ''){
			outData = '当前输出为空值';
		}else if(typeof data == 'object'){
			$.each(data,function(index,value){
				if(typeof value == 'object'){
					var i = 0;
					$.each(value,function(ind,val){
						if(i == 0){
							outData += '<br>├─'+index+':';
						}
						outData += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─'+ind+":"+val;
						i++;
					});
				}else{
					outData += '<br>├─'+index+":"+value;
				}
	　　　		
	　　　	});
		}else if(typeof data == 'boolean'){
			outData = outData+data.toString();
		}else if(typeof data == 'string' || typeof data == 'number'){
			outData = outData+data;
		}
		if(!document.getElementById("bugPrint")){
			$('body').append("<div id='bugPrint' style='background: rgba(0, 0, 0, 0.8);color: #fff;position: fixed;width: 100%;height: 100%;padding: 1em;overflow:scroll;font-size:18px;word-break;break-all;    z-index: 9;'></div>");
		}
		$('#bugPrint').append(outData+"<br><br>");	
	}
};

//与后端交互得授权，统计类
/*

1.跳转到授权的函数oauth
2.非调试模式下获取/添加用户信息函数getUser
3.调试模式下获取/添加用户信息函数demoUser
4.pv统计函数count
*/
var base = { 
	//授权地址
	oauthUrl :'',
	//错误提示地址
	errorUrl :'',
	//uv，pv统计
	countUrl :'',
	//回调地址
	backUrl  :'',

	//项目唯一标示
	sign	:'test',
	//调试模式
	debug   :false,
	//统计
	isCount :false,
	

	
	
	//初始化
	init	:function (config){
		
		var self = this;
		for(var i in config){
			self[i] = config[i];
		}
	
	
		if(self.debug){
			self.demoUser();
		}else{
			var user = common.getData("user");
			if(!common.checkVal(user)||user.user_openid == "demo_user_openid"){
				common.removeData("token");
				common.removeData("user");
			}
			self.getUser();
		}
		
	},
	//授权，授权地址拼接原来得连接参数，
	/*1.上base64加密得time时间戳，
	2.然后端进行连接有效期判断，
	3.回调地址back_url是你要跳转回来得前端html文件地址，
	4.scope授权模式，
	5.sign使用微信公众标识
	*/
	oauth	:function (){
		var self = this;
		var param = "";
		var url = window.location.href
		if (url.indexOf("?") != -1) {  
			param = url.split("?")[1];
		}
	
		window.location.href=self.oauthUrl+"?"+param+"&time="+base64.encode(common.getNowTime()+"")+"&sign="+self.sign+"&back_url="+self.shareUrl;
		
	},
	/*
	非调试模式下得用户注册和用户资料获取，这一步是程序开始得基础，用户进来index.html后会通过init来执行这个函数，先判断改微信用户本地是否已经有本地token，有则说明用户已经授过权，我们会向get_data.php获取用户信息，如果获取成功则，进行本地数据保存和pv统计，否则，执行授权地址，通过授权后，通过回调地址带上一个param加密参数，检查时候含有该参数，有则向add_user.php提交数据，否则重新授权。
	
	*/
	getUser:function(){
		var self = this;
		var token = common.getData("token");
		var param = common.get("param");
		
		
		if(!common.checkVal(token)&&!common.checkVal(param)){
		
			
			self.oauth();
			
		}else if(common.checkVal(token)){
			
			var url = window.location.href;
			if (url.indexOf("?") != -1) {  
				param = url.split("?")[1];
			}
			
			var vars="token="+token;
			common.send("./core/add_user.php?"+param,vars,function(res){
				if(res.code==1){
					common.setData("user",res.user);
					common.setData("token",res.token);
					self.back(res.user,res.token,res.other);
					self.count(res.other.isnew);
				}else{
					
					common.removeData("token");
					common.removeData("user");
					self.oauth();
				}
			},function(){	
				
				common.removeData("token");
				common.removeData("user");
				self.oauth();
			},false);
		}else{
				
			var url = window.location.href;
			if (url.indexOf("?") != -1) {  
				param = url.split("?")[1];
			}
			common.send("./core/add_user.php?"+param,{},function(res){
	
	
				if(res.code==1){
					
					common.setData("user",res.user);
					common.setData("token",res.token);
					self.back(res.user,res.token,res.other);
					self.count(res.other.isnew);
				}else{
					
					common.removeData("token");
					common.removeData("user");
					self.oauth();
				}
			},function(){
				
				common.removeData("token");
				common.removeData("user");
				self.oauth();
			},false,false);
		
		}
	},
	//调试模式数据
	/*
	debug调试模式下我们执行该函数，而不是getUser

	*/
	demoUser :function(){
		
		var self = this;
	
		var vars="param="+app.demo;
		common.send("./core/add_user.php",vars,function(res){
			
			if(res.code==1){
				common.setData("user",res.user);
				common.setData("token",res.token);
				self.back(res.user,res.token,res.other);
				self.count(res.other.isnew);
			}else{
				window.location.href=self.errorUrl+"?error="+res.msg;
			}
	
		},function(){
			
		},false);
	},
	/*pv统计
	1.countSign统计在后端的唯一标示，比如你的应用是365，该countSign=365
	2.isCount是否开启统计，app.Over活动结束也不会统计
	*/
	count :function(isnew){
		var self =this;
		if(app.Over||!self.isCount){
			return;
		}
		
		var self = this;
		var vars="app_sign="+self.sign+"&time="+base64.encode(common.getNowTime())+"&uv="+isnew;
		common.send(self.countUrl,vars,function(res){},function(){},false);
	},
	/************************登录遮罩层***********************/
	//登录遮罩层
	login : function(){
		var html='<div id="login" style="position: fixed;width: 290px;height: 150px;top: 40%;left: calc(50% - 145px);z-index: 99;background-color: rgba(0, 0, 0, 0.7);border-radius: 15px;"><span style="     width: 200px;font-size: 28px; text-align: center;position: absolute;   top: calc(50% - 18px); left: calc(50% - 70px);color: rgba(255, 255, 255, 0.7);"><img src="./assets/images/load.png" style=" width: 45px;position: adsolute;left: -50px; top: -5px;" class="loaddh">正在登录中...</span></div>';
		$('body').append(html);
		 
   
	},
	//移除登录遮罩层
	loginClose : function(){
		setTimeout(function(){
			$("#login").remove();
		},500)
		
	}
	/************************登录遮罩层结束***********************/
};


//局部滚动初始化
var myScroll = {
	config:{
		hScroll:false,
		vScroll:true,
		hScrollbar:false,
		vScrollbar:false,
		bounce:true,
		isOpacity:false,
		
	},
	//传入要滚动的id和配置
	init: function(id,config){
		var self = this;
		for(var i in config){
			self.config[i] = config[i];
		}
		var scrolls;
		if(self.config.isOpacity){
			$("#"+id).css("opacity",0).show();
			setTimeout(function(){
				return  new iScroll(id,self.config);
				$("#"+id).css("opacity",1);
			},100 );
		}else{
			$("#"+id).show();
			setTimeout(function(){
				return  new iScroll(id,self.config);
				
			},100 );
		}
		
	}

}

