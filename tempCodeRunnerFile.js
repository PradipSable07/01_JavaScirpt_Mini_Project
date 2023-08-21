async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (error) {
    copyMsg.innerText = "Failed";
  }
  setTimeout(() => copyMsg.classList.remove("active"), 2000);
}
