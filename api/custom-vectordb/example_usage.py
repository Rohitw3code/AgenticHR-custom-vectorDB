from sentence_transformers import SentenceTransformer
from vector_db import VectorDB

model = SentenceTransformer("resume_job_model/")
db = VectorDB(db_path="resume_vectors.db", dim=384)

# Add a new entry
text = "Experienced ML engineer with Python, AWS"
embedding = model.encode(text, normalize_embeddings=True)
db.add(embedding, {"id": "r001", "text": text, "type": "resume"})

# Update
updated_text = "ML engineer with Python, AWS, and FastAPI"
new_embedding = model.encode(updated_text, normalize_embeddings=True)
db.update("r001", new_embedding, {"id": "r001", "text": updated_text, "type": "resume"})

# Search
query = "Looking for Python backend engineer"
query_embedding = model.encode(query, normalize_embeddings=True)
results = db.search(query_embedding)

for score, meta in results:
    print(f"{meta['id']} | Score: {score:.2f} | Text: {meta['text']}")
