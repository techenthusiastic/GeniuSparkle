function nodeToggleViewTwo(nodeShow, nodeHide) {
	nodeShow = nodeShow.classList;
	nodeHide = nodeHide.classList;
	// Toggle View
	nodeShow.add("show");
	nodeShow.remove("hide");
	nodeHide.add("hide");
	nodeHide.remove("show");
}
function nodeToggleView(forNode, action) {
	// action -> 1 to show -> 0 - to hide
	forNode = forNode.classList;
	// Toggle View
	if (action) {
		forNode.add("show");
		forNode.remove("hide");
	} else {
		forNode.remove("show");
		forNode.add("hide");
	}
}
function nodeToggleClass(forNode, classToToggle) {
	forNode = forNode.classList;
	// Toggle Class
	for (let i = 0; i < classToToggle.length; i++) {
		const each = classToToggle[i];
		forNode.toggle(each);
	}
}
