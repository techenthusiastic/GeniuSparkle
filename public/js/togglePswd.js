const togglePswdFor = document.getElementsByClassName("togglePswdFor");
const tooglePswdIcon = document.getElementsByClassName("toogle-pswd-icon");
// Logic to Follow for proper functioning
/* First Hide Password Icon - (initially shown) should appear then Show Password Icon - (initially hidden)  */
// To Show - as Text
function showPassword(iconIndex, toggleForI) {
	togglePswdFor[toggleForI].setAttribute("type", "text");
	// Toggle Node View - nodeToggleViewTwo(showNode,hideNode)
	nodeToggleViewTwo(tooglePswdIcon[iconIndex + 1], tooglePswdIcon[iconIndex]);
}
function hidePassword(iconIndex, toggleForI) {
	togglePswdFor[toggleForI].setAttribute("type", "password");
	// Toggle Node View - nodeToggleViewTwo(showNode,hideNode)
	nodeToggleViewTwo(tooglePswdIcon[iconIndex - 1], tooglePswdIcon[iconIndex]);
}
// Attact Proper Listners to each of the icons
for (let i = 0; i < tooglePswdIcon.length; i++) {
	const each = tooglePswdIcon[i];
	const toggleForI = Math.trunc(i / 2);
	if (i % 2 === 0)
		each.addEventListener("click", () => {
			showPassword(i, toggleForI);
		});
	else
		each.addEventListener("click", () => {
			hidePassword(i, toggleForI);
		});
}
