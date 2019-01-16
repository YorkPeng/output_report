package cn.powerrun.controller;

import java.io.File;
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
import org.json.JSONObject;

import cn.powerrun.utils.DateUtils;
import cn.powerrun.utils.JsonUtils;

public class GetJSONServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String uploadPath;

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
		uploadPath = request.getSession().getServletContext().getRealPath("") + "upload" + File.separator + "json"
				+ File.separator + DateUtils.getDateFileName();

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
			upload.setSizeMax(4194304); // 设置最大文件尺寸，这里是4MB

			List<FileItem> items = upload.parseRequest(request);// 得到所有的文件
			Iterator<FileItem> i = items.iterator();
			if (i.hasNext()) {
				FileItem fi = i.next();
				fileName = fi.getName();
				if (fileName != null) {
					fullFile = new File(new String(fi.getName().getBytes(), "utf-8")); // 解决文件名乱码问题
					System.out.println("name:"+fi.getName());
					savedFile = new File(uploadPath, fullFile.getName());
					fi.write(savedFile);
				}
			}

			//保存文件后,

			response.getWriter().write(JsonUtils.FileToJson(savedFile));
			response.getWriter().flush();
			response.getWriter().close();

		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}
	}


}
