package com.dwr;

import java.util.Collection;

import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;

public class AlarmDwr {
	public static WebContext wctx = null;
	// 推送message
	public static void Alarm() {
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
		sb.appendScript("alarmData(");
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}

}
