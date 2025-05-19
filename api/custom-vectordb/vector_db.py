# vector_db_sqlite.py
import numpy as np
import sqlite3
import json
from typing import List, Dict, Tuple

class VectorDB:
    def __init__(self, db_path: str, dim: int):
        self.dim = dim
        self.conn = sqlite3.connect(db_path)
        self._create_table()

    def _create_table(self):
        self.conn.execute("""
        CREATE TABLE IF NOT EXISTS vectors (
            id TEXT PRIMARY KEY,
            text TEXT,
            type TEXT,
            embedding TEXT  -- store as JSON string
        )
        """)
        self.conn.commit()

    def add(self, embedding: np.ndarray, meta: Dict):
        emb_list = embedding.tolist()
        self.conn.execute(
            "INSERT OR REPLACE INTO vectors (id, text, type, embedding) VALUES (?, ?, ?, ?)",
            (meta["id"], meta["text"], meta["type"], json.dumps(emb_list))
        )
        self.conn.commit()

    def delete_by_id(self, meta_id: str):
        self.conn.execute("DELETE FROM vectors WHERE id = ?", (meta_id,))
        self.conn.commit()

    def update(self, meta_id: str, new_embedding: np.ndarray, new_meta: Dict):
        self.delete_by_id(meta_id)
        self.add(new_embedding, new_meta)

    def _fetch_all(self):
        cursor = self.conn.execute("SELECT id, text, type, embedding FROM vectors")
        rows = cursor.fetchall()
        vectors, metadata = [], []
        for row in rows:
            meta = {
                "id": row[0],
                "text": row[1],
                "type": row[2]
            }
            emb = np.array(json.loads(row[3]), dtype=np.float32)
            metadata.append(meta)
            vectors.append(emb)
        return vectors, metadata

    def search(self, query: np.ndarray, top_k: int = 5) -> List[Tuple[float, Dict]]:
        vectors, metadata = self._fetch_all()
        query = query / np.linalg.norm(query)
        results = []
        for emb, meta in zip(vectors, metadata):
            emb = emb / np.linalg.norm(emb)
            sim = float(np.dot(query, emb))
            results.append((sim, meta))
        results.sort(reverse=True, key=lambda x: x[0])
        return results[:top_k]
