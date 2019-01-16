package cn.powerrun.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONObject;

import cn.powerrun.utils.DateUtils;

public class GetImagePathServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String uploadPath;
	private String returnImgPath;

	File tempPathFile;
@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}
@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String fileName = null;
		File fullFile = null;
		File savedFile = null;

		// 设置上传文件存储的路径
		uploadPath = request.getSession().getServletContext().getRealPath("") + "upload" + File.separator + "img"
				+ File.separator + DateUtils.getDateFileName();
		// 设置用户访问到的图片文件路径
		returnImgPath = "upload" + File.separator + "img" + File.separator + DateUtils.getDateFileName()
				+ File.separator;

		File dir1 = new File(uploadPath);
		if (!dir1.exists()) {
			dir1.mkdirs();
		}

		try {
			DiskFileItemFactory factory = new DiskFileItemFactory();

			// Set factory constraints
			factory.setSizeThreshold(4096); // 设置缓冲区大小，这里是4kb
			factory.setRepository(tempPathFile);// 设置缓冲区目录

			// Create a new file upload handler
			ServletFileUpload upload = new ServletFileUpload(factory);

			// Set overall request size constraint
			upload.setSizeMax(41943040); // 设置最大文件尺寸，这里是40MB

			List<FileItem> items = upload.parseRequest(request);// 得到所有的文件
			Iterator<FileItem> i = items.iterator();
			if (i.hasNext()) {
				FileItem fi = i.next();
				fileName = fi.getName();
				if (fileName != null) {
					fullFile = new File(new String(fi.getName().getBytes())); // 解决文件名乱码问题
					savedFile = new File(uploadPath, fullFile.getName());
					fi.write(savedFile);
				}
			}

			String url = request.getServletContext().getContextPath() + File.separator + returnImgPath + fileName;
			System.out.println(url);

			response.getWriter().write(getResponse(url).toString());
			response.getWriter().flush();
			response.getWriter().close();

		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}
	}

	// 设置response的返回数据
	public JSONObject getResponse(String url) {
		JSONObject result = new JSONObject();
		result.put("url", url);

		return result;
	}

	public String getFileNameWithOutSuffix(String fileName) {
		return fileName.substring(0, fileName.indexOf("."));
	}

}
