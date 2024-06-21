document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", async function() {
        const qiskitCodeInput = document.getElementById("qiskitCodeInput").value.trim();
        const qiskitCode = document.getElementById("qiskitCode")
        qiskitCode.textContent = formatSingleLineCodeToString(qiskitCodeInput)
        if (qiskitCodeInput === "") {
            alert("Please enter Qiskit code.");
            return;
        }

        try {
            const response = await fetch("/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: qiskitCodeInput }),
            });

            if (!response.ok) {
                throw new Error("Execution failed.");
            }

            const result = await response.json();

            const circuitImage = document.getElementById("circuitImage");
            circuitImage.textContent = result.output;

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while executing the code.");
        }
    });
});

function formatSingleLineCodeToString(code) {
    let statements = code.trim().split(';');
    statements = statements.map(statement => statement.trim());
    let formattedCode = statements.join('\n');
    
    return formattedCode;
}