package com.test;

import java.net.ConnectException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.func.RedisUtil;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;
import redis.clients.jedis.exceptions.JedisException;

public class test {
	private static Jedis jedis;
	
	/**
	 *判断key值是否存在 jedis.exists("key");
	 *查看某个key的剩余生存时间,单位【秒】，永久生存或者不存在的都返回-1：jedis.ttl("key")
	 *移除某个key的生存时间 jedis.persist("key001")
	 *查看key所储存的值的类型 jedis.type("key001")
	 *修改键名jedis.rename("key6", "key0")
	 * @param args
	 */

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		setUp();
		try {
			SaveString();
			//RedisMap();
			//RedisList();
			/*System.out.println(jedis.get("username"));
			System.out.println(jedis.get("name100"));
			System.out.println(jedis.get("name123"));
			System.out.println(jedis.get("name456"));
			System.out.println(jedis.get("name2000000"));*/
		} catch (JedisConnectionException e) {
			// TODO: handle exception
			System.out.println("系统连接异常"+e.fillInStackTrace());
		}
		
	}
	public static void setUp() {
		 //连接redis服务器，127.0.0.1:6379
		try {
			//jedis = new Jedis("127.0.0.1", 6379);
			jedis=RedisUtil.getJedis();
			//jedis.flushDB();//清空库中的所有数据；
			/*Set<String> keys = jedis.keys("*"); 
	        Iterator<String> it=keys.iterator(); */ 
	        /*System.out.println("=============all keys=============");   
	        while(it.hasNext()){   
	            String key = it.next();   
	            System.out.println(key);   
	        }
	        System.out.println("=============================="); */
			
			
		} catch (JedisConnectionException e) {
			// TODO: handle exception
			System.out.println("系统连接异常:"+e.fillInStackTrace());
		}
	}
	//redis 字符串保存
	public static void SaveString(){
		jedis.set("username", "张三");
		
		for(int i=17008884;i<25000000;i++){
			jedis.set("name"+i, "张三"+i);
			System.out.println(i);
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		//jedis.expire("username",30);score1030500
		//System.out.println(jedis.get("username"));
		//System.out.println(jedis.get("score1030500"));
	}
	//redis 操作map
	public static  void RedisMap(){
		Map<String, String> map=new HashMap<String, String>();
		map.put("name", "李四");
		map.put("age", "18");
		map.put("sex", "gril");
		jedis.hmset("userA", map);
		jedis.hmset("userB", map);

		//user中键值个数
		System.out.println(jedis.hlen("userB"));
		System.out.println(jedis.hmget("userA", "age","sex")); 
		System.out.println(jedis.hmget("userA", "sex"));
		System.out.println(jedis.hmget("userA", "name")); 
		System.out.println(jedis.hkeys("userA"));
	   
		
	}
	//redis 操作List
	public static void  RedisList() {
		 //开始前，先移除所有的内容  
       // jedis.del("score"); 
        System.out.println(jedis.lrange("score",0,-1).size()); 
        
        /*List a=jedis.lrange("score",0,-1);
        for(int i=0;i<10;i++){
        	System.out.println(a.get(i));
        }*/
        
        //先向key java framework中存放三条数据  
        /*for(int i=0;i<20000000;i++){
        	jedis.lpush("score",String.valueOf(i));
        	System.out.println(i);
        }*/
          
        /*jedis.lpush("java framework","struts");  
        jedis.lpush("java framework","hibernate");  */
        //再取出所有数据jedis.lrange是按范围取出，  
        // 第一个是key，第二个是起始位置，第三个是结束位置，jedis.llen获取长度 -1表示取得所有  
       /* System.out.println(jedis.lrange("java framework",0,-1)); 
        
        jedis.del("java framework");
        jedis.rpush("java framework","spring");  
        jedis.rpush("java framework","struts");  
        jedis.rpush("java framework","hibernate"); 
        System.out.println(jedis.lrange("java framework",0,-1));*/
	}

}
