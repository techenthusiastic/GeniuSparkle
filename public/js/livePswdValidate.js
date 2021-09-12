// Password Validation
// Validate For
const livePswdValidateFor = document.getElementsByClassName(
	"livePswdValidateFor"
);
const livePswdUL = document.getElementsByClassName("live-pswd-validate");
// Toggle Show Hide
for (let i = 0; i < livePswdValidateFor.length; i++) {
	const each = livePswdValidateFor[i];
	each.addEventListener("focus", () => {
		livePswdUL[i].classList.add("show");
		livePswdUL[i].classList.remove("hide");
	});
	each.addEventListener("keyup", (event) => validatePswdEntry(event, i));
}
//
const validPswdNode = document.getElementsByClassName("live-pswd-check-valid");
const inValidPswdNode = document.getElementsByClassName(
	"live-pswd-check-invalid"
);
// status - 0 for invalid 1 for valid -
function fascilateShowStatus(status, index, pageIndex) {
	let nodeShow, nodeHide;
	const calcIndex = pageIndex * 5 + index;
	if (status) {
		nodeShow = validPswdNode[calcIndex];
		nodeHide = inValidPswdNode[calcIndex];
	} else {
		nodeShow = inValidPswdNode[calcIndex];
		nodeHide = validPswdNode[calcIndex];
	}
	// Toggle Node View
	nodeToggleViewTwo(nodeShow, nodeHide);
}
function validatePswdEntry(event, pageIndex) {
	const pswd = event.target.value.trim();
	const len = pswd.length;
	//
	if (len >= 8 && len <= 16) fascilateShowStatus(1, 0, pageIndex);
	else fascilateShowStatus(0, 0, pageIndex);
	//
	if (/[A-Z]/g.test(pswd)) fascilateShowStatus(1, 1, pageIndex);
	else fascilateShowStatus(0, 1, pageIndex);
	//
	if (/[a-z]/g.test(pswd)) fascilateShowStatus(1, 2, pageIndex);
	else fascilateShowStatus(0, 2, pageIndex);
	//
	if (/\d/g.test(pswd)) fascilateShowStatus(1, 3, pageIndex);
	else fascilateShowStatus(0, 3, pageIndex);
	//
	if (/\W|_/g.test(pswd)) fascilateShowStatus(1, 4, pageIndex);
	else fascilateShowStatus(0, 4, pageIndex);
}
