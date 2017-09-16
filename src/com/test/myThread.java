package com.test;

public class myThread {
	public static void main(String[] args) {
		while(uu.getTick()>0){
			uu u=new uu();
			Thread a=new Thread(u);
			Thread b=new Thread(u);
			Thread c=new Thread(u);
			a.start();
			b.start();
			c.start();
		}
		
	}
	

}

class uu implements Runnable {
	private static int tick = 1000;

	public void run() {
		// TODO Auto-generated method stub
      aa();
	}

	public synchronized void aa() {
		try {
			tick--;
			System.out.println(Thread.currentThread().getName()+"=sale:"+tick);
			Thread.sleep(2000); /* 每次运行就沉睡一下 */
		} catch (Exception e) {

		}
	}

	public static int getTick() {
		return tick;
	}

	public static void setTick(int tick) {
		uu.tick = tick;
	}
	

}
