const defaultErrMsg =
	"Something went wrong.<br>Couldn't get a valid response from SERVER.<br>Please check your Internet Connection.";
function showError(errNode, html) {
	nodeToggleView(errNode, 1);
	errNode.innerHTML = html;
}
function hideAllErrors(errNode) {
	for (let i = 0; i < errNode.length; i++) {
		const node = errNode[i];
		nodeToggleView(node);
		node.innerHTML = "";
	}
}
//
// try {
//     const formData = new FormData(sign_Up_Form1);
//     const formBody = new URLSearchParams(formData).toString();
//     const promise = await fetch("http://localhost/emailAuth/initRegister", {
//         method: "POST",
//         body: formBody,
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });
//     const response = await promise.json();
//     console.log(response);
//     if (promise.status === 200 && promise.ok === true) {
//     } else if (response.error)
//         showError(showErr_SignUp2, response.error.message);
//     else showError(showErr_SignUp2, defaultErrMsg);
// } catch (error) {
//     showError(showErr_SignUp2, defaultErrMsg);
// }
