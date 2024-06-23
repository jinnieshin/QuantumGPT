from flask import Flask, render_template, request, jsonify
import sys
from io import StringIO
from app import app
import re
from openai import OpenAI
from env import OPENAI_API_KEY

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/execute', methods=['POST'])
def execute_code():
    prompt = request.json.get('prompt', '')
    code = generate_qiskit_code(prompt)
    stdout_backup = sys.stdout
    sys.stdout = result = StringIO()

    try:
        exec(code)
    except Exception as e:
        result.write(f"Error: {str(e)}")
    
    # Restore stdout
    sys.stdout = stdout_backup

    output = result.getvalue()

    return jsonify({'code': code, 'output': output})


def generate_qiskit_code(prompt):
    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
            "role": "system",
            "content": "You are an expert in quantum computing and Qiskit."
            },
            {
            "role": "user",
            "content": prompt
            }
        ],
        temperature=0.5,
        max_tokens=1000,
        top_p=1
    )
    
    message_content = response.choices[0].message.content.strip()
    
    match = re.search(r"```python(.*?)```", message_content, re.DOTALL)
    qiskit_code = match.group(1).strip() if match else "No code found"
    
    return qiskit_code