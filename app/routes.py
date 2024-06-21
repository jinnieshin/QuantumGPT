from flask import Flask, render_template, request, jsonify
import sys
from io import StringIO
from app import app

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.json.get('code', '')
    stdout_backup = sys.stdout
    sys.stdout = result = StringIO()

    try:
        exec(code)
    except Exception as e:
        result.write(f"Error: {str(e)}")
    
    # Restore stdout
    sys.stdout = stdout_backup

    output = result.getvalue()

    return jsonify({'output': output})