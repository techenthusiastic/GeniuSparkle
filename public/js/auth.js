const container = document.getElementById("container");
const formContainer = document.getElementsByClassName("form-container");
const signUpContainer = formContainer[0];
const signInContainer = formContainer[4];
const overlayContainer = document.getElementsByClassName("overlay-container");
const overlayPanel = document.getElementsByClassName("overlay-panel");
const overlay = document.getElementsByClassName("overlay");
//
const gotoBtn = document.getElementsByClassName("goto");
//
addEventListener("load", () => {
	if (location.search.substr(1) === "signup") {
		// console.log("hai");
		if (window.innerWidth > 768) {
			overlayPanel[0].style.transition = "none";
			overlay[0].style.transition = "none";
			formContainer[0].style.transition = "none";
			overlayContainer[0].style.transition = "none";
			container.classList.add("right-panel-active");
		} else {
			signUpContainer.style.top = "50%";
			signUpContainer.style.transform = "translateY(-50%)";
			signInContainer.style.top = "100%";
		}
	}
	setTimeout(() => {
		container.style.display = "initial";
	}, 100);
});
//
let userAge = parseInt(localStorage.getItem("genius-age")) || 60;
// Check after repeat sign-up - when moved out to other window and then want to try again
function processAgeCheck() {
	if (userAge && userAge < 13) {
		formContainer[1].classList.remove("show");
		formContainer[3].classList.add("show");
		window.HubSpotConversations.widget.load();
	} else if (window.HubSpotConversations.widget.status().loaded)
		window.HubSpotConversations.widget.remove();
}
const signUpButton = document.getElementById("signUp");
signUpButton.addEventListener("click", () => {
	container.classList.add("right-panel-active");
	for (let i = 5; i <= 6; i++) formContainer[i].classList.remove("show");
	// CL - class list
	const email_Container_CL = formContainer[2].classList;
	email_Container_CL.remove("reset");
	email_Container_CL.remove("reset-password");
	processAgeCheck();
	showAgain();
});
gotoBtn[1].addEventListener("click", (e) => {
	e.preventDefault();
	signUpContainer.style.top = "50%";
	signUpContainer.style.transform = "translateY(-50%)";
	signInContainer.style.top = "100%";
	processAgeCheck();
});
const signInButton = document.getElementById("signIn");
signInButton.addEventListener("click", () => {
	for (let i = 1; i <= 3; i++) formContainer[i].classList.remove("show");
	container.classList.remove("right-panel-active");
	showAgain();
});
gotoBtn[0].addEventListener("click", (e) => {
	e.preventDefault();
	signInContainer.style.top = "-50%";
	signInContainer.style.transform = "translateY(50%)";
	signUpContainer.style.top = "-100%";
});
// reset password
const gotoResetPassword = document.getElementById("reset-password");
gotoResetPassword.addEventListener("click", () => {
	formContainer[5].classList.add("show");
	formContainer[2].classList.add("reset-password");
});
gotoBtn[2].addEventListener("click", (e) => {
	e.preventDefault();
	formContainer[5].classList.remove("show");
});
//
function showAgain() {
	formContainer[0].style.transition = "all 0.6s ease-in-out";
	overlay[0].style.transition = "transform  0.6s ease-in-out";
	overlayContainer[0].style.transition = "transform  0.6s ease-in-out";
	overlayPanel[0].style.transition = "transform  0.6s ease-in-out";
}
// For Both Sign In and SignUp
const sentToMail = document.getElementsByClassName("sentToMail")[0];
function validateEmail(email) {
	const len = email.length;
	if (email.trim() === "") return "Email must not be empty";
	if (len < 3) return "Email length must not be less than 3";
	if (len > 100) return "Email length must not be greater than 100";
	const regEx =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email.match(regEx)) return "Invalid Email";
	//
	return false;
	// false means all validation passed
}
function validatePassword(password) {
	if (password.trim() === "") return "Password must not be empty";
	else if (/\s/g.test(password)) return -2;
	else if (/\t/g.test(password)) return -3;
	else return false;
	// false means all validation passed
}
function removeErrorClass(arr) {
	for (let i = 0; i < arr.length; i++) arr[i].classList.remove("error");
}
// For Sign Up
const sign_Up_Form1 = formContainer[0].querySelector("form");
// sign_Up_Form1_IB - IB - input box
const sign_Up_Form1_IB = sign_Up_Form1.getElementsByClassName("input-boxes");
const formInputNode1 = sign_Up_Form1.getElementsByTagName("input");
const showErr_SignUp1 =
	sign_Up_Form1.getElementsByClassName("input-text-error");
//
sign_Up_Form1.onsubmit = (event) => {
	event.preventDefault();
	// Hide all errors shown - if in previous
	removeErrorClass(sign_Up_Form1_IB);
	const status = validateRegisterInput();
	if (status.isValid) {
		// formContainer[0].classList.remove("show");
		formContainer[1].classList.add("show");
	} else {
		const errors = status.errors;
		// name
		const classList1 = sign_Up_Form1_IB[0].classList;
		errors.name ? classList1.add("error") : classList1.remove("error");
		showErr_SignUp1[0].innerHTML = errors.name || "";
		// email
		const classList2 = sign_Up_Form1_IB[1].classList;
		errors.email ? classList2.add("error") : classList2.remove("error");
		showErr_SignUp1[1].innerHTML = errors.email || "";
		// password
		const classList3 = sign_Up_Form1_IB[2].classList;
		errors.password ? classList3.add("error") : classList3.remove("error");
		showErr_SignUp1[2].innerHTML = errors.password || "";
	}
};
//
function validateRegisterInput() {
	const name = formInputNode1[0].value,
		email = formInputNode1[1].value,
		password = formInputNode1[2].value;
	const errors = {};
	// name
	if (name.trim() === "") errors.name = "Name must not be empty";
	// email
	const mailErr = validateEmail(email);
	if (mailErr) errors.email = mailErr;
	// password
	const pswdErr = validatePassword(password);
	if (pswdErr)
		errors.password =
			pswdErr == -2
				? "No whitespace allowed"
				: pswdErr == -3
				? "No TAB spaces allowed"
				: pswdErr;
	return {
		errors,
		isValid: Object.keys(errors).length < 1,
	};
}
// Sign Up Step - 2
const sign_Up_Form2 = formContainer[1].querySelector("form");
// sign_Up_Form2_IB - IB - input box
const sign_Up_Form2_IB = sign_Up_Form1.getElementsByClassName("input-boxes");
//
const formInputNode2 = sign_Up_Form2.getElementsByTagName("input");
const formSelectNode2 = sign_Up_Form2.getElementsByTagName("select");
const dropdownContainer2 =
	sign_Up_Form2.getElementsByClassName("dropdown-container");
const showErr_SignUp2 =
	sign_Up_Form2.getElementsByClassName("input-text-error")[0];
//
function getAge(date) {
	const today = new Date();
	const birthDate = new Date(date);
	let age = today.getFullYear() - birthDate.getFullYear();
	const month = today.getMonth() - birthDate.getMonth();
	if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate()))
		age--;
	return age;
}
//
sign_Up_Form2.onsubmit = (event) => {
	event.preventDefault();
	removeErrorClass(sign_Up_Form2_IB);
	const gender = formSelectNode2[0].value;
	const birthDayInput = parseInt(formInputNode2[0].value.trim());
	const birthMonthInput = parseInt(formSelectNode2[1].value.trim());
	const birthYearInput = parseInt(formInputNode2[1].value.trim());
	let error = false;
	if (isNaN(birthDayInput) || birthDayInput < 1 || birthDayInput > 31) {
		error = true;
		formInputNode2[0].classList.add("error");
	}
	if (isNaN(birthYearInput) || birthYearInput < 1970 || birthYearInput > 2022) {
		error = true;
		formInputNode2[1].classList.add("error");
	}
	if (!gender) {
		error = true;
		dropdownContainer2[0].classList.add("error");
	}
	if (!birthMonthInput || birthMonthInput < 1 || birthMonthInput > 12) {
		error = true;
		dropdownContainer2[1].classList.add("error");
	}
	if (error) return false;
	//
	const dobStr = `${birthYearInput}-${birthMonthInput}-${birthDayInput}`;
	userAge = getAge(dobStr);
	localStorage.setItem("genius-age", userAge);
	if (userAge > 0) {
		// Hide All Errors Shown
		for (let i = 0; i < dropdownContainer2.length; i++)
			dropdownContainer2[i].classList.remove("error");
		for (let i = 0; i < formInputNode2.length; i++)
			formInputNode2[i].classList.remove("error");
		//
		showErr_SignUp2.innerHTML = "";
		if (userAge && userAge < 13) {
			setTimeout(() => {
				formContainer[1].classList.remove("show");
			}, 500);
			formContainer[3].classList.add("show");
			window.HubSpotConversations.widget.load();
			processSignUp(dobStr, true);
		} else processSignUp(dobStr, false);
	} else return (showErr_SignUp2.innerHTML = "Invalid Date of Birth.");
	// All Verification Complete - so initiate data send to server
};
const spinnerSVG = document.querySelectorAll(".btn-with-spinner .spinner");
async function processSignUp(dobStr, isMinor) {
	hideAllErrors([showErr_SignUp2]);
	nodeToggleView(spinnerSVG[0], 1);
	try {
		const formData = new FormData(sign_Up_Form1);
		const formData2 = new FormData(sign_Up_Form2);
		for (const pair of formData2.entries()) formData.append(pair[0], pair[1]);
		formData.append("dob", dobStr);
		formData.append("isMinor", isMinor);
		const formBody = new URLSearchParams(formData).toString();
		const promise = await fetch("/emailAuth/initRegister", {
			method: "POST",
			body: formBody,
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		const response = await promise.json();
		if (promise.status === 200 && promise.ok === true) {
			sign_Up_Form1.reset();
			sign_Up_Form2.reset();
			if (isMinor === false) {
				setTimeout(() => {
					formContainer[1].classList.remove("show");
				}, 500);
				formContainer[2].classList.add("show");
				sentToMail.innerText = response.sentTo;
			}
		} else if (response.error)
			showError(showErr_SignUp2, response.error.message);
		else showError(showErr_SignUp2, defaultErrMsg);
	} catch (error) {
		console.log(error);
		showError(showErr_SignUp2, defaultErrMsg);
	} finally {
		nodeToggleView(spinnerSVG[0]);
	}
}
// Attach Option HTML - Month
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
let birthYearValue = 1;
for (let i = 0; i < months.length; i++) {
	const option = document.createElement("option");
	option.innerHTML = months[i];
	option.value = birthYearValue++;
	formSelectNode2[1].appendChild(option);
}
// Login API
const sign_In_Form = formContainer[4].querySelector("form");
// sign_Up_Form1_IB - IB - input box
const sign_In_Form_IB = sign_In_Form.getElementsByClassName("input-boxes");
const formInputNode3 = sign_In_Form.getElementsByTagName("input");
const showErr_SignIn = sign_In_Form.getElementsByClassName("input-text-error");
//
sign_In_Form.onsubmit = async (event) => {
	event.preventDefault();
	hideAllErrors(showErr_SignIn);
	removeErrorClass(sign_In_Form_IB);
	const status = validateLoginInput();
	if (status.isValid) {
		nodeToggleView(spinnerSVG[1], 1);
		//
		try {
			const formData = new FormData(sign_In_Form);
			const formBody = new URLSearchParams(formData).toString();
			const promise = await fetch("/emailAuth/login", {
				method: "POST",
				body: formBody,
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});
			const response = await promise.json();
			if (promise.status === 200 && promise.ok === true) {
				if (response.status === "success") {
					window.localStorage.setItem("token", JSON.stringify(response.token));
					// window.location.assign("/");
					showError(showErr_SignIn[2], "Login was Success");
				} else showError(showErr_SignIn[2], defaultErrMsg);
			} else if (response.error)
				showError(showErr_SignIn[2], response.error.message);
			else showError(showErr_SignIn[2], defaultErrMsg);
		} catch (error) {
			showError(showErr_SignIn[2], defaultErrMsg);
		} finally {
			nodeToggleView(spinnerSVG[1]);
		}
	} else {
		const errors = status.errors;
		const classList1 = sign_In_Form_IB[0].classList;
		errors.email ? classList1.add("error") : classList1.remove("error");
		showErr_SignIn[0].innerHTML = errors.email || "";
		//
		const classList2 = sign_In_Form_IB[1].classList;
		errors.password ? classList2.add("error") : classList2.remove("error");
		showErr_SignIn[1].innerHTML = errors.password || "";
	}
};
function validateLoginInput() {
	const email = formInputNode3[0].value,
		password = formInputNode3[1].value;
	const errors = {};
	// email
	const mailErr = validateEmail(email);
	mailErr ? (errors.email = mailErr) : "";
	// password
	const pswdErr = validatePassword(password);
	if (pswdErr) errors.password = pswdErr < -1 ? "Invalid Password" : pswdErr;
	return {
		errors,
		isValid: Object.keys(errors).length < 1,
	};
}
// Forget Password
const forgetPswd_Form = formContainer[5].querySelector("form");
// sign_Up_Form1_IB - IB - input box
const forgetPswd_IB = forgetPswd_Form.getElementsByClassName("input-boxes");
const formInputNode4 = forgetPswd_Form.getElementsByTagName("input");
const showErr_forgetPswd =
	forgetPswd_Form.getElementsByClassName("input-text-error");
//
forgetPswd_Form.onsubmit = async (event) => {
	event.preventDefault();
	hideAllErrors(showErr_forgetPswd);
	removeErrorClass(forgetPswd_IB);
	// Validate
	const status = validateForgetPswd();
	if (status.isValid) {
		nodeToggleView(spinnerSVG[2], 1);
		//
		try {
			const formData = new FormData(forgetPswd_Form);
			const formBody = new URLSearchParams(formData).toString();
			const promise = await fetch("/emailAuth/forgotPswd", {
				method: "POST",
				body: formBody,
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});
			const response = await promise.json();
			if (promise.status === 200 && promise.ok === true) {
				if (response.status === "success") {
					// Show Verification Mail Sent - email-sent-container
					sentToMail.innerText = response.sentTo;
					formContainer[2].classList.add("reset");
					// formContainer[5].classList.remove("show");
				} else showError(showErr_forgetPswd[1], defaultErrMsg);
			} else if (response.error)
				showError(showErr_forgetPswd[1], response.error.message);
			else showError(showErr_forgetPswd[1], defaultErrMsg);
		} catch (error) {
			showError(showErr_forgetPswd[1], defaultErrMsg);
		} finally {
			nodeToggleView(spinnerSVG[1]);
		}
	} else {
		const errors = status.errors;
		const classList = forgetPswd_IB[0].classList;
		errors.email ? classList.add("error") : classList.remove("error");
		showErr_forgetPswd[0].innerHTML = errors.email || "";
	}
};
function validateForgetPswd() {
	const email = formInputNode4[0].value;
	const errors = {};
	// email
	const mailErr = validateEmail(email);
	mailErr ? (errors.email = mailErr) : "";
	return {
		errors,
		isValid: Object.keys(errors).length < 1,
	};
}
// Reset Password
const resetPswd_Form = formContainer[6].querySelector("form");
// sign_Up_Form1_IB - IB - input box
const resetPswd_IB = resetPswd_Form.getElementsByClassName("input-boxes");
const formInputNode5 = resetPswd_Form.getElementsByTagName("input");
const showErr_resetPswd =
	resetPswd_Form.getElementsByClassName("input-text-error");
//
resetPswd_Form.onsubmit = async (event) => {
	event.preventDefault();
	hideAllErrors(showErr_resetPswd);
	removeErrorClass(resetPswd_IB);
	// Check for localStorageData
	const dataForReset = JSON.parse(localStorage.getItem("dataForReset"));
	if (dataForReset === null || !(dataForReset.email && dataForReset.mailUID))
		return showError(
			showErr_resetPswd[1],
			"Unauthenticated Reset was Detected."
		);
	// Validate
	const status = validateResetPswd();
	if (status.isValid) {
		nodeToggleView(spinnerSVG[3], 1);
		//
		try {
			const formData = new FormData(resetPswd_Form);
			formData.append("email", dataForReset.email);
			formData.append("mailUID", dataForReset.mailUID);
			const formBody = new URLSearchParams(formData).toString();
			const promise = await fetch("/emailAuth/resetPswd", {
				method: "POST",
				body: formBody,
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});
			const response = await promise.json();
			if (promise.status === 200 && promise.ok === true) {
				if (response.status === "success") {
					window.localStorage.setItem("token", JSON.stringify(response.token));
					// window.location.assign("/");
					showError(showErr_resetPswd[1], "Reset was Success");
				} else showError(showErr_resetPswd[1], defaultErrMsg);
			} else if (response.error)
				showError(showErr_resetPswd[1], response.error.message);
			else showError(showErr_resetPswd[1], defaultErrMsg);
		} catch (error) {
			showError(showErr_resetPswd[1], defaultErrMsg);
		} finally {
			nodeToggleView(spinnerSVG[3]);
		}
	} else {
		const errors = status.errors;
		const classList = resetPswd_IB[0].classList;
		errors.password ? classList.add("error") : classList.remove("error");
		showErr_resetPswd[0].innerHTML = errors.password || "";
	}
};
function validateResetPswd() {
	const password = formInputNode5[0].value;
	const errors = {};
	// password
	const pswdErr = validatePassword(password);
	if (pswdErr)
		errors.password =
			pswdErr == -2
				? "No whitespace allowed"
				: pswdErr == -3
				? "No TAB spaces allowed"
				: pswdErr;
	//
	return {
		errors,
		isValid: Object.keys(errors).length < 1,
	};
}
//
// formContainer[0].classList.remove("show");
const urlSearch = window.location.search;
if (urlSearch.indexOf("?resetPswd=true") !== -1)
	formContainer[6].classList.add("show");
//
function deleteAllCookies() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}
deleteAllCookies();
setTimeout(() => {
	deleteAllCookies();
}, 2000);
//
function onConversationsAPIReady() {
	processAgeCheck();
}
window.hsConversationsSettings = {
	loadImmediately: false,
};
if (window.HubSpotConversations) onConversationsAPIReady();
else window.hsConversationsOnReady = [onConversationsAPIReady];
