// JavaScript Document
"use strict";

function isEmpty(p) {
	if(p === undefined || p === "" || p === null) {
		return true;
	} else {
		return false;
	}
}

function isNotEmpty(p) {
	if(isEmpty(p)) {
		return false;
	} else {
		return true;
	}
}
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
function showAll() {
	if(withBackGround) {
		drawWithBackGroud();
	} else {
		drawWithOutBackGroud();
	}
}

function drawWithBackGroud() {
	ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
	ctx.drawImage(img, 0, 0);
	draw(myInfo);
}

function drawWithOutBackGroud() {
	ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, baseCanvas.width, baseCanvas.height);
	draw(myInfo);
}
//向页面添加一个canvas元素，展示台区的节点信息
function addCanvas(id, canvas) {
	canvas = getCanvas(canvas);
	canvas.setAttribute("id", id);
	canvas.setAttribute("width", 5000);
	canvas.setAttribute("height", 5000);
	return canvas;
}

function getCanvas(canvas) {
	if (canvas === null || canvas === undefined) {
		var main = document.getElementById("screenViewport");
		canvas = document.createElement("canvas");
		main.appendChild(canvas);
		return canvas;
	} else {
		return canvas;
	}
}

function downloadPDF() {
	var pdfName = window.prompt("请填写报告的名字", path);
	if(pdfName == null) {
		return ;
	}
	var canvas1 = document.createElement('canvas'); //创建一个新画布储存有节点的区域
	var canvas2 = document.createElement('canvas'); //创建一个新画布储存有节点的区域
	canvas1.setAttribute("width", maxCoordinate[0] - minCoordinate[0] + 100);
	canvas1.setAttribute("height", maxCoordinate[1] - minCoordinate[1] + 100);
	canvas2.setAttribute("width", maxCoordinate[0] - minCoordinate[0] + 100);
	canvas2.setAttribute("height", maxCoordinate[1] - minCoordinate[1] + 100);
	var pdfCanvas1 = canvas1.getContext("2d");
	var pdfCanvas2 = canvas2.getContext("2d");
	var image1 = ctx.getImageData(minCoordinate[0] - 50, minCoordinate[1] - 50, maxCoordinate[0] + 50, maxCoordinate[1] + 50);
	pdfCanvas1.putImageData(image1, 0, 0);
	pdfCanvas1.font="12px Arial";
	pdfCanvas2.font="12px Arial";
	pdfCanvas1.fillText("2",canvas1.width / 2,canvas1.height - 10);
	var baseUrl1 = canvas1.toDataURL("image/jpeg");
	var baseUrl2;
	var image2;
	if(withBackGround){
		hideBG();
		image2 = ctx.getImageData(minCoordinate[0] - 50, minCoordinate[1] - 50, maxCoordinate[0] + 50, maxCoordinate[1] + 50);
		pdfCanvas2.putImageData(image2, 0, 0);
		pdfCanvas2.fillText("3",canvas2.width / 2,canvas2.height - 10);
		baseUrl2 = canvas2.toDataURL("image/jpeg");
		showBG();
	}else{
		showBG();
		image2 = ctx.getImageData(minCoordinate[0] - 50, minCoordinate[1] - 50, maxCoordinate[0] + 50, maxCoordinate[1] + 50);
		pdfCanvas2.putImageData(image2, 0, 0);
		pdfCanvas2.fillText("3",canvas2.width / 2,canvas2.height - 10);
		baseUrl2 = canvas2.toDataURL("image/jpeg");
		hideBG();
	}
	var doc = new jsPDF('', 'pt', 'a4');
	//动态生成pdf封面
	var coverUrl = pdfCover();
	var formUrl = pdfForm();
	doc.addImage(coverUrl, 'JPEG', 0, 0, 592.28, 841.89);
	doc.addPage('a4');
	doc.addImage(baseUrl1, 'JPEG', 0, 0, 592.28, 841.89);
	doc.addPage('a4');
	doc.addImage(baseUrl2, 'JPEG', 0, 0, 592.28, 841.89);
	for(var i = 0; i < formUrl.length; i++) {
		doc.addPage('a4');
		doc.addImage(formUrl[i], 'JPEG', 0, 0, 592.28, 841.89);
	}
	doc.save(pdfName + ".pdf");
	var fileName = btoa(doc.output()); //获取文件名并转码
	$.ajax({
	    url:"",  //后台接收地址
	    data:{
	       fileName : fileName,
	    },
	    type:'post',
	    async: false,
	    success:function(result) {
	                           
	    }
	});
}
//动态生成pdf封面
function pdfCover() {
	var canvas = document.createElement('canvas');
	canvas.setAttribute("width", 630);
	canvas.setAttribute("height", 891);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var img = new Image();
	img.src = $(".logo").attr("src");
	ctx.drawImage(img, 0, 0); 
	ctx.strokeStyle = "#36D030";
	ctx.beginPath();
	ctx.moveTo(0,380);
	ctx.lineTo(630,380);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0,500);
	ctx.lineTo(630,500);
	ctx.stroke();
	ctx.fillStyle = "black";
	ctx.font="20px Arial";
	ctx.textAlign="end";
	ctx.fillText("中山市东区供电局", 630, 440);
	ctx.fillText(REGION_NAME, 630, 480);
	ctx.fillStyle = "#009237";
	ctx.font="15px Arial";
	ctx.textAlign="center";
	ctx.fillText("广东力行电气技术有限公司制作", 315, 830);
	ctx.fillText(AcquireTime(), 315, 860);
	ctx.font="30px Arial";
	ctx.textAlign="end";
	ctx.fillStyle = "black";
	ctx.fillText("地理信息图建模报告",629,319);
	ctx.fillStyle = "grey";
	ctx.fillText("地理信息图建模报告",631,321);
	ctx.fillStyle = "#F79646";
	ctx.fillText("地理信息图建模报告",630,320);
	ctx.fillStyle = "black";
	ctx.textAlign="center";
	ctx.font="12px Arial";
	ctx.fillText("1",315,881);
	var url = canvas.toDataURL("image/jpeg");
	return url;
}

//动态生成pdf中的表格
function pdfForm() {
	var canvas = document.createElement('canvas');
	var maxWidth = 	userMaxLength[0] + userMaxLength[1] + userMaxLength[2] + userMaxLength[3] + userMaxLength[4] + userMaxLength[5];
	var width = 630;
	var height = 891;
	while(maxWidth > width) {   //使页面的宽度始终大于表格的宽度
		width += 210;
	}
	height = height * width / 630;   
	canvas.setAttribute("width", width);
	canvas.setAttribute("height", height);
	var borderWidth = (width - maxWidth) / 2; //边界的宽度 
	var maxCapacity = (height - 15) / 15 - 1; //每页pdf的最大容量
	var str = String(maxCapacity);
	var pointIndex = str.indexOf(".");
	str.substring(0, pointIndex);
	maxCapacity = parseInt(str);
	var url = []; 
	var pageNum = 0;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.font="12px Arial";
	ctx.textAlign="center";
	//每一项的绘制基线
	var testAlign = [];
	testAlign[0] = borderWidth + userMaxLength[0] / 2;
	testAlign[1] = borderWidth + userMaxLength[0] + userMaxLength[1] / 2;
	testAlign[2] = borderWidth + userMaxLength[0] + userMaxLength[1] + userMaxLength[2] / 2;
	testAlign[3] = borderWidth + userMaxLength[0] + userMaxLength[1] + userMaxLength[2] + userMaxLength[3] / 2;
	testAlign[4] = borderWidth + userMaxLength[0] + userMaxLength[1] + userMaxLength[2] + userMaxLength[3] + userMaxLength[4] / 2;
	testAlign[5] = borderWidth + userMaxLength[0] + userMaxLength[1] + userMaxLength[2] + userMaxLength[3] + userMaxLength[4] + userMaxLength[5] / 2;
	ctx.fillText("编号" ,testAlign[0], 15);
	ctx.fillText("用户名" ,testAlign[1], 15);
	ctx.fillText("用户编号" ,testAlign[2], 15);
	ctx.fillText("标号" ,testAlign[3], 15);
	ctx.fillText("地址" ,testAlign[4], 15);
	ctx.fillText("资产编号" ,testAlign[5], 15);
	var index = 0;
	var userNum = 1;
	$(myInfo.powerNode).each(function() {
		var nodeName = this.nodeName;
		switch(this.nodeType) {
			case "user":
				$(this.user).each(function() {
					ctx.fillText(index + 1, testAlign[0], 15 + 15 * userNum);
					ctx.fillText(this.userName, testAlign[1], 15 + 15 * userNum);
					ctx.fillText(this.id, testAlign[2], 15 + 15 * userNum);
					ctx.fillText(nodeName, testAlign[3], 15 + 15 * userNum);
					ctx.fillText(this.userAddress, testAlign[4], 15 + 15 * userNum);
					ctx.fillText(this.userAssetNumber, testAlign[5], 15 + 15 * userNum);
					index++;
					userNum++;
					if(index % maxCapacity === 0) {
						ctx.fillText(pageNum + 4, canvas.width / 2, canvas.height - 10);
						url[pageNum++] = canvas.toDataURL("image/jpeg");  //先存储一页再清空画布
						ctx.fillStyle = "white";
						ctx.fillRect(0, 0, canvas.width, canvas.height);
						ctx.fillStyle = "black";
						userNum = 1;
					}
				});
		}
	});
	ctx.fillText(pageNum + 4,canvas.width / 2,canvas.height - 10);
	url[pageNum] = canvas.toDataURL("image/jpeg");
	return url;
}

function AcquireTime() {     //获取当前时间
  	var $time = new Date();
  	var $year = $time.getFullYear();
  	var $month = $time.getMonth() + 1;
  	var $day = $time.getDate();
  	$month = CheckTime($month);
  	$day = CheckTime($day);
  	var $now = $year + "年" + $month + "月" + $day + "日";
  	return $now;
  }

function CheckTime(i) {
	if(i < 10) {
	  i = "0" + i;
	}
	return i;
}


function saveUserMaxLength(jsonArr) {
	$(jsonArr).each(function() {
		var nodeName = this.nodeName;
		switch(this.nodeType) {
			case "user":
				$(this.user).each(function() {
					if(String(this.userName).length * 12 > userMaxLength[1]) {
						userMaxLength[1] = String(this.userName).length * 12;
					}
					if(String(this.id).length * 12 > userMaxLength[2]) {
						userMaxLength[2] = String(this.id).length * 12;
					}
					if(String(nodeName).length * 12 > userMaxLength[3]) {
						userMaxLength[3] = String(nodeName).length * 12;
					}
					if(String(this.userAddress).length * 12 > userMaxLength[4]) {
						userMaxLength[4] = String(this.userAddress).length * 12;
					}
					if(String(this.userAssetNumber).length * 12 > userMaxLength[5]) {
						userMaxLength[5] = String(this.userAssetNumber).length * 12;
					}
				});
				break;
		}
	});
	console.log(userMaxLength);
}
//下载json文件
function downloadJSON(data) {
	//弹出弹框对json进行命名
	var picName = window.prompt("请填写json文件的名字", path);
	//使用toDataURL方法将图像转换被base64编码的URL字符串
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
	var a = document.createElement('a');
	//创建一个单击事件
	var event = new MouseEvent('click');
	//将a的download属性设置为我们想要下载的json名称
	a.download = picName + ".json";
	//将生成的URL设置为a.href属性
	a.href = urlObject.createObjectURL(export_blob);
	//触发a的单击事件
	a.dispatchEvent(event);
}

function switchBackground(){
	if($("#screenViewport div").eq(0).css("display") === "block") {
		return ;
	}
	if(withBackGround){
		hideBG();
		$(".switchBackGround").addClass("show").removeClass("hide");
		$(".switchBackGround").siblings("span").text("显示底图");
	}else{
		showBG();
		$(".switchBackGround").addClass("hide").removeClass("show");
		$(".switchBackGround").siblings("span").text("隐藏底图");
	}
}

function hideBG() {
	withBackGround = false;
	showAll();
}

//显示台区节点(包括底图)
function showBG() {
	withBackGround = true;
	showAll();
}

function showTable(jsonArr){
	var table = document.createElement("table");
	
	
	var tr = document.createElement("tr");
	var th1 = document.createElement("th");
	th1.innerText = "编号";
	var th2 = document.createElement("th");
	th2.innerText = "用户名";
	var th3 = document.createElement("th");
	th3.innerText = "用户编号";
	var th4 = document.createElement("th");
	th4.innerText = "标号";
	var th5 = document.createElement("th");
	th5.innerText = "地址";
	var th6 = document.createElement("th");
	th6.innerText = "资产编号";
	
	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	tr.appendChild(th4);
	tr.appendChild(th5);
	tr.appendChild(th6);
	
	table.appendChild(tr);
	var index = 1;
	$(jsonArr).each(function() {
		var nodeName = this.nodeName;
		switch(this.nodeType) {
			case "user":
				$(this.user).each(function() {
					tr = document.createElement("tr");
					th1 = document.createElement("th");
					th1.innerText = index++;
					th2 = document.createElement("th");
					th2.innerText = this.userName;
					th2.id = "userName" + String(index - 1);
					th2.ondblclick = function() {
						var userName = window.prompt("修改信息", this.innerText);
						if(userName != null) {
							var number = this.id.substring(8);
							var messageType = this.id.substring(0, 8);
							queryMessage(number, messageType, userName);
							this.innerText = userName;
						}
					}
					th3 = document.createElement("th");
					th3.innerText = this.id;
					th3.id = "id" + String(index - 1);
					th3.ondblclick = function() {
						var id = window.prompt("修改信息", this.innerText);
						if(id != null) {
							var number = this.id.substring(2);
							var messageType = this.id.substring(0, 2);
							queryMessage(number, messageType, id);
							this.innerText = id;
						}
					}
					th4 = document.createElement("th");
					th4.innerText = nodeName;
					th4.id = "nodeName" + String(index - 1);
					th4.ondblclick = function() {
						var nodename = window.prompt("修改信息", this.innerText);
						if(nodename != null) {
							var number = this.id.substring(8);
							var messageType = this.id.substring(0, 8);
							queryMessage(number, messageType, nodename);
							this.innerText = nodename;
						}
					}
					th5 = document.createElement("th");
					th5.innerText = this.userAddress;
					th5.id = "userAddress" + String(index - 1);
					th5.ondblclick = function() {
						var userAddress = window.prompt("修改信息", this.innerText);
						if(userAddress != null) {
							var number = this.id.substring(11);
							var messageType = this.id.substring(0, 11);
							queryMessage(number, messageType, userAddress);
							this.innerText = userAddress;
						}
					}
					th6 = document.createElement("th");
					th6.innerText = this.userAssetNumber;
					th6.id = "userAssetNumber" + String(index - 1);
					th6.ondblclick = function() {
						var userAssetNumber = window.prompt("修改信息", this.innerText);
						if(userAssetNumber != null) {
							var number = this.id.substring(15);
							var messageType = this.id.substring(0, 15);
							queryMessage(number, messageType, userAssetNumber);
							this.innerText = userAssetNumber;
						}
					}
					tr.appendChild(th1);
					tr.appendChild(th2);
					tr.appendChild(th3);
					tr.appendChild(th4);
					tr.appendChild(th5);
					tr.appendChild(th6);
					table.appendChild(tr);	
				});
			break;
		}
	});
	tableDiv.appendChild(table);
}

function queryMessage(number, messageType, message) {
	var num = 1;
	$(myInfo.powerNode).each(function() {
		if(this.nodeType == "user") {
			$(this.user).each(function() {
				if(number == num++) {
					switch(messageType) {
						case "userName":
							this.userName = message;
							break;
						case "id":
							this.id = message;
							break;
						case "nodeName":
							this.nodeName = message;
							break;
						case "userAddress":
							this.userAddress = message;
							break;
						case "userAssetNumber":
							this.userAssetNumber = message;
							break;
						default:
							break;
					}
				}
			})

		}
	})
}

//记录节点分布的面积
function saveMapArea() {
	minCoordinate[0] = myInfo.powerNode[0].cartesian[0];
	minCoordinate[1] = myInfo.powerNode[0].cartesian[1];
	$(myInfo.powerNode).each(function() {
		if(this.cartesian[0] < minCoordinate[0]) {
			minCoordinate[0] = this.cartesian[0];
		} else if(this.cartesian[0] > maxCoordinate[0]) {
			maxCoordinate[0] = this.cartesian[0];
		}
		if(this.cartesian[1] < minCoordinate[1]) {
			minCoordinate[1] = this.cartesian[1];
		} else if(this.cartesian[1] > maxCoordinate[1]) {
			maxCoordinate[1] = this.cartesian[1];
		}
	});
	console.log(minCoordinate, maxCoordinate);
}

//获取存储面积的数组(计算由fillText生成的面积)
function getAreaArr(x, y, text, maxWidth) {
	var result = [];

	var temp = getArea(text, maxWidth);

	result.push(x);
	result.push(y - temp[1]);
	result.push(x + temp[0]);
	result.push(y);

	return result;
}

function getArea(text, maxWidth) {
	var result = [];
	if(maxWidth === null) {
		result.push(String(text).length * 12);
		result.push(12);
	} else {
		if(String(text).length * 12 <= maxWidth) {
			result.push(String(text).length * 12);
			result.push(12);
		} else {
			result.push(maxWidth);
			result.push(parseInt(String(text).length / maxWidth) + 1);
		}
	}
	return result;
}

//根据线长，象形，横截面积获得线上的信息
function getWireInfo(wireLength, phase, csArea) {
	if(isNotEmpty(phase) && isNotEmpty(csArea)) {
		var phaseNum;
		if(phase.length === 1) {
			phaseNum = 2;
		} else if(phase.length === 2) {
			phaseNum = 3;
		} else {
			phaseNum = 4;
		}
		return "BVV-" + phaseNum + "*" + csArea + "mm2/" + gerundet(wireLength) + "m";
	} else {
		return gerundet(wireLength) + "m";
	}
}
//对线的长度四舍五入
function gerundet(wireLength) {
	var str = String(wireLength);
	var index = str.indexOf(".");
	if(index === -1) {
		return str;
	} else {
		if(str.substring(index, str.length).length <= 2) {
			return str;
		} else {
			return str.substring(0, 3);
		}
	}
}

//画出节点
function draw(jsonArr) {
	drawLines(jsonArr.powerNode);
	drawNodes(jsonArr.powerNode);
	drawLineInfos(jsonArr.powerNode);
	drawNodeInfos(jsonArr.powerNode);
	drawMapRemark(jsonArr.mapRemark);
	//drawNodeRemark(jsonArr.powerNode);
	//drawAddTextFields(addTextFields);
}

function drawLines(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.nodeType) {
			case "T":
				if(this.father_location !== "") {
					drawLine(this.cartesian[0], this.cartesian[1], this.father_location[0], this.father_location[1]);
				}
				break;
			case "transformer":
				break;
			case "user":
				if(this.father_location != "") {
					drawLine(this.cartesian[0], this.cartesian[1], this.father_location[0], this.father_location[1]);

				}
				break;
			case "virtual":
				if(this.father_location != "") {
					drawLine(this.cartesian[0], this.cartesian[1], this.father_location[0], this.father_location[1]);
				}
				break;
		}
	});
}

//画出线
function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.strokeStyle = wire_color;
	ctx.lineWidth = wire_size;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();

}

function drawLineInfos(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.nodeType) {
			case "T":
				if(!isEmpty(this.wire.wireLength)) {
					drawLineInfo(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], getWireInfo(this.wire.wireLength, this.phase, this.wire.csArea));
				}
				break;
			case "transformer":
				break;
			case "user":
				//画出线的信息
				/*if(!isEmpty(this.wireLength)) {
					drawLineInfo(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], getWireInfo(this.wireLength, this.phase, this.csArea));
				}*/
				break;
			case "virtual":
				//画出线的信息
				if(!isEmpty(this.wire.wireLength)) {
					drawLineInfo(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], getWireInfo(this.wire.wireLength, this.phase, this.wire.csArea));
				}
				break;
		}
	});
}

//画出节点信息
function drawNodeInfos(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.nodeType) {
			case "T":
				if(!isEmpty(this.nodeName)) {
					drawPointInfo(this.pointInfoCoordinate[0], this.pointInfoCoordinate[1], this.nodeName);
				}

				break;
			case "transformer":
				if(!isEmpty(REGION_NAME)) {
					drawPointInfo(this.pointInfoCoordinate[0], this.pointInfoCoordinate[1], REGION_NAME);
				}
				break;
			case "user":
				//画出节点名
				if(!isEmpty(this.nodeName)) {
					drawPointInfo(this.pointInfoCoordinate[0], this.pointInfoCoordinate[1], this.nodeName);
				}
				break;
			case "virtual":
				//画出节点名
				if(!isEmpty(this.nodeName)) {
					drawPointInfo(this.pointInfoCoordinate[0], this.pointInfoCoordinate[1], this.nodeName);
				}
				break;
		}
	});
}

//画节点
function drawNodes(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.nodeType) {
			case "T":
				drawTNode(this.cartesian[0], this.cartesian[1], this.nodeColor);
				break;
			case "transformer":
				drawTranformerNode(this.cartesian[0], this.cartesian[1], this.nodeColor);
				break;
			case "user":
				drawUserNode(this.cartesian[0], this.cartesian[1], this.nodeColor);
				drawUserNumber(this.cartesian[0], this.cartesian[1], this.user.length);
				break;
			case "virtual":
				drawTNode(this.cartesian[0], this.cartesian[1], this.nodeColor);
				break;
		}
	});
}

//画出T节点
function drawTNode(x, y, color) {
	ctx.fillStyle= color;
	ctx.fillRect(x - 30 / 2, y - 30.0 / 2, 30, 30);
}

//画出变压器
function drawTranformerNode(x, y, color) {
	//需要调整位置。
	ctx.fillStyle = color;
	ctx.fillRect(x - 30 / 2, y - 15.0 / 2, 30, 15);
}
//画出用户节点
function drawUserNode(x, y, color) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = userNode_size;
	ctx.arc(x, y, 15, 0, 2 * Math.PI);
	ctx.fill();
}
//在用户节点右侧画出用户的数量
function drawUserNumber(x, y, number) {
	ctx.fillStyle = "red";
	ctx.font = "12px Times New Roman";
	//fillText(text,x,y,[,maxWidth])该方法用于在指定的位置绘制文本，如果设置了maxWidth,则会调整字符串使之符合这个条件
	ctx.fillText(number, x - 10, y);
}
function drawMapRemark(remarks) {
	//开始画地图备注
	for(var i = 0; i < remarks.length; i++) {
		drawPointInfo(remarks[i].mapRemarkX, remarks[i].mapRemarkY, remarks[i].mapRemarkcontent);
	}
}

//向canvas添加一个文本框，显示在[50,50]的位置上
function addTextField(x, y) {
	//弹出一个弹框,输入一个文本框信息
	var text = window.prompt("请输入备注的内容", "");
	//存储节点
	var textField = {};
	textField.mapRemarkContent = text;
	textField.mapRemarkX = x;
	textField.mapRemarkY = y;	
	myInfo.mapRemark.push(textField);
	//重画
	draw(myInfo.powerNode);
}

//存储节点的面积
function saveAreaOfPoint(jsonArr) {
	$(jsonArr).each(function() {
		if(this.nodeType === "transformer") {
			this.pointArea = getAreaOfTransformer(this.cartesian[0], this.cartesian[1]);
		} else if(this.nodeType === "T" || this.nodeType === "virtual") {
			this.pointArea = getAreaOfTOrVirtual(this.cartesian[0], this.cartesian[1]);

		} else if(this.nodeType === "user") {
			this.pointArea = getAreaOfUser(this.cartesian[0], this.cartesian[1]);
		}

	});
}
//获取一个变压器节点的面积
function getAreaOfTransformer(x, y) {
	var pointArea = [x - 15, y - 7.5, x + 15, y + 7.5];
	return pointArea;
}
//获取一个T节点获取virtual节点的面积
function getAreaOfTOrVirtual(x, y) {
	var pointArea = [x - 7.5, y - 7.5, x + 7.5, y + 7.5];
	return pointArea;
}
//获取一个user节点的面积
function getAreaOfUser(x, y) {
	var pointArea = [x - 7.5, y - 7.5, x + 7.5, y + 7.5];
	return pointArea;
}


//对节点，信息进行拖拽
function drag(event) {
	var x_click = event.clientX - baseCanvas.getBoundingClientRect().left; //获取鼠标点击的x坐标
	var y_click = event.clientY - baseCanvas.getBoundingClientRect().top; //获取鼠标点击的y坐标
	x_click = x_click / zoomMultiple;
	y_click = y_click / zoomMultiple;
	var powerNode = myInfo.powerNode;
	for(var i = 0; i < powerNode.length; i++) {
		if(!isEmpty(powerNode[i].nameArea)) {
			if(x_click >= powerNode[i].nameArea[0] && x_click <= powerNode[i].nameArea[2] && y_click >= powerNode[i].nameArea[1] && y_click <= powerNode[i].nameArea[3]) {
				baseCanvas.onmousemove = function(e) {
					var x = e.clientX - baseCanvas.getBoundingClientRect().left;
					var y = e.clientY - baseCanvas.getBoundingClientRect().top;
					x = x / zoomMultiple;
					y = y / zoomMultiple;
					console.log("鼠标拖动的坐标:" + x + "," + y);

					//修改id的位置，和面积
					var PointInfoCoordinate = [];
					PointInfoCoordinate.push(x);
					PointInfoCoordinate.push(y);

					/*this.PointInfoCoordinate = PointInfoCoordinate;
					this.idArea = getAreaArr(x, y, this.id, null);*/
					powerNode[i].pointInfoCoordinate = PointInfoCoordinate;
					powerNode[i].nameArea = getAreaArr(x, y, powerNode[i].nodeName, null);

					//重画
					showAll();
				};
				//鼠标移开事件
				baseCanvas.onmouseup = function() {
					baseCanvas.onmousemove = null;
					baseCanvas.onmouseup = null;
				}

			}
		}

		//对线上的信息进行遍历

		if(!isEmpty(powerNode[i].wireLengthArea)) {
			if(x_click >= powerNode[i].wireLengthArea[0] && x_click <= powerNode[i].wireLengthArea[2] && y_click >= powerNode[i].wireLengthArea[1] && y_click <= powerNode[i].wireLengthArea[3]) {
				console.log("comein鼠标点击的坐标:" + x_click + "," + y_click);
				baseCanvas.onmousemove = function(e) {
					var x = e.clientX - baseCanvas.getBoundingClientRect().left;
					var y = e.clientY - baseCanvas.getBoundingClientRect().top;
					x = x / zoomMultiple;
					y = y / zoomMultiple;
					console.log("鼠标拖动的坐标:" + x + "," + y);

					//修改id的位置，和面积
					var wireLengthCoordinate = [];
					wireLengthCoordinate.push(x);
					wireLengthCoordinate.push(y);

					/*this.PointInfoCoordinate = PointInfoCoordinate;
					this.idArea = getAreaArr(x, y, this.id, null);*/
					powerNode[i].wireLengthCoordinate = wireLengthCoordinate;

					powerNode[i].wireLengthArea = getAreaArr(x, y, getWireInfo(powerNode[i].wire.wireLength, powerNode[i].phase, powerNode[i].wire.csArea), null);

					//重画
					showAll();

				};
				//鼠标移开事件
				baseCanvas.onmouseup = function() {
					baseCanvas.onmousemove = null;
					baseCanvas.onmouseup = null;
				}
				return;
			}
		}
		//移动画布
		baseCanvas.onmousemove = function(e) {
			var x = e.clientX - baseCanvas.getBoundingClientRect().left;
			var y = e.clientY - baseCanvas.getBoundingClientRect().top;
			x = x / zoomMultiple;
			y = y / zoomMultiple;
			console.log("鼠标拖动的坐标:" + x + "," + y);
			var scrollTop = $("#screenViewport").scrollTop();
			var scrollLeft = $("#screenViewport").scrollLeft();
			var distanceX = x - x_click;
			var distanceY = y - y_click;
			scrollTop = scrollTop - distanceY;
			scrollLeft = scrollLeft - distanceX;
			$("#screenViewport").scrollTop(scrollTop);
			$("#screenViewport").scrollLeft(scrollLeft);
		}
		baseCanvas.onmouseup = function() {
			baseCanvas.onmousemove = null;
			baseCanvas.onmouseup = null;
		}
		$("#baseCanvas").mouseleave( function() {
			return;
		})
	}
	

	
//	//对addTextFields进行遍历
//	for(var i = 0; i < addTextFields.length; i++) {
//		if(x_click >= addTextFields[i].area[0] && x_click <= addTextFields[i].area[2] && y_click >= addTextFields[i].area[1] && y_click <= addTextFields[i].area[3]) {
//			console.log("鼠标点击的坐标:" + x_click + "," + y_click);
//			canvas.onmousemove = function(e) {
//				var x = e.clientX - canvas.getBoundingClientRect().left;
//				var y = e.clientY - canvas.getBoundingClientRect().top;
//				console.log("鼠标拖动的坐标:" + x + "," + y);
//
//				//修改id的位置，和面积
//				var location = [];
//				location.push(x);
//				location.push(y);
//
//				/*this.PointInfoCoordinate = PointInfoCoordinate;
//				this.idArea = getAreaArr(x, y, this.id, null);*/
//				addTextFields[i].location = location;
//				addTextFields[i].area = getAreaArr(x, y, addTextFields[i].text, null);
//
//				//重画
//				showAll();
//
//			}
//			//鼠标移开事件
//			canvas.onmouseup = function() {
//				canvas.onmousemove = null;
//				canvas.onmouseup = null;
//			}
//			return;
//		}
//	}

//	for(var i = 0; i < myInfo.length; i++) {
//		if(x_click >= myInfo[i].pointArea[0] && x_click <= myInfo[i].pointArea[2] && y_click >= myInfo[i].pointArea[1] && y_click <= myInfo[i].pointArea[3]) {
//			canvas.onmousemove = function(e) {
//				var x = e.clientX - canvas.getBoundingClientRect().left;
//				var y = e.clientY - canvas.getBoundingClientRect().top;
//				//先记录下本节点的坐标,再修改本节点的坐标,然后遍历去修改他子节点的父节点坐标,重画
//				var tempArr = myInfo[i].cartesian;
//				myInfo[i].cartesian = [x, y];
//				updateFatherNodesCoordinate(tempArr, myInfo[i].cartesian);
//				//修改节点的面积
//				updatePointArea(myInfo[i]);
//				//重画
//				showAll();
//			}
//
//			//鼠标移开事件
//			canvas.onmouseup = function() {
//				canvas.onmousemove = null;
//				canvas.onmouseup = null;
//			}
//			return;
//		}
//
//	}	
}

//改变节点颜色
function changeColor(jsonArr) {
	var userColor = $(".UserColor").css("backgroundColor");
	var TColor = $(".TColor").css("backgroundColor");
	var VColor = $(".VColor").css("backgroundColor");
	var TransformerColor = $(".TransformerColor").css("backgroundColor");
	var wireColor = $(".WireColor").css("backgroundColor");
	$(jsonArr).each(function() {
		if(this.nodeType === "transformer") {
			this.nodeColor = TransformerColor;
		} else if(this.nodeType === "T") {
			this.nodeColor = TColor;

		} else if(this.nodeType === "user") {
			this.nodeColor = userColor;
		} else if(this.nodeType === "virtual") {
			this.nodeColor = VColor;
		}
	});
	wire_color = wireColor;
	showAll();
}
//设置调色板的颜色
function setColor(jsonArr) {
	$(jsonArr).each(function() {
		if(this.nodeType === "transformer") {
			$(".TransformerColor").css("backgroundColor", this.nodeColor);
		} else if(this.nodeType === "T") {
			$(".TColor").css("backgroundColor", this.nodeColor);

		} else if(this.nodeType === "user") {
			$(".UserColor").css("backgroundColor", this.nodeColor);
		} else if(this.nodeType === "virtual") {
			$(".VColor").css("backgroundColor", this.nodeColor);
		}
	});
	$(".WireColor").css("backgroundColor", wire_color);
}