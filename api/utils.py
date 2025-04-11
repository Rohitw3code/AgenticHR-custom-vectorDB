import subprocess
import sys
import io
# Ensure stdout supports UTF-8 (for emojis or symbols if needed)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


class MistralJobSummarizerCLI:
    def __init__(self, model="mistral"):
        self.model = model

    def summarize(self, job_description):
        prompt = f"""Summarize the following description in 3-5 concise bullet points, focusing on key responsibilities, required skills, and experience:
{job_description}

Summary:"""
        # Run the Ollama model using subprocess
        process = subprocess.run(
            ["ollama", "run", self.model],
            input=prompt.encode(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        if process.returncode != 0:
            raise RuntimeError(f"Ollama error: {process.stderr.decode()}")

        return process.stdout.decode().strip()
    

