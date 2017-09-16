
(function() {
    var scripts = document.getElementsByTagName('script'),
        localhostTests = [
            /^localhost$/,
            /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?\b/ // IP v4
        ],
        host = window.location.hostname,
        isDevelopment = null,
        queryString = window.location.search,
        test, path, i, ln, scriptSrc, match;

    for (i = 0, ln = scripts.length; i < ln; i++) {
        scriptSrc = scripts[i].src;

        match = scriptSrc.match(/bootstrap\.js$/);

        if (match) {
            path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
            break;
        }
    }

    if (queryString.match('(\\?|&)debug') !== null) {
        isDevelopment = true;
    }
    else if (queryString.match('(\\?|&)nodebug') !== null) {
        isDevelopment = false;
    }

    if (isDevelopment === null) {
        for (i = 0, ln = localhostTests.length; i < ln; i++) {
            test = localhostTests[i];

            if (host.search(test) !== -1) {
                isDevelopment = true;
                break;
            }
        }
    }
    if (isDevelopment === null && window.location.protocol === 'file:') {
        isDevelopment = true;
    }

   /* document.write('<script type="text/javascript" charset="UTF-8" src="' + 
        path + 'ext-all' + (isDevelopment ? '-dev' : '') + '.js"></script>');*/
    document.write('<script type="text/javascript" charset="UTF-8" src="' + 
            path + 'ext-all.js"></script>');
    document.write('<script type="text/javascript" src="'+path+'locale/ext-lang-zh_CN.js"></script>');
    document.write('<script type="text/javascript" src="'+path+'UX_TimePickerField.js"></script>');
    document.write('<script type="text/javascript" src="'+path+'UX_DateTimePicker.js"></script>');
    document.write('<script type="text/javascript" src="'+path+'UX_DateTimeMenu.js"></script>');
    document.write('<script type="text/javascript" src="'+path+'UX_DateTimeField.js"></script>');
    document.write('<script type="text/javascript" src="'+path+'examples.js"></script>');
    document.write('<script type="text/javascript" src="/XHDIGITAL/Model/checkUserPower.js"></script>');
  /*  document.write('<script type="text/javascript" src='""+"></script>');
*/   /* document.write('<link rel="stylesheet" type="text/css" href="'+getRootPath()+'/resources/bootstrap-3.3.6/css/bootstrap.min.css"/>');
    * document.write('<link rel="stylesheet" type="text/css" href="'+getRootPath()+'/resources/font-awesome-4.3.0/css/font-awesome.min.css"/>');
    document.write('<script type="text/javascript" src="'+getRootPath()+'/resources/bootstrap-3.3.6/js/bootstrap.min.js"></script>');*/
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'resources/css/example.css">');
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'resources/css/ext-all-green.css">');
    
   /*
    
    if(getcookie("theme")==""){
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'resources/css/ext-all-neputne.css">');
    }
    else
    {
    var theme="";
    if(getcookie("theme")=="gray")theme="ext-all-gray.css";
    else{theme="ext-all.css";}
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'resources/css/'+theme+'">');	
    }*/

    
    
})();
function getcookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split(";");
	for(var i=0;i<arrcookie.length;i++){
		var arr=arrcookie[i].split("=");
		if(arr[0].match(name)==name)return arr[1];
	}
	return "";
}
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}
