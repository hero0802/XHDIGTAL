function getcookie(name){
    var strcookie=document.cookie;
	  var arrcookie=strcookie.split("; ");
    for(var i=0;i<arrcookie.length;i++){
          var arr=arrcookie[i].split("=");
          if(arr[0].match(name)==name)return arr[1];
    }
    return "";
}
var userCookie=getcookie("username");
if(userCookie!=""){}
else{
	window.top.location.href="/XHGMNET/classes/login/login.html";
}
