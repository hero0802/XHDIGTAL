package com.socket;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class SocketListener implements ServletContextListener {
    private LongSocket socketThread;
     
    /**
     * 销毁 当servlet容器终止web应用时调用该方法
     */
    public void contextDestroyed(ServletContextEvent arg0) {
        if(null != socketThread && !socketThread.isInterrupted()){
            /*socketThread.closeSocketServer();//关闭线程
*/            socketThread.interrupt();//中断线程
        }
    }
 
    /**
     * 初始化 当servlet容器启动web应用时调用该方法
     */
    public void contextInitialized(ServletContextEvent arg0) {
        if(null == socketThread){
            socketThread = new LongSocket();
            socketThread.start();
        }
    }
 
}
