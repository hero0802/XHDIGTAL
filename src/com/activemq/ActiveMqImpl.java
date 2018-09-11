package com.activemq;

import java.io.IOException;
import java.util.Arrays;

import javax.jms.BytesMessage;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

import com.func.WebFun;

public class ActiveMqImpl {
	private static final String BROKER_URL = "failover://tcp://localhost:6666";
	private static Connection connection = null;
	private static WebFun fun=new WebFun();

	public static void CreateConnection() throws JMSException {
		// 1、创建工厂连接对象，需要制定ip和端口号
		ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(BROKER_URL);
		// 2、使用连接工厂创建一个连接对象
		if (connection == null) {
			connection = connectionFactory.createConnection();
		}

		// 3、开启连接
		connection.start();
	}

	public static void SendTextMessage(String queueName,String msg) throws JMSException {
		// 4、使用连接对象创建会话（session）对象
		Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
		// 5、使用会话对象创建目标对象，包含queue和topic（一对一和一对多）
		// 创建队列
		Destination destination = session.createQueue(queueName);
		// 6、使用会话对象创建生产者对象
		MessageProducer producer = session.createProducer(destination);
		// 7、使用会话对象创建一个消息对象
		TextMessage textMessage = session.createTextMessage(msg);			
		producer.send(textMessage);
		//System.out.println("发送消息：" + fun.BytesToHexS(textMessage.getText().toString().getBytes()));
	}

	public static void RecvTextMessage(String queueName) throws JMSException {
		// 4、使用连接对象创建会话（session）对象
		Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
		// 5、使用会话对象创建目标对象，包含queue和topic（一对一和一对多）
		Destination des = session.createQueue(queueName);
		MessageConsumer consumer = session.createConsumer(des);
		// 创建一个监听器
		consumer.setMessageListener(new MessageListener() {
			public void onMessage(Message message) {
				// TODO Auto-generated method stub
				TextMessage textMessage = (TextMessage) message;
				try {
					System.out.println("接收到消息：" + fun.BytesToHexS(textMessage.getText().toString().getBytes()));
					
					/*try {
						fun.writeVoiceFile("146", textMessage.getText().toString().getBytes());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}*/
				} catch (JMSException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});
	}

}
