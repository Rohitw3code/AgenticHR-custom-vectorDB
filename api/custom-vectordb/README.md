# VectorDB Embedding from Scratch
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)](https://numpy.org/)
[![Sentence Transformers](https://img.shields.io/badge/Sentence_Transformers-FF6F61?style=for-the-badge&logo=sentence-transformers&logoColor=white)](https://www.sbert.net/)

## Overview
This project, *VectorDB Embedding from Scratch*, is designed to create a vector database for storing and retrieving embeddings from text data. The project utilizes a combination of natural language processing (NLP) techniques and database management to efficiently store and query vector representations of text.

## Key Features
* 📝 **Text Embedding**: Generate vector representations of text data using sentence transformers.
* 📈 **Vector Database**: Store and manage vector representations in a SQLite database.
* 📊 **Efficient Querying**: Enable fast and efficient querying of vector representations.

## Technology Stack
* Backend: Python
* Database: SQLite
* ML: Sentence Transformers
* Libs: NumPy

## Getting Started
To get started with this project, follow these steps:
1. Clone the repository: `git clone https://github.com/Rohitw3code/vectordb-embedding-from-scratch.git`
2. Install required libraries: `pip install -r requirements.txt`
3. Run the example usage script: `python example_usage.py`

## Usage
The project provides a simple example usage script (`example_usage.py`) that demonstrates how to create a vector database, add text embeddings, and query the database.

## Configuration
No specific configuration is required for this project. However, you can modify the `config.json` file in the `resume_job_model` directory to adjust the sentence transformer model and other settings.

## Contributing
Contributions to this project are welcome. Please submit a pull request with your changes and a brief description of the updates.

## License
This project is licensed under the MIT License.

## Project Structure
The project consists of the following main directories and files:
* `resume_job_model`: Contains model configuration and weights.
* `vector_db.py`: Defines the VectorDB class for managing vector representations.
* `example_usage.py`: Demonstrates how to use the VectorDB class.

## Credit to
Built with ❤️ by Rohitw3code.
