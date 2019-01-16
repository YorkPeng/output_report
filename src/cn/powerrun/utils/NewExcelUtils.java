package cn.powerrun.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;

public class NewExcelUtils {

    public static HSSFWorkbook getExcel(JSONObject jsonObject) {
        int count = 0;
/*        System.out.println(jsonObject);*/

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet(jsonObject.getString("taiQuName"));

        // 设置列宽
        sheet.setColumnWidth(0, 2000);
        sheet.setColumnWidth(1, 2500);
        sheet.setColumnWidth(2, 4000);
        sheet.setColumnWidth(3, 2500);
        sheet.setColumnWidth(4, 6000);
        sheet.setColumnWidth(5, 6000);

        //设置样式
        HSSFCellStyle cellStyle = wb.createCellStyle();

        // 设置单元格的边框
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setBorderTop(BorderStyle.THIN);

        // 设置字体向左对齐
        cellStyle.setAlignment(HorizontalAlignment.CENTER);

        //创建表头
        HSSFRow titleRow = sheet.createRow(count);

        //设置对应
        titleRow.createCell(0).setCellValue("编号");
        titleRow.createCell(1).setCellValue("用户名");
        titleRow.createCell(2).setCellValue("用户编号");
        titleRow.createCell(3).setCellValue("标号");
        titleRow.createCell(4).setCellValue("资产编号");
        titleRow.createCell(5).setCellValue("地址");

        //分层解析JSON并提取相对应元素写入Workbook中。
        JSONArray jsonArray = (JSONArray) jsonObject.get("powerNode");
        String userName = "", id = "", bh = "", userAssetNumber = "", userAddress = "";
        for (int i = 0; i < jsonArray.size(); i++) {
            JSONObject data = (JSONObject) jsonArray.get(i);
            JSONArray userArray = (JSONArray) data.get("user");
            if (userArray != null) {
                for (int j = 0; j < userArray.size(); j++) {
                    JSONObject userdata = (JSONObject) userArray.get(j);
                    userAddress = userdata.getString("userAddress");
                    userAssetNumber = userdata.getString("userAssetNumber");
                    id = userdata.getString("id");
                    userName = userdata.getString("userName");
/*                    System.out.println(userName + id + userAssetNumber + userAddress);*/
                    HSSFRow dataRow = sheet.createRow(++count);
                    dataRow.createCell(0).setCellValue(count);
                    dataRow.createCell(1).setCellValue(userName);
                    dataRow.createCell(2).setCellValue(id);
                    dataRow.createCell(3).setCellValue(" ");
                    dataRow.createCell(4).setCellValue(userAssetNumber);
                    dataRow.createCell(5).setCellValue(userAddress);
                }
            }
        }
        return wb;
    }
}
