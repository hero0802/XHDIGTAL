package com.servlet;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sql.SysSql;

public class loginFilter extends HttpServlet implements Filter {
	private SysSql Sql = new SysSql();
	private FilterConfig filterConfig;
	private String XHGMPASS = "";
	private String XHGMUSERNAME = "";
	protected final Log log = LogFactory.getLog(loginFilter.class);

	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
		// logger.info("Login filter init!");
		this.filterConfig = filterConfig;

	}

	public void destroy() {
		// TODO Auto-generated method stub
		this.filterConfig = null;

	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) {
		// TODO Auto-generated method stub
		// 获得在下面代码中要用的request,response,session对象
		HttpServletRequest servletRequest = (HttpServletRequest) request;
		HttpServletResponse servletResponse = (HttpServletResponse) response;
		this.XHGMPASS = getCookie("xhgmpass", servletRequest);
		this.XHGMUSERNAME = getCookie("username", servletRequest);
		// 获得用户请求的URI
		String path = servletRequest.getRequestURI();

		// 从session里取员工工号信息
		// String name = (String) session.getAttribute("user");

		// 登陆页面无需过滤
		
		try {
			if (path.indexOf("/login.html") > -1) {
				chain.doFilter(servletRequest, servletResponse);
				return;
			} else if (path.indexOf("/loginout.jsp") > -1) {
				chain.doFilter(servletRequest, servletResponse);
				return;
			} else if (path.indexOf("/loadData.js") > -1) {
				chain.doFilter(servletRequest, servletResponse);
				return;
			} else if (path.indexOf("/loadData.html") > -1) {
				chain.doFilter(servletRequest, servletResponse);
				return;
			}/*else if (path.indexOf("/index.html") > -1) {
				chain.doFilter(servletRequest, servletResponse);
				return;
			}*/

			else {
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		

		// 判断如果没有取到登陆信息,就跳转到登陆页面
		String ExSql = "select * from xhdigital_web_user where username='"
				+ this.XHGMUSERNAME + "' and password='" + this.XHGMPASS + "' ";

		try {
			if (this.XHGMUSERNAME.equals("") || this.XHGMPASS.equals("")) {

				servletResponse.sendRedirect(servletRequest.getContextPath()
						+ "/View/login.html");
			} else {
				if (Sql.exists(ExSql)) {
					// 已经登陆,继续此次请求

					chain.doFilter(request, response);
				} else {
					// 跳转到登陆页面

					servletResponse.sendRedirect(servletRequest
							.getContextPath()
							+ "/View/login.html");
					/*
					 * PrintWriter out = response.getWriter();
					 * out.println("<html>"); out.println("<script>");
					 * out.println
					 * ("window.open ("+servletRequest.getContextPath(
					 * )+"/View/login.html"+",'_top')");
					 * out.println("</script>"); out.println("</html>");
					 */
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}
	}

	public String getCookie(String name, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return "";
		} else {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					return cookie.getValue();

				}
			}
		}
		return "";
	}

}
