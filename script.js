let pyodideReadyPromise = loadPyodide();

async function runCode(textareaId, outputId = "output1") {
    const code = document.getElementById(textareaId).value;
    const outputElement = document.getElementById(outputId);
    outputElement.innerText = "Running...";

  try {
    const pyodide = await pyodideReadyPromise;

    await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

    await pyodide.runPythonAsync(code);
    const result = await pyodide.runPythonAsync("sys.stdout.getvalue()");
    outputElement.innerText = result.trim() || "No output generated!";
  } catch (error) {
    outputElement.innerText = "Error: " + error.message;
  }
}
