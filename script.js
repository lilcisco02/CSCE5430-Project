async function testPyodide() {
    let pyodide = await loadPyodide();
    console.log("Pyodide loaded successfully!");
}
testPyodide();

async function runCode(code) {
    let outputElement = document.getElementById("output");
    try {
        let pyodide = await loadPyodide();
        
        // Capture Python output
        let result = pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
exec("""${code}""")
sys.stdout.getvalue()
        `);
        
        // Update the webpage with output
        outputElement.innerText = result.trim() || "No output generated!";
    } catch (error) {
        outputElement.innerText = "Error: " + error.message;
    }
}
