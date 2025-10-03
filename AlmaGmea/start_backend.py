#!/usr/bin/env python3
import subprocess
import os
import sys

def start_flask_backend():
    """Start the Flask backend on port 8000"""
    os.chdir('backend')
    os.environ['FLASK_PORT'] = '8000'
    
    print("Starting Flask backend on port 8000...")
    process = subprocess.Popen([
        sys.executable, 'main.py'
    ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    
    # Print startup output
    for line in iter(process.stdout.readline, ''):
        print(f"[Flask] {line.strip()}")
        if "Running on http://127.0.0.1:8000" in line:
            print("[Flask] Backend ready!")
            break
    
    return process

if __name__ == "__main__":
    try:
        flask_process = start_flask_backend()
        # Keep the script running
        flask_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down Flask backend...")
        flask_process.terminate()
        sys.exit(0)