Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../../ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging'
             ]		 
);
Ext.define('chartModel',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'label'},
	        {name: 'time'},
	        {name: 'num'},
	        {name: 'timeTotal'},
	        {name: 'numTotal'}
	        ]
});
/*var myMask = new Ext.LoadMask(Ext.getBody(), {  
     msg: '正在加载数据，请稍后！',  
     loadMask: true, 
     removeMask: true //完成后移除  
 });*/
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'chartModel',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/callPro.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            //排序字段。 
    	            property: 'value', 
    	            //排序类型，默认为 ASC 
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});
var storeGrid = Ext.create('Ext.data.Store',{
	model:'chartModel',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/callPro.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            //排序字段。 
    	            property: 'value', 
    	            //排序类型，默认为 ASC 
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});
var proFlag="话务量最大的前20个基站";
var searchForm=Ext.create('Ext.FormPanel',{
	width:250,
	authHeight:true,
	layout:'form',
	bodyPadding:5,
	border:false,
	frame:false,
	items:[{
		xtype:'fieldset',
		
		title:'统计方式',
		layout:'form',
		items:[{
			xtype:'radiogroup',fieldLabel:'',name:'proType',checked:true,labelWidth:0,layout:'column',
			listeners:{
	        'change':function(){
			var form=searchForm.getForm();
	          if(form.findField('proType').getValue()['proType'] == 0) 
	          {  
	             Ext.getCmp("ts").show(); 
	             Ext.getCmp("time").hide();
	             Ext.getCmp("group").hide();
	             Ext.getCmp("calltype").hide();
	             proFlag="话务量最大的前20个基站";
	             
	          }
	          if(form.findField('proType').getValue()['proType'] ==1){
	        	  Ext.getCmp("ts").hide(); 
	              Ext.getCmp("time").show();
	              Ext.getCmp("group").hide();
	              Ext.getCmp("calltype").hide();
	              proFlag="统计时间段内的话务量";
	          }
	          if(form.findField('proType').getValue()['proType'] ==2){
	        	  Ext.getCmp("ts").hide(); 
	              Ext.getCmp("time").hide();
	              Ext.getCmp("group").show();
	              Ext.getCmp("calltype").hide();
	              proFlag="话务量最大的前20个组";
	          }
	          if(form.findField('proType').getValue()['proType'] ==3){
	        	  Ext.getCmp("ts").hide(); 
	              Ext.getCmp("time").hide();
	              Ext.getCmp("group").hide();
	              Ext.getCmp("calltype").show();
	              proFlag="呼叫类型";
	          }
	        }},
			items: [
		            { boxLabel: '基站', name:'proType', inputValue: 0,checked: true },
		           /* { boxLabel: '按通话组的话务量', name:'proType', inputValue: 2},
		            { boxLabel: '按呼叫类型的话务量', name:'proType', inputValue: 3},*/
		            { boxLabel: '系统', name:'proType', inputValue: 1,margin:'0 0 0 30'},
		        ]
		}]
	},{
		xtype:'fieldset',title:'筛选条件',layout:'form',id:'ts',
		items:[{fieldLabel:'起始时间',xtype:'datetimefield',name:'startTime_ts',format:'Y-m-d H:i:s',
	        value:getDay(),labelWidth: 60,width:220},
	    {fieldLabel:'结束时间',xtype:'datetimefield',name:'endTime_ts',
	         value:getOneDay() ,format:'Y-m-d H:i:s',labelWidth: 60,width:220}
	    ]
	},{
		xtype:'fieldset',title:'筛选条件',layout:'form',id:'time',hidden:true,
		items:[{
			fieldLabel:'基站ID',xtype:'textfield',labelWidth:60,width:150,emptyText:'可以为空',
			name:'tsid'
		},{
			fieldLabel:'通话组',xtype:'textfield',labelWidth:60,width:150,emptyText:'可以为空',
			name:'groupAlias'
		},{fieldLabel:'起始时间',xtype:'datetimefield',name:'startTime_time',format:'Y-m-d H:i:s',
	        value:getDay(),labelWidth: 60,width:220},
	    {fieldLabel:'结束时间',xtype:'datetimefield',name:'endTime_time',
	         value:new Date(),format:'Y-m-d H:i:s',labelWidth: 60,width:220}
	    ]
	},{
		xtype:'fieldset',title:'筛选条件',layout:'form',id:'group',hidden:true,
		items:[{fieldLabel:'起始时间',xtype:'datetimefield',name:'startTime_group',format:'Y-m-d H:i:s',
	        value:getDay(),labelWidth: 60,width:220},
	    {fieldLabel:'结束时间',xtype:'datetimefield',name:'endTime_group',
	         value:new Date(),format:'Y-m-d H:i:s',labelWidth: 60,width:220}
	    ]
	},{
		xtype:'fieldset',title:'筛选条件',layout:'form',id:'calltype',hidden:true,
		items:[{fieldLabel:'起始时间',xtype:'datetimefield',name:'startTime_call',format:'Y-m-d H:i:s',
	        value:getDay(),labelWidth: 60,width:220},
	    {fieldLabel:'结束时间',xtype:'datetimefield',name:'endTime_call',
	         value:new Date(),format:'Y-m-d H:i:s',labelWidth: 60,width:220}
	    ]
	},
    {
		xtype:'button',iconCls:'search',text:'提交',margin:'10 -10 0 0',
		handler:function(){
		var form=searchForm.getForm();
		if(form.findField('proType').getValue()['proType']==0){
			store.on('beforeload', function (store, options) {  
     		    var new_params = { 
     		    		proType:0,
     		    		startTime:form.findField('startTime_ts').getValue(),
     		    		endTime:form.findField('endTime_ts').getValue()
     		    };  
     		    Ext.apply(store.proxy.extraParams, new_params);
     		   
     			// myMask.show();

     		});
		}
		
		if(form.findField('proType').getValue()['proType']==1){
			store.on('beforeload', function (store, options) {  
     		    var new_params = { 
     		    		proType:1,
     		    		tsid:form.findField('tsid').getValue(),
     		    		groupAlias:form.findField('groupAlias').getValue(),
     		    		startTime:form.findField('startTime_time').getValue(),
     		    		endTime:form.findField('endTime_time').getValue()
     		    };  
     		    Ext.apply(store.proxy.extraParams, new_params);
     			// myMask.show();

     		});
		}
	/*	
		if(form.findField('proType').getValue()['proType']==2){
			store.on('beforeload', function (store, options) {  
     		    var new_params = { 
     		    		proType:2,
     		    		startTime:form.findField('startTime_group').getValue(),
     		    		endTime:form.findField('endTime_group').getValue()
     		    };  
     		    Ext.apply(store.proxy.extraParams, new_params);
     			 //myMask.show();

     		});
		}
		
		if(form.findField('proType').getValue()['proType']==3){
			store.on('beforeload', function (store, options) {  
     		    var new_params = { 
     		    		proType:3,
     		    		startTime:form.findField('startTime_call').getValue(),
     		    		endTime:form.findField('endTime_call').getValue()
     		    };  
     		    Ext.apply(store.proxy.extraParams, new_params);
     			// myMask.show();

     		});
		}*/
		store.reload();
		//storeGrid=store;
	}
	}]
})

var searchPanel=Ext.create('Ext.Panel',{
	title:'查询',
	region:'west',
	width:250,
	items:[searchForm]
	
});
Ext.chart.LegendItem.prototype.getLabelText = function() {
	var me = this, series = me.series, idx = me.yFieldIndex;

	function getSeriesProp(name) {
		var val = series[name];
		return (Ext.isArray(val) ? val[idx] : val);
	}

	return getSeriesProp('dispalyField') || getSeriesProp('yField');
};
var cChart = Ext.create('Ext.chart.Chart', {
	id:'chart',
	region:'center',
	frame:false,
	width:500,
	height:260,
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
    store: store,
    axes: [{
        type: 'Numeric',position: 'left',fields: ['num','time'],
        title: '时间、次数',minorTickSteps: 5,
        grid: {odd: {opacity: 0.3,fill: '#ddd',stroke: '#bbb','stroke-width': 0.5}},
        minimum: 0
    }, {
        type: 'Category',position: 'bottom',fields: ['label'], title: '',
        label: {
            rotate: {
                degrees: 70
            }
        }
    }],
    series: [{
        type: 'line',
        highlight: {
            size: 7,
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
            size: 4,
            radius: 4,
            'stroke-width': 0
        },
        tips: {
            trackMouse: true,
            width: 150,
            height: 25,
            style:'color:#ffffff;background:#000000;',
            renderer: function(storeItem, item) {
      	    
              this.setTitle("<span style='color:#ffffff'>通话时间："+formatTime(storeItem.get('time'))+"</span>");
            }
          }
    },{
        type: 'line',highlight: {size: 7,radius: 7},
        gutter: 80,
        axis: 'left',smooth: true,
        xField: 'label',yField: 'num',dispalyField:'次数', 
        markerConfig: {
            type: 'circle',size: 4,radius: 4,'stroke-width': 3
        },
        tips: {
            trackMouse: true,
            width: 120,
            height: 25,
            style:'background:green;color:#ffffff',
            renderer: function(storeItem, item) {
              this.setTitle("<span style='color:#ffffff'>通话次数："+storeItem.get('num')+"</span>");
            }
          }
    }]
});

var grid=Ext.create('Ext.grid.Panel',{
	title:'表格统计',
	region:'south',
	id:'grid',
	height:200,
	store:store,
	collapsible : true,
	collapsed:false,
	split:true,
	disableSelection: false,
	autoScroll:true,
	viewConfig: {
        stripeRows: true,
        forceFit: false,
        loadMask:false
    },  
	columns:[{text: "标记", width: 150, dataIndex: 'label'}, 
	         {text: "通话次数", width: 80, dataIndex: 'num'}, 
	         {text: "通话时长", width: 150, dataIndex: 'time',
	        	 renderer:function(v){
	        		 return formatTime(v);
	        	 }}/*,
	         {text: "时长总计", width: 150, dataIndex: 'timeTotal' },
	         {text: "次数总计", width: 150, dataIndex: 'numTotal'}*/],
	         frame:false,
	         border:true,
	         /*forceFit: false,*/
	         columnLines : true, 
	         autoWidth:true,
             emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>'

});

store.on('load',function (store, options){
	//Ext.getCmp('chart').axes.get(1).setTitle(proFlag)
	// myMask.hide();
	 if(store.getCount()==0){
		 Ext.example.msg("提示","没有数据")
	 }
	var sum = 0,time=0;
	 store.each(function(record){
   sum += Number(record.get('num'));
   time += Number(record.get('time'));
  });
	 Ext.getCmp('grid').setTitle('表格统计》 时长总计:   '+formatTime(time)+'     次数总计： '+sum);
  //grid.store.insert(0, {label:'--',time:'--',num:'--',timeTotal:formatTime(time),numTotal:sum});// 插入到最后一行
})

/*store.on('load',function(store, options){
	var sum = 0;
	 store.each(function(record){
     sum += Number(record.get('num'));
    });
    var n = store.getCount();// 获得总行数
    grid.store.insert(0, {timeS:'--',timeE:'--',srcId:'--',dstId:'--',num:"<span style='color:green; font-size:18'>GPS数量总计： "+sum+"</span>"});// 插入到最后一行 
//    grid.getView().getRow(1).style.backgroundColor='#DCDCDC';
})*/
var mainPanel=Ext.create('Ext.Panel',{
	title:'图形统计',
	frame:false,
	region:'center',
	layout: 'border',
	items:[ cChart,grid]
})
Ext.onReady(function () { 
	new Ext.Viewport({
		layout:'border',
		renderTo:Ext.getBody(),
		items:[searchPanel,mainPanel]
	})
//	store.load({params:{start:0,limit:50}}); 
	
})
function getTime(value)   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime()-1000*60*60*24*value*30;

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    }   
    var strYesterday=strYear+"-"+strMonth;   
    return  strYesterday;
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

