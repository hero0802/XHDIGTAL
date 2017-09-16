function loadDataBase(){
	var win=Ext.create("Ext.Window",{
		title:'导入数据库',
		height:300,
		width:500,
		html:'<h3>这是你第一次使用系统，系统正在加载数据库</h3>'
	})
	win.show();
}

Ext.onReady(function(){
	Ext.QuickTips.init(); 
dwr.engine.setActiveReverseAjax(true);
dwr.engine.setAsync(false);//同步步
dwr_Data();
dwr.engine.setErrorHandler(function(){
	/*window.location.href=getRootPath()+"/index.jsp"*/
})

});
function dwr_Data(){
	loadDataDwr.sendMessage("");
  }
function recvData(msg){
	//$(".data").append("<h4>"+msg+"</h4>")
	var str=msg.split("|");
	$(".data").prepend("<h4>"+str[0]+"</h4>")
	$(".data").prepend("<h4>-----------------------------------------------------------------------</h4>");
	$("#all").html(str[1]);
	$("#complate").html(parseInt(str[2])+parseInt(str[3]));
	$("#success").html(str[2]);
	$("#error").html(str[3]);
}
function loaddata(){
	$("button").attr('disabled','true');
   if(checkDataBase()){
	   alert("所需数据库已经存在不需要 再安装,或者数据库未连接上")
	   return;
	}
	Ext.Ajax.request({  
		url :'../controller/iniData.action',  
		params : { 
	},
	async:true,
	method : 'POST',  
	success : function(response, opts) {  
		var rs= Ext.decode(response.responseText);
		$(".hh").html("<p style='color:red'>数据加载完成页面开始跳转</p>");
		
		Ext.Msg.confirm("请确认", "数据加载完成页面开始跳转至首页", function(button, text) {  
			if (button == "yes") {
				window.location.href="../index.html";
			}
		}) 
				
		    
	}})
	}
function checkDataBase(){
	var str=true;
    $.ajax({
			   url:'../data/lockExists.action',
			   type:'POST',
			   dataType:'json',
			   async:false,
			   success: function(response) { 
			   if(response.success){ str=true;
			   }else{ str=false;}
			     
			   },
			   failure: function(response) {
			   str=true;
			   }
			
			});
    return false;
	}