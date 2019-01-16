package cn.powerrun.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONObject;

import cn.powerrun.utils.DateUtils;
import cn.powerrun.utils.ExcelUtils;

public class GetExcelServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private String uploadPath;
	private String returnExcelPath;
	private String excelPath;
	File tempPathFile;
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req,resp);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String fileName = null;
		File fullFile = null;
		File savedFile = null;
		
		//设置上传文件存储的路径
		uploadPath = request.getSession().getServletContext().getRealPath("")+"upload"+File.separator + "json" + File.separator + DateUtils.getDateFileName();
		//设置用户访问到的excel文件路径
		returnExcelPath = "upload"+File.separator + "excel" + File.separator + DateUtils.getDateFileName() + File.separator;
		//设置excel文件存储路径
		excelPath = request.getSession().getServletContext().getRealPath("")+"upload"+File.separator + "excel" + File.separator + DateUtils.getDateFileName() + File.separator;
		File dir1 = new File(uploadPath);
		if(!dir1.exists()) {
			dir1.mkdirs();
		}
		File dir2 = new File(excelPath);
		if(!dir2.exists()) {
			dir2.mkdirs();
		}

		try {
			DiskFileItemFactory factory = new DiskFileItemFactory();
			
			// Set factory constraints
			factory.setSizeThreshold(4096); // 设置缓冲区大小，这里是4kb
			factory.setRepository(tempPathFile);// 设置缓冲区目录
			
			// Create a new file upload handler
			ServletFileUpload upload = new ServletFileUpload(factory);
			
			// Set overall request size constraint
			upload.setSizeMax(4194304); // 设置最大文件尺寸，这里是4MB
			
			List<FileItem> items = upload.parseRequest(request);// 得到所有的文件
			Iterator<FileItem> i = items.iterator();
			if(i.hasNext()) {
				FileItem fi = i.next();
				fileName = fi.getName();
				if (fileName != null) {
					fullFile = new File(new String(fi.getName().getBytes(), "utf-8")); // 解决文件名乱码问题
					savedFile = new File(uploadPath, fullFile.getName());
					fi.write(savedFile);
				}
			}
//
			HSSFWorkbook workbook = ExcelUtils.getExcel(savedFile);
			//将文件写入本地
			File excel = new File(excelPath+getFileNameWithOutSuffix(fileName)+".xls");

String url = request.getServletContext().getContextPath() + File.separator + returnExcelPath + excel.getName();
System.out.println(url);
			FileOutputStream fos = new FileOutputStream(excel);
			workbook.write(fos);
			fos.flush();
			fos.close();

			response.getWriter().write(getResponse(url).toString());
			response.getWriter().flush();
			response.getWriter().close();
			
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			
		}
	}
	
	//设置response的返回数据
	public JSONObject getResponse(String url) {
		JSONObject result = new JSONObject();
		result.put("url", url);
		
		return result;
	}
	
	public String getFileNameWithOutSuffix(String fileName) {
		return fileName.substring(0, fileName.indexOf("."));
	}

}
