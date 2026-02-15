import uuid
import os 
import json

def create_json_file(text_data):
    folder = "../output"
    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, f"{uuid.uuid4()}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(text_data, f, ensure_ascii=False, indent=4)
