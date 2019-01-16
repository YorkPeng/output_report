//画出线上的信息(在两条线段的中间向右偏移两个像素)
function drawLineInfo(x, y, info) {
	ctx.fillStyle = "#09C7F7";
	ctx.font = "12px Times New Roman";
	ctx.fillText(info, x, y);
}

//画出节点上的信息(在每个节点的上方)
function drawPointInfo(x, y, info) {
	ctx.fillStyle = "#09C7F7";
	ctx.font = "12px Times New Roman";
	//fillText(text,x,y,[,maxWidth])该方法用于在指定的位置绘制文本，如果设置了maxWidth,则会调整字符串使之符合这个条件
	ctx.fillText(info, x, y);
}


//生成线缆的信息坐标
function putWireLengthInfoCoordinate(jsonObj) {
	if(isEmpty(jsonObj.wire.wireLength)) {
		return;
	}

	var wireLengthCoordinate = [];
	var x1 = jsonObj.cartesian[0];
	var y1 = jsonObj.cartesian[1];
	var x2 = jsonObj.father_location[0];
	var y2 = jsonObj.father_location[1];
	var x = x1 > x2 ? (x2 + (x1 - x2) / 2) : (x1 + (x2 - x1) / 2);
	var y = y1 > y2 ? (y2 + (y1 - y2) / 2) : (y1 + (y2 - y1) / 2);

	wireLengthCoordinate.push(x);
	wireLengthCoordinate.push(y);
	jsonObj.wireLengthCoordinate = wireLengthCoordinate;

}

//生成节点的面积，节点信息的面积，线长信息的面积 [x_old,y_old,x_new,y_new]
function saveArea(jsonArr) {
	$(jsonArr).each(function() {
		if(this.nodeType === "transformer") {
			if(!isEmpty(REGION_NAME)) {
				var nameArea = getAreaArr(this.pointInfoCoordinate[0], this.pointInfoCoordinate[1], REGION_NAME, null);
				this.nameArea = nameArea;
			}
		} else if(this.nodeType === "user" || this.nodeType === "T" || this.nodeType === "virtual") {
			if(!isEmpty(this.nodeName)) {
				var nameArea = getAreaArr(this.pointInfoCoordinate[0], this.pointInfoCoordinate[1], this.nodeName, null);
				this.nameArea = nameArea;
			}
			if(!isEmpty(this.wire.wireLength)) {
				if(isNotEmpty(this.phase) && isNotEmpty(this.wire.csArea)) {

					var text = getWireInfo(this.wire.wireLength, this.phase, this.wire.csArea);
					var wireLengthArea = getAreaArr(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], text, null);
					this.wireLengthArea = wireLengthArea;

				} else {
					var wireLengthArea = getAreaArr(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], this.wireLength, null);
					this.wireLengthArea = wireLengthArea;
				}

			}

		}

	});
}