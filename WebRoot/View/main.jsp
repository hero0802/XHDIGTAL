<%@ page language="java" import="java.util.*,java.text.*,java.net.URLDecoder" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%
	SimpleDateFormat format=new SimpleDateFormat("yyyy年MM月dd日  HH:dd:mm"); 
	String date=format.format(new Date()); 
	Cookie[] cookies = request.getCookies();
	String user = "";
	String groupname="";
			if (cookies != null) {
				for (int i = 0; i < cookies.length; i++) {
					if (cookies[i].getName().equals("username")) {
						user = URLDecoder.decode(cookies[i].getValue());
					}
					else if(cookies[i].getName().equals("groupname")){
					    groupname=URLDecoder.decode(cookies[i].getValue());
					}
				}
			}
	//String IP=request.getLocalAddr();
	int port=request.getLocalPort();
	HttpSession session1=request.getSession();
		//session1.setAttribute("user", "526");
	session1.setMaxInactiveInterval(100*60);
	String s=(String)session1.getAttribute("user");
	String ip = request.getHeader("x-forwarded-for");
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("Proxy-Client-IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("WL-Proxy-Client-IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("HTTP_CLIENT_IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getRemoteAddr();
		    }
	
	 %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>系统信息</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
    <link rel="stylesheet" type="text/css" href="resources/css/ico.css">
   
    <script type="text/javascript" src="resources/ext4.2/bootstrap.js"></script>
   
    <script type="text/javascript" src="Model/main.js"></script>
    
    <script type="text/javascript">
  function getcookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split(";");
	for(var i=0;i<arrcookie.length;i++){
		var arr=arrcookie[i].split("=");
		if(arr[0].match(name)==name)return arr[1];
	}
	return "";
}
function getGroupName(){
  return "<%=groupname%>"
}
function getLoginTime(){
  return "<%=date%>"
}
function getIP(){
  return "<%=ip%>"
}
function getPath(){
  return "<%=basePath%>"
}
</script>
  </head>
  
<body>
</body>
</html>
