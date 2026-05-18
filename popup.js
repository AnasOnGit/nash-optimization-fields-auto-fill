document.getElementById('applyBtn').addEventListener('click', async () => {
  const capacity = document.getElementById('capValue').value;
  const toggleOn = document.getElementById('toggleState').checked;
  const statusEl = document.getElementById('status');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.includes("usenash.com")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillNashForm,
      args: [capacity, toggleOn]
    });
    
    // UI Feedback
    statusEl.innerText = "✓ Changes Applied";
    setTimeout(() => { statusEl.innerText = ""; }, 2000);
  } else {
    statusEl.style.color = "#ef4444";
    statusEl.innerText = "Error: Can't locate the optimization section";
  }
});

function fillNashForm(val, shouldBeOn) {
  const inputs = document.querySelectorAll('input[name*="vehicleCount"]');
  inputs.forEach(input => {
    input.value = val;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const switches = document.querySelectorAll('button[role="switch"]');
  switches.forEach(sw => {
    const currentState = sw.getAttribute('data-state') === 'checked';
    if (currentState !== shouldBeOn) {
      sw.click();
    }
  });
}
