
function checkEmpty(value, inputName){
	var result = value.trim() !== "";
	console.log(result + " in isEmpty")
	if(!result)
		displayAlert(inputName + " Required");
	return result;
}


function isNumber(value, inputName){

	var result = value.trim().match(/^\d+$/) !== null;
	console.log(result);
	if(!result)
		displayAlert(inputName + " should be a number");
	return result;
}

function inputLengthCheck(inp, min, max){

}
function displayAlert(msg){
	$(".error-message").html(msg)
}