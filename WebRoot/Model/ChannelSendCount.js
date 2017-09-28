//创建Model
Ext.define('bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name:'bsId'},
	        {name:'bsName'}
	        ], 
	        idProperty : 'id'
}); 
Ext.define('channel',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'label'},
	        {name: 'time'},
	        {name: 'timeTotal'},
	        {name: 'numTotal'}
	        ], 
	        idProperty : 'id'
});
//创建数据源
var bs_store = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/bsList.action',
	//url:'../../user/show.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            //排序字段。 
    	            property: 'id', 
    	            //排序类型，默认为 ASC 
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true
}
});
var bs_channel_store = Ext.create('Ext.data.Store',{
	model:'channel',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/channelPro.action',
	//url:'../../user/show.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            //排序字段。 
    	            property: 'id', 
    	            //排序类型，默认为 ASC 
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});

//创建grid
/*var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>系统>>基站信道机发射时间统计',
	{fieldLabel:'基站',xtype:'combobox',name:'bsId', id:'bsId', labelWidth:40,width:170,
        store:bs_store,queryModel:'remote',emptyText:'请选择...',value:0,
        valueField:'bsId',displayField:'bsName',forceSelection : true},	*/ 
var cChart = Ext.create('Ext.chart.Chart', {
	title:"基站信道机发射时间统计",
	id:'chart',
	region:'center',
	frame:false,
	margin:'3 3 3 3',
    style: 'background:#fff',
    //theme: 'Category1',
    theme: 'Red',
    legend: {
        position: 'bottom',
        renderer:function(v){
	    if(v=="num")return "数量"
	
        }
    },
    animate: true,
    shadow: true,
    store: bs_channel_store,
    axes: [{
        type: 'Numeric',position: 'left',fields: ['time'],
        title: '时间[秒]',minorTickSteps: 5,
        grid: {odd: {opacity: 0.3,fill: '#ddd',stroke: '#bbb','stroke-width': 0.5}},
        minimum: 0
    }, {
        type: 'Category',position: 'bottom',fields: ['label'], title: '',
        label: {
            rotate: {
                degrees: 90
            }
        }
    }],
    series: [{
        type: 'line',
        highlight: {
            size: 12,
            radius: 7
        },
        axis: 'left',
        smooth: true,
        fill: false,
        xField: 'label',
        yField: 'time',
        dispalyField:'时间', 
        markerConfig: {
            type: 'circle',
            size: 10,
            radius: 4,
            'stroke-width': 6
        },
        tips: {
            trackMouse: true,
            width: 170,
            height: 80,
            style:'color:#ffffff;background:green;',
            renderer: function(storeItem, item) {
            	var html="<p style='color:#ffffff'>日期："+storeItem.get('label')+"</p>";
            	html+="<p><span style='color:#ffffff'>信道机发射时间："+formatTime(storeItem.get('time'))+"</span></p>";
      	    
              this.setTitle(html);
            }
          }
    }]
});
var panel=Ext.create('Ext.Panel',{
	title:'基站信道机发射时间统计',
	region:'center',
	layout:'border',
	items:[{
		xtype:'panel',
		region:"north",
		layout:'column',
		items:[{fieldLabel:'基站',xtype:'combobox',name:'bsId', id:'bsId', labelWidth:40,width:200,
	        store:bs_store,queryModel:'remote',emptyText:'请选择...',value:0,
	        valueField:'bsId',displayField:'bsName',forceSelection : true,margin:'10 10 10 10'},
	        {fieldLabel:'起始时间',
	        	 xtype:'datetimefield',
	        	 id:'Ftime',
	        	 name:'Ftime',
	        	 format:'Y-m-d H:i:s',
       	    value:getDay(),
	        	 labelWidth: 60,width:230,margin:'10 10 10 10'},
	         {fieldLabel:'结束时间',
	        		 xtype:'datetimefield',
	        		 id:'Etime',
	        		 name:'Etime',
	        		 value:getOneDay() ,
	        		 format:'Y-m-d H:i:s',
	        		 labelWidth: 60,width:230,margin:'10 10 10 10'},
	        {
	        	xtype:"button",text:'统计数据',margin:'10 10 10 10',
	        	iconCls:'../resources/images/btn/tongji.png',
	        	handler:function(){
	        		bs_channel_store.reload()
	        	}
	        },{
	        	xtype:'panel',border:0,width:400,
	        	margin:'10 10 10 10',html:'<div id="showHtml">11</div>'
	        }]
	},cChart]
	
});
var setPanel=Ext.create('Ext.Panel',{
	title:'设置',
	region:'north',
	height:100,
	layout:'column',
	items:[{fieldLabel:'基站',xtype:'combobox',name:'bsId', id:'bsId2', labelWidth:40,width:200,
        store:bs_store,queryModel:'remote',emptyText:'请选择...',value:0,
        valueField:'bsId',displayField:'bsName',forceSelection : true,margin:'10 10 10 10'},
        {
        	xtype:"button",text:'设置为当前基站',margin:'10 10 10 10',
        	handler:function(){
        		set_btn();
        	}
        }]
})

bs_store.on('load',function(){
	for(var i =0;i<bs_store.getCount();i++){
		bs_store.getAt(i).set("bsName",bs_store.getAt(i).get('bsId')+":"+bs_store.getAt(i).get("bsName"));

	}
	Ext.Ajax.request({  
		url : '../data/nowBs.action',  
		params : {  
	},  
	method : 'POST',
	waitTitle : '请等待' ,  
    waitMsg: '正在提交中', 
	success : function(response, opts) {  
		var data = Ext.decode(response.responseText); 
		if(data.bsId>0){
			Ext.getCmp('bsId').setValue(data.bsId);			
			Ext.getCmp('bsId2').setValue(data.bsId);
		}
		
		
	},
	 failure: function(response) {}  
	}); 
})
bs_channel_store.on('beforeload',function(store,options){
	  var new_params = { 
	    		bsId: Ext.getCmp('bsId').getValue(),
	    		startTime: Ext.getCmp('Ftime').getValue(),
	    		endTime: Ext.getCmp('Etime').getValue()
	    		};  
	    Ext.apply(store.proxy.extraParams, new_params);  
})
bs_channel_store.on('load',function(store,options){
	var time=0;
	  for(var i=0;i<store.getCount();i++){
		  time+=store.getAt(i).get("time");
	  }
	  $("#showHtml").html("当前时间段信道机发射时间总计 》"+formatTime(time));
	  
})


//显示表格
Ext.QuickTips.init(); 
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	new Ext.Viewport({
	layout:"border",	
	items:[setPanel,panel]
     })
	bs_channel_store.load(); 
	bs_store.load();
});

//设置
function set_btn(){
	Ext.Ajax.request({  
		url : '../controller/changeBsId.action',  
		params : {  
			bsId:Ext.getCmp('bsId2').getValue()
	},  
	method : 'POST',
	waitTitle : '请等待' ,  
    waitMsg: '正在提交中', 
	success : function(response, opts) {  
		var data = Ext.decode(response.responseText); 
		if(data.success){
		if(data.bsId>0){
			Ext.getCmp('bsId').setValue(data.bsId);			
			Ext.getCmp('bsId2').setValue(data.bsId);
			bs_channel_store.load(); 
		}}else{
			Ext.MessageBox.show({  
				 title : "提示",  
				 msg : data.message , 
				 icon: Ext.MessageBox.ERROR 
			 }); 
		}
		
		
	},
	 failure: function(response) {}  
	}); 
}

function formatTime(second) {
    return [parseInt(second / 60 / 60), parseInt(second / 60 % 60), parseInt(second % 60)].join(":")
        .replace(/\b(\d)\b/g, "0$1");
}
function getDay()   
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
