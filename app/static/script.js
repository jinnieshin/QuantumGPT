document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", async function() {
        const promptInput = document.getElementById("promptInput").value.trim();
        const qiskitCode = document.getElementById("qiskitCode")
        
        if (promptInput === "") {
            alert("Please enter Qiskit code.");
            return;
        }

        try {
            const response = await fetch("/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: promptInput }),
            });

            if (!response.ok) {
                throw new Error("Execution failed.");
            }

            const result = await response.json();

            const circuitImage = document.getElementById("circuitImage");
            circuitImage.textContent = result.output;
            qiskitCode.textContent = result.code;

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while executing the code.");
        }
    });
});