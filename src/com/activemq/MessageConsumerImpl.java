package com.activemq;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

public class MessageConsumerImpl {
	private static final String BROKER_URL = "tcp://localhost:6666";  
	private static final String QUEUE_NAME = "RTU";
	
	
	public static void main(String[] args) throws JMSException {
		//1、创建工厂连接对象，需要制定ip和端口号
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(BROKER_URL);
        //2、使用连接工厂创建一个连接对象
        Connection connection = connectionFactory.createConnection();
        //3、开启连接
        connection.start();
        //4、使用连接对象创建会话（session）对象
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        
        Destination des=session.createQueue(QUEUE_NAME);
        
        MessageConsumer consumer=session.createConsumer(des);
        
        //创建一个监听器
        consumer.setMessageListener(new MessageListener() {
			
			public void onMessage(Message message) {
				// TODO Auto-generated method stub
				TextMessage textMessage=(TextMessage) message;
				try {
					System.out.println("接收到消息："+textMessage.getText());
				} catch (JMSException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}				
			}
		});
        //connection.close();
	}

}
