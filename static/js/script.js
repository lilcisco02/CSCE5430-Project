let pyodideReadyPromise = loadPyodide();

async function runCode(textareaId, outputId = "output1", expectedOutput = null) {
    const outputElement = document.getElementById(outputId);
    outputElement.innerText = "Running...";
  try {
    const pyodide = await pyodideReadyPromise;

    let code;

    const possibleTextarea = document.getElementById(textareaId);
        if (possibleTextarea && possibleTextarea.tagName === "TEXTAREA") {
            code = possibleTextarea.value;
        } else {
            code = textareaId;
        }

    await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
    `);

    await pyodide.runPythonAsync(code);
    const result = await pyodide.runPythonAsync("sys.stdout.getvalue()");
    const trimmed = result.trim()
    outputElement.innerText = result.trim() || "No output generated!";
  


    if (expectedOutput != null){
        const feedbackId = outputId + "-feedback";
        let feedbackElement = document.getElementById(feedbackId)

        if (!feedbackElement) {
          feedbackElement = document.createElement("div")
          feedbackElement.id = feedbackId;
          outputElement.parentNode.insertBefore(feedbackElement, outputElement.nextSibling)
        }

        if (trimmed === expectedOutput.trim()) {
          feedbackElement.innerText = "Correct"
          feedbackElement.style.color = "green"
        }else{
          feedbackElement.innerText = `Incorrect. Expected: ${expectedOutput}, but got: ${trimmed}`;
          feedbackElement.style.color = "red"
        }
    }
  } catch (error) {
    outputElement.innerText = "Error: " + error.message;
  }
}
