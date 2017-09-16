package com.test;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import com.sql.SysSql;

public class ImportData {
	private static SysSql sysSql=new SysSql();
	
	public static void main(String[] args) throws Exception {
		ExcelToUnit();
		
	}
    //Excel表中的数据导入到MySql数据库
    public static  void ExcelToUnit() throws Exception{
        //得到表格中所有的数据
        List<JavaBean> listExcel=getAllByExcel("D://radioUser.xls");
        for (JavaBean struct : listExcel) {
        	String sql1="insert into phome_ecms_unit(unitId,unit)VALUES('"+struct.getUnitId()+"','"+struct.getUnit()+"')";
        	String sql2="insert into phome_ecms_company(unitId,companyId,company)"
        			+ "VALUES('"+struct.getUnitId()+"','"+struct.getCompanyId()+"','"+struct.getCompany()+"')";
			sysSql.Update(sql2);
//			System.out.println("导入成功"+struct.getUnit());
        }
        System.out.println("导入成功");
    }
    public static  List<JavaBean> getAllByExcel(String  file){
        List<JavaBean> list=new ArrayList<JavaBean>();
        try {
            Workbook rwb=Workbook.getWorkbook(new File(file));
          //取得第一个sheet  
            //int sheet=rwb.getSheets().length;           
            //for(int a=0;a<sheet;a++){
            Sheet rs=rwb.getSheet(1); 
            int clos=rs.getColumns();//得到所有的列
            int rows=rs.getRows();//得到所有的行
            for(int i = 1; i < rows; i++) {  
                Cell [] cell = rs.getRow(i);  
                int cellLen=cell.length;
                if(cellLen>1){
                	for(int j=0; j<3; j++) {  
                		JavaBean radiouser=new JavaBean();            
                		try {
                			/*System.out.println("导入:"+rs.getCell(j++, i).getContents().toString());
                			System.out.println("导入:"+rs.getCell(j++, i).getContents().toString());*/
                			radiouser.setUnitId(Integer.parseInt(rs.getCell(j++, i).getContents().toString()));
                    		//radiouser.setUnit(rs.getCell(j++, i).getContents());
                    		radiouser.setCompanyId(Integer.parseInt(rs.getCell(j++, i).getContents()));
                    		radiouser.setCompany(rs.getCell(j++, i).getContents());
                    		
                			list.add(radiouser);
                			
						} catch (NumberFormatException e) {
							// TODO: handle exception
						System.out.println("导入数据格式不对");
						}
                		
                		
                		
                    } 
                }
                 
            }  
           // }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            //e.printStackTrace();
        	System.out.println("导入excel出错");
        	e.printStackTrace();
        } 
        return list;
        
    }

}
