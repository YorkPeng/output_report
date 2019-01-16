package cn.powerrun.utils;

import java.io.File;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.json.JSONArray;
import org.json.JSONObject;

public class ExcelUtils {
	
	public static HSSFWorkbook getExcel(File file) {
		
		JSONObject afterDeal = new JSONObject(JsonUtils.FileToJson(file));
		JSONArray jsonArray = (JSONArray) afterDeal.get("powerNode");

		HSSFWorkbook workbook = new HSSFWorkbook(); // 生成一个excel的工作簿
		Sheet sheet = workbook.createSheet("0");

		// 设置列宽
		sheet.setColumnWidth(0, 2000);
		sheet.setColumnWidth(1, 2500);
		sheet.setColumnWidth(2, 4000);
		sheet.setColumnWidth(3, 2500);
		sheet.setColumnWidth(4, 6000);
		sheet.setColumnWidth(5, 6000);
		// 设置样式
		HSSFCellStyle cellStyle = workbook.createCellStyle();

		// 设置单元格的边框
		cellStyle.setBorderBottom(BorderStyle.THIN);
		cellStyle.setBorderLeft(BorderStyle.THIN);
		cellStyle.setBorderRight(BorderStyle.THIN);
		cellStyle.setBorderTop(BorderStyle.THIN);
		// 设置字体向左对齐
		cellStyle.setAlignment(HorizontalAlignment.CENTER);
		// 设置表头
		Row rowHead = sheet.createRow(0);
		
		Cell cell1 = rowHead.createCell(0);
		cell1.setCellValue("编号");
		cell1.setCellStyle(cellStyle);
		Cell cell2 = rowHead.createCell(1);
		cell2.setCellValue("用户名");
		cell2.setCellStyle(cellStyle);
		Cell cell3 = rowHead.createCell(2);
		cell3.setCellValue("用户编号");
		cell3.setCellStyle(cellStyle);
		Cell cell4 = rowHead.createCell(3);
		cell4.setCellValue("相型");
		cell4.setCellStyle(cellStyle);
		Cell cell5 = rowHead.createCell(4);
		cell5.setCellValue("资产编号");
		cell5.setCellStyle(cellStyle);
		
		Cell cell6 = rowHead.createCell(5);
		cell6.setCellValue("地址");
		cell6.setCellStyle(cellStyle);
		int index = 1;
		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject temp = (JSONObject) jsonArray.get(i);
			if (temp.get("nodeType").equals("user")) {
				System.out.println(temp);
				JSONArray user = (JSONArray) temp.get("user");
				for(int j = 0; i < user.length(); j++) {
					JSONObject temp2 = (JSONObject) user.get(i);
					Row row = sheet.createRow(index++);
					cell2 = row.createCell(0);
					cell2.setCellValue(index-1);
					cell2.setCellStyle(cellStyle);
					cell2 = row.createCell(1);
					cell2.setCellValue(temp2.getString("userName"));
					cell2.setCellStyle(cellStyle);
					cell3 = row.createCell(2);
					cell3.setCellValue(temp2.getLong("id"));
					cell3.setCellStyle(cellStyle);
					cell4 = row.createCell(3);
					cell4.setCellValue(temp2.getString("userPhase"));
					cell4.setCellStyle(cellStyle);
					cell5 = row.createCell(4);
					cell5.setCellValue(temp2.getString("userAssetNumber"));
					cell5.setCellStyle(cellStyle);
					cell6 = row.createCell(5);
					cell6.setCellValue(temp2.getString("userAddress"));
					cell6.setCellStyle(cellStyle);
				}


			}

		}
		String regionName = (String) afterDeal.get("taiQuName");
		// 设置sheet的名称
		workbook.setSheetName(0, regionName);

		return workbook;
	}

}
