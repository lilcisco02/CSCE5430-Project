let pyodideReady = null;

// Load Pyodide once and reuse it
async function loadPyodideOnce() {
  if (!pyodideReady) {
    pyodideReady = await loadPyodide();
    console.log("✅ Pyodide loaded successfully");
  }
  return pyodideReady;
}

// Run Python code from a textarea and show output
async function runCode(code, outputId) {
  const outputElement = document.getElementById(outputId);

  try {
    const pyodide = await loadPyodideOnce();

    // Wrap user code to capture output
    const wrappedCode = `
import sys
from io import StringIO

sys.stdout = StringIO()
sys.stderr = sys.stdout

try:
    exec("""${code}""")
except Exception as e:
    print("Python error:", e)

sys.stdout.getvalue()
    `;

    // Run and display result
    const result = pyodide.runPython(wrappedCode);
    outputElement.innerText = result.trim() || "✅ Code ran but no output.";
  } catch (err) {
    outputElement.innerText = "❌ JavaScript error: " + err.message;
    console.error(err);
  }
}