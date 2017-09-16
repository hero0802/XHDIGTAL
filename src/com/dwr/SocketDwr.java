package com.dwr;

import java.util.Collection;

import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;

public class SocketDwr {
	public static WebContext wctx = null;

	// 刷新数据
	public static void refresh() {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("refreshData(");
		// sb.appendData();
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	// 基站上下线
	public static void BsOffLineDwr(String str) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("BsOffLine(");
		 sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	//系统模拟数字切换
	public static void BsModel(String str) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("bsModel(");
		 sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	
	//基站状态推送
	public static void BsStatus(String str) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("bsStatusDwr(");
		 sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	//系统信道修改
		public static void BsChannelno(String str) {
			if (wctx == null) {
				wctx = WebContextFactory.get();
			}
			if (wctx == null) {
				return;
			}
			ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
			// 得到上下文
			WebContext contex = WebContextFactory.get();
			// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
			Collection<ScriptSession> scriptSessions = sctx
					.getScriptSessionsByPage(wctx.getCurrentPage());
			Util util = new Util(scriptSessions);
			// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
			ScriptBuffer sb = new ScriptBuffer();
			sb.appendScript("bsChan(");
			 sb.appendData(str);
			sb.appendScript(")");
			// 推送
			util.addScript(sb);

		}
	public static void bsInfoDwr() {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("BsInfo(");
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

	// 刷新基站视图数据
	public static void BsViewDwr() {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("BsViewRefresh(");
		// sb.appendData();
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

	// 刷新基站遥测数据
	public static void BsControlDwr() {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("BsControlRefresh(");
		//sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	public static void BsControl(String str) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("BsToControl(");
		sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

	// 设备上下线通知
	public static void OnOffStatus(String info) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("OnOffStatus(");
		sb.appendData(info);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

	// 获取场强信息
	public static void rssi(String info) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("rssiData(");
		sb.appendData(info);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

	// 改变呼叫列表图标颜色
	public static void callColor(String info) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("callColorControll(");
		sb.appendData(info);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

	public static void changeColor(String message) {

		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("show(");
		sb.appendData(message);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);
	}

	// 推送message
	public static void sendMessage(String message) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("recvData(");
		sb.appendData(message);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	//推送呼叫失败
	public static void CallError(String str) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("CallErrorInfo(");
		sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	public static void RadioGps(String str) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		@SuppressWarnings("deprecation")
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("radiogps(");
		sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

	

}
