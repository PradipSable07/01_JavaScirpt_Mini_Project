const inputSlider = document.querySelector("#pass-lengthSlider");
const lengthDisplay = document.querySelector("[pass-lengthNumber]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generateBtn = document.querySelector(".generateBtn");
const indicator = document.querySelector("[pass-indicator]");
const symbolCheckBox = document.querySelector("#symbols");
const numberCheckBox = document.querySelector("#numbers");
const lowercaseCheckBox = document.querySelector("#lowercase");
const uppercaseCheckBox = document.querySelector("#uppercase");
const copyMsg = document.querySelector("[pass-copyMsg]");
const copyBtn = document.querySelector("#pass-copy");
const passwordDisplay = document.querySelector("[pass-passwordDisplay]");
const symbols = "~!@#$%^&*?_+=-><";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#fff");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  inputSlider.addEventListener("input", updatePasswordLength);
}
function updatePasswordLength() {
  passwordLength = inputSlider.value;
  lengthDisplay.innerText = passwordLength;
  calcStrength();
  setIndicator("#fff");
  setInputSliderBackgroundSize();
}
function setInputSliderBackgroundSize() {
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 10) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 10px 2px ${color}`; // for blur or shadow
}

function genateRandomInteger(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateUpperCase() {
  return String.fromCharCode(genateRandomInteger(91, 65)); //ASCII value
}

function generateLowerCase() {
  return String.fromCharCode(genateRandomInteger(123, 97));
}

function generateRadomNumber() {
  return genateRandomInteger(9, 0);
}

function generateRandomSymbol() {
  const randomNum = genateRandomInteger(symbols.length, 0);
  return symbols.charAt(randomNum);
}

function calcStrength() {
  let hasuppercase = false;
  let haslowercase = false;
  let hasnumber = false;
  let hassymbol = false;

  if (uppercaseCheckBox.checked) hasuppercase = true;
  if (lowercaseCheckBox.checked) haslowercase = true;
  if (numberCheckBox.checked) hasnumber = true;
  if (symbolCheckBox.checked) hassymbol = true;

  // set strength circle color to grey
  if (
    hasuppercase &&
    haslowercase &&
    (hasnumber || hassymbol) &&
    passwordLength >= 15
  ) {
    setIndicator("#43ff");
  } else if (
    hasuppercase &&
    haslowercase &&
    (hasnumber || hassymbol) &&
    passwordLength >= 10
  ) {
    setIndicator("#0f0");
  } else if (
    (haslowercase || hasuppercase) &&
    (hasnumber || hassymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    const textToCopy = passwordDisplay.value;
    await navigator.clipboard.writeText(textToCopy);
    copyMsg.classList.add("active");
    copyMsg.innerText = "Copied";
  } catch (error) {
    copyMsg.innerText = "Failed";
  }
  setTimeout(() => copyMsg.classList.remove("active"), 2000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
  // console.log("copy done");
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
}
allCheckBox.forEach((checkBox) => {
  checkBox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return alert("Please select at least one checkbox"); //alert("Please select at least one checkbox")
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  let functionArray = [];

  if (uppercaseCheckBox.checked) functionArray.push(generateUpperCase);

  if (lowercaseCheckBox.checked) functionArray.push(generateLowerCase);

  if (numberCheckBox.checked) functionArray.push(generateRadomNumber);

  if (symbolCheckBox.checked) functionArray.push(generateRandomSymbol);

  for (let i = 0; i < functionArray.length; i++) {
    password += functionArray[i]();
  }

  for (let i = 0; i < passwordLength - functionArray.length; i++) {
    let randomIndex = genateRandomInteger(functionArray.length, 0);

    password += functionArray[randomIndex]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});
