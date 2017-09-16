package com.func;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.ShardedJedis;
import redis.clients.jedis.ShardedJedisPool;
import redis.clients.jedis.exceptions.JedisConnectionException;

public class RedisUtil {
	 //Redis服务器IP
    private static String ADDR = "127.0.0.1";   
    //Redis的端口号      
    private static int PORT = 6379;   
    //访问密码
    private static String AUTH = "admin";   
    //可用连接实例的最大数目，默认值为8；
    //如果赋值为-1，则表示不限制；如果pool已经分配了maxActive个jedis实例，则此时pool的状态为exhausted(耗尽)。
    private static int MAX_ACTIVE = 1024;    
    //控制一个pool最多有多少个状态为idle(空闲的)的jedis实例，默认值也是8。
    private static int MAX_IDLE = 200;  
    //等待可用连接的最大时间，单位毫秒，默认值为-1，表示永不超时。如果超过等待时间，则直接抛出JedisConnectionException；
    private static int MAX_WAIT = -1;    
    private static int TIMEOUT = 100000;
    //在borrow一个jedis实例时，是否提前进行validate操作；如果为true，则得到的jedis实例均是可用的；
    private static boolean TEST_ON_BORROW = true;
   // private static JedisPool jedisPool = null;
    private static  Jedis jedis;//非切片额客户端连接
    private static  JedisPool jedisPool;//非切片连接
    private static  ShardedJedis shardedJedis;//切片额客户端连接
    private static  ShardedJedisPool shardedJedisPool;//切片连接池
    /**
     * 初始化非切片池
     */
    private static void initialPool() { 
        // 池基本配置 
        JedisPoolConfig config = new JedisPoolConfig(); 
        config.setMaxActive(MAX_ACTIVE);
        config.setMaxIdle(MAX_IDLE);
        config.setMaxWait(MAX_WAIT);
        config.setTestOnBorrow(TEST_ON_BORROW);
        
        jedisPool = new JedisPool(config, ADDR, PORT, TIMEOUT);
    }
    
    /** 
     * 初始化切片池 
     */ 
    private void initialShardedPool() { 
        // 池基本配置 
        JedisPoolConfig config = new JedisPoolConfig(); 
        config.setMaxActive(MAX_ACTIVE);
        config.setMaxIdle(MAX_IDLE);
        config.setMaxWait(MAX_WAIT);
        config.setTestOnBorrow(TEST_ON_BORROW);
        // slave链接 
       /* List<JedisShardInfo> shards = new ArrayList<JedisShardInfo>(); 
        shards.add(new JedisShardInfo("127.0.0.1", 6379, "master")); */

        // 构造池 
       // shardedJedisPool = new ShardedJedisPool(config, shards); 
    } 
    
    /**
     * 获取Jedis实例
     * @return
     */
    public synchronized static Jedis getJedis() {
    	
        try {
        	initialPool();
            if (jedisPool != null) {
                Jedis resource = jedisPool.getResource();
                return resource;
            } else {
                return null;
            }
        } catch (JedisConnectionException e) {
           System.out.println("error:"+e.fillInStackTrace());
            return null;
        }
    }
    
    /**
     * 释放jedis资源
     * @param jedis
     */
    public static void returnResource(final Jedis jedis) {
        if (jedis != null) {
            jedisPool.returnResource(jedis);
        }
    }
}
