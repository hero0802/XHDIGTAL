
var map = null;
var img=null;
var markers = [];
var mscMarker=[];
var oneMarker=[];
var oneRadioMakerFlag=null;
var flightPath=null;
var refreshMap=1;
var nowMscId=0;
var userStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscId'},
	           {name:'name'},{name:'onlinestatus'},{name:'lat'},{name:'lng'},{name:'result'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : 'data/useronline.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
function LocalMapType() {
}
LocalMapType.prototype.tileSize = new google.maps.Size(256, 256);
LocalMapType.prototype.maxZoom = 17; // 地图显示最大级别
LocalMapType.prototype.minZoom = 2; // 地图显示最小级别
LocalMapType.prototype.name = "天津市地图";
LocalMapType.prototype.alt = "显示本地地图数据";
LocalMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
	img = ownerDocument.createElement("img");
	img.style.width = this.tileSize.width + "px";
	img.style.height = this.tileSize.height + "px";
	img.style.border=0;
	// 地图存放路径
	// 谷歌矢量图 maptile/googlemaps/roadmap
	// 谷歌影像图 maptile/googlemaps/roadmap
	// MapABC地图 maptile/mapabc/
	// strURL = "maptile/googlemaps/roadmap/";

	mapPicDir = "maptile/googlemaps/roadmap/";
	var curSize = Math.pow(2, zoom);
	strURL = mapPicDir + zoom + "/" + (coord.x % curSize) + "/"
			+ (coord.y % curSize) + ".png";
	// strURL = "E:/地图文件/谷歌地图中国0-12级googlemaps/googlemaps/roadmap/" + zoom +
	// "/" + (coord.x % curSize )+ "/" + (coord.y % curSize)+ ".PNG";

	img.src =strURL;
	img.alt = "" + "没有地图数据";
	
	CheckImgExists(strURL);
	return img;
};

var form=new Ext.FormPanel({
	   title:"手台轨迹查询",
       defaultType : 'textfield',// 表单默认类型
	   autoHeight:true,
	   border:false,
	   layout: {
           //type:'vbox',
           padding:'10',
          /* marginTop:'20',
           
			 * pack:'center',//垂直居中
			            align:'center'// 水平居中
*/       },
	   items:[{
			 fieldLabel:'手台号码',name: 'name',labelWidth: 60,width:220
		 },{fieldLabel:'起始时间',xtype:'datetimefield',id:'Ftime',name:'Ftime',format:'Y-m-d H:i:s',
	           value:getDay(),labelWidth: 60,width:220},
		          {fieldLabel:'结束时间',xtype:'datetimefield',id:'Etime',name:'Etime',
		           value:getOneDay(),format:'Y-m-d H:i:s',labelWidth: 60,width:220}],
		 buttons:[/*{
			 text:'刷新地图',
			 handler:MapData
		 },*/{
			 text:'查询轨迹',
			 handler:MapRadioUser
		 }]
})
var usergrid=Ext.create('Ext.grid.Panel',{	
	title:'用户列表',
	margin:'0 3 0 0',
	region:'center',
	store:userStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         /*new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "号码", width: 70, dataIndex: 'id'
	         },{text: "名称", width: 80, dataIndex: 'name', sortable: true
	         },{text: "在线状态", width: 50, dataIndex: 'onlinestatus',
	        	 renderer:function(value, metaData, record, rowIndex, colIndex, store){
	        		 if(value){
	        			 if(record.get('result')=="有定位"){
			        		 metaData.tdCls='x-grid-record-green';
			        	 }else if(record.get('result')=="无定位"){
			        		 metaData.tdCls='x-grid-record-yellow';
			        	 }else if(record.get('result')=="无数据") {
			        		 metaData.tdCls='x-grid-record-gray';
			        	 }
	        			 return "在线";}
	        		 else{return "<span style='color:red'>离线</span>"}
	        		 
	        	 }
	         },{text: "回执状态", width: 80, dataIndex: 'result',align:'center',
	        	 renderer:function(value, metaData, record, rowIndex, colIndex, store){
	        		 if(record.get('result')=="有定位"){
		        		 metaData.tdCls='x-grid-record-green';
		        	 }else if(record.get('result')=="无定位"){
		        		 metaData.tdCls='x-grid-record-yellow';
		        	 }else if(record.get('result')=="无数据") {
		        		 metaData.tdCls='x-grid-record-gray';
		        	 }
		        	 return value
	        		 
	        	 }
	         }
	         ],
	        // plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         
	        /* selModel: Ext.create('Ext.selection.CheckboxModel'),*/
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	            	 itemdblclick:function(dataview, record, item, index, e){
	            		 refreshMap=2;
	            		 clearMarkers();
	            		 nowMscId=record.get("id");
	            		 var record = usergrid.getSelectionModel().getLastSelected(); 
	            			form.getForm().findField("name").setValue(record.get("id"));
	            			for(var i=0;i<userStore.getCount();i++){
	            				if(userStore.getAt(i).get("id")==record.get("id")){
	            					userStore.getAt(i).set('result','获取数据中');
	            				}
	            			}
	            		 GetGPS(record.get("id"));
	            		
	            		 
	            	 },
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                    // contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },	 
	         emptyText:'<span>对不起，没有查询到数据</span></h1>',
	         /*tbar:[{
            	 xtype:'button',
            	 text:'<span style="color:red">手动上拉GPS</span>',
            	 margin:'30 0 0 0',
            	 iconCls:'gpstask',
            	 handler:gpsTask
             },{
            	 xtype:'button',
            	 text:'<span style="color:green">添加时间段任务</span>',
            	 margin:'20 0 0 0',
            	 iconCls:'selfgpstask',
            	 handler:addTask
             },{
            	 xtype:'button',
            	 text:'<span style="color:blue">添加定时任务</span>',
            	 margin:'20 0 0 0',
            	 iconCls:'selfgpstask',
            	 handler:addTimerTask
             }],*/
	         
	         dockedItems: [{
	        	 xtype:'toolbar',
	        	 dock:'top',
	        	 id:'handlerTask',
	        	 items:[{
            	 xtype:'button',
            	 text:'<span style="color:red">手动上拉GPS</span>',
            	 /*margin:'30 0 0 0',*/
            	 /*iconCls:'gpstask',*/
            	 handler:gpsTask
             },{
            	 xtype:'panel',border:0,
            	 html:'<div id="showMessage"></div>',
            	 /*margin:'30 0 0 0',*/
            	 /*iconCls:'gpstask',*/
            	 /*handler:*/
             }]
	         },{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{
	 				xtype:'combobox',fieldLabel:'支队',id:'mscType',name:'mscType',labelWidth:30,
		    		store:[
		    		       ["0","不限制"],["16","领导"],["0120","和平"],["0221","河东"],["0322","河西"],["0423","河北"],
		    		       ["0524","南开"],["0625","红桥"],["0726","东丽"],["0827","西青"],
		    		       ["0928","津南"],["1029","北辰"],["0033","机关"],["1139","塘沽"],
		    		       ["1240","汉沽"],["1341","大港"]],
		    		queryMode:'local',value:"0",width:110
				},{
	 				xtype:'combobox',fieldLabel:'状态',id:'status',name:'status',labelWidth:30,
		    		store:[
		    		       [2,"不限制"],[0,"离线"],[1,"在线"]],
		    		queryMode:'local',value:1,width:110
				},{
					xtype:'textfield',name:'mscId',id:'mscId',fieldLabel:'号码',labelWidth:30,width:130
				},{
	            	 xtype:'button',
	            	 text:'查询',
	            	 iconCls:'search',
	            	 handler:function(){userStore.reload()}
	             }]
         },{
             dock: 'bottom',
             xtype: 'pagingtoolbar',
             store: userStore, 
          	 displayInfo: true, 

          	 displayMsg: '<div>显示 {0} - {1} 条，共计 {2} 条</div>', 
          	 emptyMsg: "没有数据",
          	 beforePageText:'第',
          	 afterPageText:'页 共{0}页',
          	 firstText:'首页',
          	 prevText:'上一页',
          	 nextText:'下一页',
          	 lastText:'尾页',
          	 refreshText:'刷新',
          	 prependButtons:true
         }]

});

var html='<div id="map_canvas" style="left:0;top:0px;bottom:0;width:100%;height:100%;min-height:450px;position:absolute;"></div>';
var mapPanel=Ext.create('Ext.panel.Panel',{
	/*title:'地图',*/
	border:false,
	region:'center',
	layout:'border',
	items:[{
		xtype:"panel",
		region:'center',
		html:html
	},{
		xtype:'panel',
		region:"east",
		layout:"border",
		width:470,
		items:[usergrid,{
			xtype:'panel',
			region:"south",
			height:170,
			items:[form]
		}]
	},{
		xtype:'panel',
		layout:'column',
		region:'south',
		height:30,
		border:false,
		items:[{
			xtype:'textfield',
			fieldLabel:'缩放级别',
			labelWidth:60,
			width:100,
			id:'form-zoom',
			margin:2,
			value:getCookie("radiouser_zoom")==""?9:parseInt(getCookie("radiouser_zoom"))
		},{
			xtype:'textfield',
			fieldLabel:'经度',
			labelWidth:30,
			width:180,
			margin:2,
			id:'form-lon'
		},{
			xtype:'textfield',
			fieldLabel:'纬度',
			labelWidth:30,
			width:180,
			margin:2,
			id:'form-lat'
		},/*{
			xtype:"button",		
			iconCls:'',
			margin:'2 0 0 100 ',		
			 text:'加载手台标记',
			 handler:MapData
		},*//*{
			xtype:"button",		
			iconCls:'clear',
			margin:'2 0 0 100 ',		
			 text:'清除地图标记',
			 handler:ClearPhoneMarker
		},*/{
			xtype:"button",		
			iconCls:'refresh-map',
			margin:'2 0 0 50 ',		
			 text:'刷新地图',
			 handler:MapData
		}]
	}]
});
userStore.on('beforeload', function (store, options) {  
    var new_params = { 
    		mscType:Ext.getCmp("mscType").getValue(),
    		mscId:Ext.getCmp("mscId").getValue(),
    		online:Ext.getCmp("status").getValue(),
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  
    usergrid.getSelectionModel().clearSelections();

});
//表格行选择
/*usergrid.getSelectionModel().on({
	selectionchange:function(sm,selections){
	var data=usergrid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else{
		var record = usergrid.getSelectionModel().getLastSelected(); 
		form.getForm().findField("name").setValue(record.get("id"));
		for(var i=0;i<userStore.getCount();i++){
			if(userStore.getAt(i).get("id")==record.get("id")){
				userStore.getAt(i).set('result','获取数据中');
			}
		}
		
		var wgloc={};
		wgloc.lat=record.get("lat");
		wgloc.lng=record.get("lng");
		var lat=transformFromWGSToGCJ(wgloc).lat;
		var lng=transformFromWGSToGCJ(wgloc).lng;
		if(lat>0){
		setMapCenter(lat,lng);
		changeMaker(record.get("id"),lat,lng)
		
		}

	}
}
	
});*/
// 显示表格
Ext.QuickTips.init(); 
// 禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	/* loadConfig(); */
	
	new Ext.Viewport({
		layout:"border",
		style:'background:skyblue',
		items:mapPanel
	});
	mapInitialize();
	/*ClearPhoneMarker();*/
	userStore.load();
	//MapData();
	dwr_Data();
	dwr.engine.setActiveReverseAjax(true);
	//dwr.engine.setAsync(false);// 同步步
	dwr.engine.setErrorHandler(function() {
		//window.location.href = "index.html"
		console.log("map===err");
	});
	
});
function dwr_Data(){
	RadioDwr.RadioGps();
	// GpsMapDwr.rssi(null);
	// SocketDwr.BsViewDwr();
	// SocketDwr.callColor(null);
	// SocketDwr.BsControlDwr();
  } 
var infoWindow = new google.maps.InfoWindow(); 
function gpsPush(str){
	
	if(refreshMap==1){
		RadioMaker(str);
	}else{
		MapRadioUser();
	}
}
function radiogps(str){
	if(refreshMap==1){
		RadioMaker(str);
	}else if(refreshMap==0){
		MapRadioUser();
	}else{
		if(nowMscId!=0){
			clearMarkers();
			OneMaker(str);
			
		}
	}
}
function OneMaker(str){
	
	var data=Ext.decode(str);
	if(str==null){
		return;
	}
	if(nowMscId!=data.id){
		return;
	}
	for(var i=0;i<userStore.getCount();i++){
		if(userStore.getAt(i).get("id")==data.id){
			if(data.lat==0 || data.lng==0){
				userStore.getAt(i).set('result','无定位');	
			}else{
				userStore.getAt(i).set('result','有定位');
			}
		}
	}
	/*if(data.lat==0 || data.lng==0){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "数据无效，或者没有定位" , 
			icon: Ext.MessageBox.INFO  
		}); 
		
	}*/
		

	if(data.lat*1 > 38 && data.lat*1 < 40 && data.lng*1 > 116 && data.lng*1 < 119){
	 //markers.push(marker);
	var image = "";
	var wgloc={};
	wgloc.lat=data.lat;
	wgloc.lng=data.lng;
	var lat=transformFromWGSToGCJ(wgloc).lat;
	var lng=transformFromWGSToGCJ(wgloc).lng;	
	
	
	
	oneRadioMakerFlag = new google.maps.Marker({
		position :new google.maps.LatLng(lat,lng),	
		map : map,
		title : "ID:"+data.id+"名称："+data.name,
		id : data.id,
		data:data,
		icon : 'mapfiles/phoneMarker2.png',
	});
	   (function (oneRadioMakerFlag,data) {  
		
		   var id=data.id;
		   var alias=data.name;
		   var authoritystatus=data.authoritystatus;
		   var status=0;
		   var workgroupid=data.workgroupid;
		   var visittsid=data.visittsid;
		   var onlinestatus=data.onlinestatus
		   if(authoritystatus==0){
			   status="正常"
		   }else if(authoritystatus==1){
			   status="复活中"
		   }else if(authoritystatus==2){
			   status="摇晕"
		   }else if(authoritystatus==3){
			   status="摇晕中"
		   } else if(authoritystatus==4){
			   status="摇毙"
		   }else if(authoritystatus==5){
			   status="摇毙中"
		   }else{
			   status="未知"
		   }
		   if(onlinestatus==0){
			   onlinestatus='<span style="color:#fff;background:red">不在线</span>';
		   }else{
			   onlinestatus='<span style="color:#fff;background:red">在线</span>';
		   }
		   
		   var htmlStr='<span>ID:'+id+'</span><br>';
		   htmlStr+='<span>名称:'+alias+'</span><br>';
		   htmlStr+='<span>在线状态:'+onlinestatus+'</span><br>';
		   htmlStr+='<span>鉴权状态:<span style="color:#fff;background:green">'+status+'</span></span><br>';
		   htmlStr+='<span>附着组:'+workgroupid+'</span><br>';
		   htmlStr+='<span>漫游基站:'+visittsid+'</span>';
        google.maps.event.addListener(oneRadioMakerFlag, "click", function (e) {  
            infoWindow.setContent("<div style = 'width:150px;'>"+htmlStr+"</div>");  
            infoWindow.open(map, oneRadioMakerFlag);  
        });  
    })(oneRadioMakerFlag, data);
	   setMapCenter(lat,lng);
	}
	
	
}
function RadioMaker(str){
	var data=Ext.decode(str);
	if(str==null){
		return;
	}
	for(var i=0;i<userStore.getCount();i++){
		if(userStore.getAt(i).get("id")==data.id){
			if(data.lat==0 || data.lng==0){
				userStore.getAt(i).set('result','无定位');	
			}else{
				userStore.getAt(i).set('result','有定位');
			}
		}
	}
	
		

	if(data.lat*1 > 38 && data.lat*1 < 40 && data.lng*1 > 116 && data.lng*1 < 119){
	 //markers.push(marker);
	var image = "";
	var wgloc={};
	wgloc.lat=data.lat;
	wgloc.lng=data.lng;
	var lat=transformFromWGSToGCJ(wgloc).lat;
	var lng=transformFromWGSToGCJ(wgloc).lng;	
	var marker = new google.maps.Marker({
		position :new google.maps.LatLng(lat,lng),	
		map : map,
		title : "ID:"+data.id+"名称："+data.name,
		id : data.id,
		data:data,
		icon : 'mapfiles/marker5.png',
	});
	for(var j=0;j<markers.length;j++){
		  if(markers[j].id==data.id){
			  clearMarker(markers[j]);
			  markers.splice(j,1);			  
		  }
	  }
	 markers.push(marker);

	   (function (marker,data) {  
		
		   var id=data.id;
		   var alias=data.name;
		   var authoritystatus=data.authoritystatus;
		   var status=0;
		   var workgroupid=data.workgroupid;
		   var visittsid=data.visittsid;
		   var onlinestatus=data.onlinestatus
		   if(authoritystatus==0){
			   status="正常"
		   }else if(authoritystatus==1){
			   status="复活中"
		   }else if(authoritystatus==2){
			   status="摇晕"
		   }else if(authoritystatus==3){
			   status="摇晕中"
		   } else if(authoritystatus==4){
			   status="摇毙"
		   }else if(authoritystatus==5){
			   status="摇毙中"
		   }else{
			   status="未知"
		   }
		   if(onlinestatus==0){
			   onlinestatus='<span style="color:#fff;background:red">不在线</span>';
		   }else{
			   onlinestatus='<span style="color:#fff;background:red">在线</span>';
		   }
		   
		   var htmlStr='<span>ID:'+id+'</span><br>';
		   htmlStr+='<span>名称:'+alias+'</span><br>';
		   htmlStr+='<span>在线状态:'+onlinestatus+'</span><br>';
		   htmlStr+='<span>鉴权状态:<span style="color:#fff;background:green">'+status+'</span></span><br>';
		   htmlStr+='<span>附着组:'+workgroupid+'</span><br>';
		   htmlStr+='<span>漫游基站:'+visittsid+'</span>';
        google.maps.event.addListener(marker, "click", function (e) {  
            infoWindow.setContent("<div style = 'width:150px;'>"+htmlStr+"</div>");  
            infoWindow.open(map, marker);  
        });  
    })(marker, data);
	}
	
}


// 获取地图数据
function MapData(){
	clearMarkers();
	refreshMap=1;
	
}

// 手台轨迹
function MapRadioUser(){
	
	clearMarkers();
 	if( flightPath!=null){
		flightPath.setMap(null);// 将线条显示在地图上
		 flightPath=null;
	}
 	refreshMap=0;
	$.ajax({
		url : 'data/MapRadioUser.action',
		type : 'get',
		dataType : "json",
		data : {
			alias:form.getForm().findField('name').getValue(),
			startTime:form.getForm().findField('Ftime').getValue(),
			endTime:form.getForm().findField('Etime').getValue()
		},
		async : false,
		success : function(response) {
			var data = response.items;
			var lineData=[];
		
			for(var i=0;i<data.length;i++){
				var image = "",marker="";
				var wgloc={};
				wgloc.lat=data[i].latitude;
				wgloc.lng=data[i].longitude;
				var lat=transformFromWGSToGCJ(wgloc).lat;
				var lng=transformFromWGSToGCJ(wgloc).lng;
				if(i==0){
					/* marker = new MarkerWithLabel({
							position : new google.maps.LatLng(data[i].latitude,data[i].longitude),
							map : map,
							title : "起点：ID:"+data[i].srcId,
							id : data[i].srcId,
							icon : 'mapfiles/phoneMarker.png',
							labelContent :form.getForm().findField('name').getValue(),
							labelAnchor : new google.maps.Point(22, 0),
							labelClass : "marker-label-success"
						});*/
					  marker = new google.maps.Marker({
							position : new google.maps.LatLng(lat,lng),
							map : map,
							title : "起点：ID:"+data[i].srcId+"->时间:"+data[i].infoTime,
							icon:'mapfiles/point1.png'
						});
				}else if(i==data.length-1){
					 marker = new google.maps.Marker({
							position : new google.maps.LatLng(lat,lng),
							map : map,
							title : "终点：ID:"+data[i].srcId+"->时间:"+data[i].infoTime,
							icon:'mapfiles/point2.png'
						});
				}else{
					 marker = new google.maps.Marker({
							position : new google.maps.LatLng(lat,lng),
							map : map,
							title : "ID:"+data[i].srcId+"->时间:"+data[i].infoTime,
							icon:'mapfiles/point3.png'
						});
				}
			  
				   mscMarker.push(marker);
			}
			
			for(var i=0;i< data.length;i++){
				var wgloc={};
				wgloc.lat=data[i].latitude;
				wgloc.lng=data[i].longitude;
				var lat=transformFromWGSToGCJ(wgloc).lat;
				var lng=transformFromWGSToGCJ(wgloc).lng;
				var a= new google.maps.LatLng(lat,lng);
				lineData.push(a);
			}		                           
			 flightPath = new google.maps.Polyline({  
                 path: lineData,// 相应点坐标
                 strokeColor: "red",// 定义线条颜色
                 geodesic: true,
                 strokeOpacity: 1.0, // 线条透明的 取值0~1.0之间，由完全透明到不透明
                 strokeWeight: 2 // 线条粗细，单位为px
               });  
               flightPath.setMap(map);// 将线条显示在地图上
		},
		error : function() {
		}
	});
}
//手动上拉
var i=0;
function gpsTask(){
	clearMarkers();
	refreshMap=1;
	var ids = []; 
	Ext.getCmp('handlerTask').disable();
	/*for(var j=0;j<userStore.getCount();j++){
		var userId=userStore.getAt(j).get('id');
		var online=userStore.getAt(j).get("onlinestatus");
		if(online==1){
			ids.push(userId);
			userStore.getAt(j).set('result','等待处理..');
		} 
		
	}*/
    var timeout=setInterval(function(){
		if(i<userStore.getCount()){			
			gpsSet(i);
			userStore.getAt(i).set('result','正在拉取GPS');
			/*i++;*/
			
		}else{
			clearInterval(timeout);
			/*Ext.MessageBox.show({  
				title : "提示",  
				msg : "<p>一共执行"+i+"次</p> <p>成功"+successfully+"个</p> <p>失败"+error+"个</p>" , 
				icon: Ext.MessageBox.INFO 
			});*/
			//Ext.getCmp('dstId').enable();
			i=0;/*flag=0;successfully=0;error=0;*/
			 Ext.getCmp('handlerTask').enable();
			 for(var j=0;j<userStore.getCount();j++){
					var userId=userStore.getAt(j).get('id');
					var online=userStore.getAt(j).get("onlinestatus");
					if(userStore.getAt(j).get("result")!="无定位" && userStore.getAt(j).get("result")!="有定位")
						{
						userStore.getAt(j).set('result','无数据'); 
				}
			
		}
			var a=0,b=0,c=0;
			 for(var j=0;j<userStore.getCount();j++){
				 if(userStore.getAt(j).get("result")=="无数据"){
					 a++;
				 }
				 else if(userStore.getAt(j).get("result")=="有定位"){
					 b++;
				 }
				 else if(userStore.getAt(j).get("result")=="无定位"){
					 c++;
				 }
				 else{
				 }
			 }
			 var html="统计： 有定位："+b+" &nbsp; &nbsp; 无定位:"+c+"&nbsp; &nbsp;无数据:"+a
			 $("#showMessage").html(html);
		}
		
     }, 500);  //每隔 1秒钟  
/*	
	for(var j=0;j<userStore.getCount();j++){
		Ext.Ajax.request({
			url : '../controller/handleTask.action', 
			params : { 
			 mscId:ids.join(",")
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) {
		       
		    },
		    failure: function(response) {
		      }
		});
		userStore.getAt(j).set('result','正在拉取GPS');
	}*/
	
	
}
function GetGPS(id){
	Ext.Ajax.request({
		url : 'controller/handleTask.action', 
		params : { 
		 mscId:id
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response) {
	    	
	    },
	    failure: function(response) {
	     }
	});
}
function gpsSet(a){
	Ext.Ajax.request({
		url : 'controller/handleTask.action', 
		params : { 
		 mscId:userStore.getAt(a).get('id')
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response) {
	    	var rs = Ext.decode(response.responseText);
	    	if(rs.success){
	    		i++;
	    	}
	    },
	    failure: function(response) {
	     }
	});
}
function ClearPhoneMarker(){
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在操作中。。。',  
         loadMask: true, 
         removeMask: true // 完成后移除
     });
		myMask.show();
		Ext.Ajax.request({
			url : 'controller/ClearPhoneMarker.action', 
			params : {  
		
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
			myMask.hide();
		     var rs = Ext.decode(response.responseText)
		     
		     if(rs.success){
		    	 Ext.example.msg("提示","清空地图标记成功"); 
		    	 MapData();
		     }else{
		    	 Ext.MessageBox.show({  
   					 title : "提示",  
   					 msg : "清空地图标记失败", 
   					 icon: Ext.MessageBox.INFO  
   				 }); 
		     }
			     
		    },
		    failure: function(response) {
		    	myMask.hide();
		    	Ext.example.msg("提示","失败");  
		      }
		})	
}
// 检查图片是否存在
function CheckImgExists(imgurl) {  
	$('img').error(function(){
       $(this).attr('src', "resources/images/picture/maperror.png");
     });

} 
function mapInitialize() {
	var zoom=getCookie("radiouser_zoom")==""?9:parseInt(getCookie("radiouser_zoom"));
	
	
	
	var lat=39.387,lng=117.335;
	if(getCookie("radiouser_center_lat")!="" && getCookie("radiouser_center_lng")!=""){
		lat=parseFloat(getCookie("radiouser_center_lat"));
		lng=parseFloat(getCookie("radiouser_center_lng"));
	}
	var myLatlng = new google.maps.LatLng(lat, lng);
	var localMapType = new LocalMapType();
	var mapOptions = {
		zoom :zoom,
		center : myLatlng,
		disableDefaultUI : true,
		mapTypeControl: true,
		mapTypeControlOptions : {
			style : google.maps.MapTypeControlStyle.DEFAULT,
			mapTypeIds : ['localMap' ]
		// 定义地图类型
		},
		panControl : true,
		zoomControl : true, // 缩放控件
		/*zoomControlOptions:{
			style: google.maps.ZoomControlStyle.LARGE,  
	        position: google.maps.ControlPosition.LEFT_CENTER 
		},*/
		mapTypeControl : true,
		scaleControl : true ,// 尺寸
		streetViewControl : true,  // 小人
		rotateControl : true,
		
		overviewMapControl : true
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	map.mapTypes.set('localMap', localMapType); // 绑定本地地图类型
	map.setMapTypeId('localMap'); // 指定显示本地地图
	map.setOptions({
		draggable : true
	});
	var image = 'mapfiles/spotlight-poi.png';
/*	var marker = new MarkerWithLabel({
		position :new google.maps.LatLng(39,117),
		map : map,
		id:1,
		icon : 'mapfiles/mscMarker.png',
		labelContent : "33699",
		labelAnchor : new google.maps.Point(22, 0),
		labelClass : "marker-label", // the CSS class for
	});
	 marker.addListener('click', function(){
		 infowindow.open(map,marker);  
	 });*/
	/*
	 * marker.setMap(map);//将定义的标注显示在地图上
	 * 
	 */
	/* marker.addListener('click', toggleBounce); */
	/*
	 * map.addListener('click', function(event) { addMarker(event.latLng); });
	 */
	// 鼠标移动获取经纬度坐标
	google.maps.event.addListener(map, 'mousemove', function(event) {
		/*document.getElementById("showLatlng").innerHTML = "经度："
				+ event.latLng.lng() + ',纬度：' + event.latLng.lat();*/
		Ext.getCmp('form-lat').setValue(event.latLng.lat());
		Ext.getCmp('form-lon').setValue(event.latLng.lng());
		var center=map.getCenter().toString();
		center=center.substring(1,(center.length-1)).split(",");
		setCookie("radiouser_center_lat",center[0].trim());
		setCookie("radiouser_center_lng",center[1].trim());
	});
	// 鼠标滚动获取地图层级：
	google.maps.event.addListener(map, 'zoom_changed', function(event) {
		/*document.getElementById("showZoom").innerHTML = " 缩放级别："
				+ map.getZoom();*/
		Ext.getCmp('form-zoom').setValue(map.getZoom());
		setCookie("radiouser_zoom",map.getZoom());
	});

	/*
	 * google.maps.event.addListener(marker, 'click', function() { alert(1) });
	 */

}
function createMarker(location,bsId,title,labelContent,icon,record){
	  var marker = new MarkerWithLabel({
			position : location,
			map : map,
			title : title,
			id : bsId,
			icon :icon,
			record:record,
			// icon : 'resources/images/picture/police2.png',
			labelContent :labelContent,
			labelAnchor : new google.maps.Point(37, 0),
			labelClass : "marker-label-success", // the CSS class for
			labelStyle : {}
		    // animation: google.maps.Animation.DROP
		});
	  var infoWindow = new google.maps.InfoWindow(); 
	  markers.push(marker);
		var id="1";
		var name="123"
	   
			 var htmlStr='<span id="sd" >ID:'+marker.record.get("bsId")+'</span><br>';
		   htmlStr+='<span >名称:'+marker.record.get("bsName")+'</span><br>';
		   htmlStr+='<span>状态:'+(marker.record.get("online")=="2"?"<span style='color:green'>在线</span>":"<span style='color:red'>离线</span>")+'</span><br>';
		   htmlStr+='<span>信道:'+(marker.record.get("channel_number")=="0"?"- -":marker.record.get("channel_number"))+'</span><br>';
		
   google.maps.event.addListener(marker, "click", function (e) {  
       // Wrap the content inside an HTML DIV in order to set
			// height and width of InfoWindow.
       infoWindow.setContent("<div style = 'width:100px;'>"+htmlStr+"</div>");  
       infoWindow.open(map, marker);  
      
   }); 
	    google.maps.event.addListener(marker, "mousedown", function (e) {  
	         if(e.which==3){
	        	 bsId=marker.id;
	        	
	        	 
	        	
       
	         }    	 
	     }); 
	  
}
// marker点击事件
function markerClick(id) {
	var appElement = document.querySelector('[ng-controller=alarm]');
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.loadForm(id);
	if ($("aside-right").hasClass("show")) {

	} else {
		$("#aside-right").fadeToggle("fast");
		$("#aside-right").addClass("show");
	}

}
function toggleBounce() {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
// Adds a marker to the map and push to the array.
function addMarker(location) {
	var marker = new google.maps.Marker({
		position : location,
		map : map
	});
	markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(mapstr) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(mapstr);
	}
	for (var i = 0; i < mscMarker.length; i++) {
		mscMarker[i].setMap(mapstr);
	}
	if(oneRadioMakerFlag!=null || oneRadioMakerFlag==""){
		oneRadioMakerFlag.setMap(null)
	}
	for (var i = 0; i < oneMarker.length; i++) {
		oneMarker[i].setMap(mapstr);
	}
	
	/*if(flightPath!=null){
		flightPath.setMap(map)oneMarker
		
	}*/
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}
function clearMarker(mark){
	mark.setMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
}
// set center
function setMapCenter(lat,lng){
	var myLatlng = new google.maps.LatLng(lat, lng);
	map.setCenter(myLatlng,12);
	map.setZoom(12);
}
function changeMaker(mscId,lat,lng){
	clearMarkers();
	var infoWindow = new google.maps.InfoWindow(); 
	for(var j=0;j<markers.length;j++){
		  if(markers[j].id== mscId){
			  
			  var postion=new google.maps.LatLng(lat,lng);
			  var id=markers[j].id;
			  var title=markers[j].title;
			  var data=markers[j].data;
			  clearMarker(markers[j]);
			  markers.splice(j,1);
			  var marker = new google.maps.Marker({
					position :postion,	
					map : map,
					title : title,
					id : id,
					icon : 'mapfiles/marker2.png',
					animation: google.maps.Animation.DROP
				});
				markers.push(marker);
				
				 (function (marker,data) { 
					   var id=data.id;
					   var alias=data.name;
					   var authoritystatus=data.authoritystatus;
					   var status=0;
					   var workgroupid=data.workgroupid;
					   var visittsid=data.visittsid;
					   var onlinestatus=data.onlinestatus
					   if(authoritystatus==0){
						   status="正常"
					   }else if(authoritystatus==1){
						   status="复活中"
					   }else if(authoritystatus==2){
						   status="摇晕"
					   }else if(authoritystatus==3){
						   status="摇晕中"
					   } else if(authoritystatus==4){
						   status="摇毙"
					   }else if(authoritystatus==5){
						   status="摇毙中"
					   }else{
						   status="未知"
					   }
					   if(onlinestatus==0){
						   onlinestatus='<span style="color:#fff;background:red">不在线</span>';
					   }else{
						   onlinestatus='<span style="color:#fff;background:red">在线</span>';
					   }
					   
					   var htmlStr='<span>ID:'+id+'</span><br>';
					   htmlStr+='<span>名称:'+alias+'</span><br>';
					   htmlStr+='<span>在线状态:'+onlinestatus+'</span><br>';
					   htmlStr+='<span>鉴权状态:<span style="color:#fff;background:green">'+status+'</span></span><br>';
					   htmlStr+='<span>附着组:'+workgroupid+'</span><br>';
					   htmlStr+='<span>漫游基站:'+visittsid+'</span>';
					   Ext.Ajax.request({
							url:'data/callerInfo.action',
							params: {
							caller:id
						},
						method:'POST',
						async:false,
						success : function(response,opts){
							var rs=Ext.decode(response.responseText);
							if(rs.total>0){
								var data=rs.items[0];
								 htmlStr+='<span>型号：'+data.model+'</span><br>';
								 htmlStr+='<span>机器号：'+data.number+'</span><br>';
								 htmlStr+='<span>ESN：'+data.esn+'</span><br>';
								 htmlStr+='<span>开机密码：'+data.openpass+'</span><br>';
								 htmlStr+='<span>PDT ID：'+data.pdtId+'</span><br>';
								 htmlStr+='<span>MPT ID：'+data.mptId+'</span><br>';
								 htmlStr+='<span>模拟ID：'+data.moniId+'</span><br>';
								 htmlStr+='<span>登记人'+data.checkPerson+'</span><br>';
								 htmlStr+='<span>使用单位：'+data.company+'</span><br>';
								 htmlStr+='<span>使用人：'+data.person+'</span><br>';
								 htmlStr+='<span>警员编号：'+data.personNumber+'</span><br>';
								 htmlStr+='<span>职位：'+data.post+'</span><br>';
								
								/*$("#callerInfo").html(html);*/
							}else{
								/*$("#callerInfo").html("没有个人详细信息");*/
							}
						},
						failure: function(response) {}});	
		                google.maps.event.addListener(marker, "click", function (e) {  
		                    //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.  
		                    infoWindow.setContent("<div style = 'width:150px;'>"+htmlStr+"</div>");  
		                    infoWindow.open(map, marker);  
		                });  
		            })(marker, data);
			
				
				
				
				
				
				
		  }
	}
}

function drop() {
	for (var i = 0; i < markerArray.length; i++) {
		setTimeout(function() {
			addMarkerMethod();
		}, i * 200);
	}
}
function getDay()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    // -1000*60*60*24

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    } 
    if(strDay<10){
    	strDay="0"+strDay;
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"00:00:00";   
    return  strYesterday;
}
function getOneDay()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    //-1000*60*60*24

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    } 
    if(strDay<10){
    	strDay="0"+strDay;
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"23:59:59";   
    return  strYesterday;
}
function getCookie(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0].match(name) == name)
			return arr[1];
	}
	return "";
}
// 写cookies
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
var pi = 3.14159265358979324;

//
// Krasovsky 1940
//
// a = 6378245.0, 1/f = 298.3
// b = a * (1 - f)
// ee = (a^2 - b^2) / a^2;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function outOfChina(lat, lon){
    if (lon < 72.004 || lon > 137.8347)
        return 1;
    if (lat < 0.8293 || lat > 55.8271)
        return 1;
    return 0;
}
function transformLat(x,y){
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(x > 0 ? x:-x);
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 *Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
function transformLon(x,y){
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(x > 0 ? x:-x);
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}
function transformFromWGSToGCJ(wgLoc)
{
    var mgLoc ={};
    mgLoc.lat = 0;
    mgLoc.lng = 0;
    if (outOfChina(wgLoc.lat, wgLoc.lng))
    {
        mgLoc = wgLoc;
        return mgLoc;
    }
    var dLat = transformLat(wgLoc.lng - 105.0, wgLoc.lat - 35.0);
    var dLon = transformLon(wgLoc.lng - 105.0, wgLoc.lat - 35.0);

    var radLat = wgLoc.lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    mgLoc.lat = wgLoc.lat + dLat;
    mgLoc.lng = wgLoc.lng + dLon;

    return mgLoc;
}