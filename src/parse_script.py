import json, os

def load_script(path="scenes/generated_script.json"):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def extract_characters(script):
    chars = {}
    for scene in script:
        for c in scene.get("characters", []):
            name = c["name"].strip().lower().replace(" ", "_")
            if name not in chars:
                chars[name] = c["appearance"]
    return chars

def extract_environments(script):
    envs = {}
    for scene in script:
        env = scene.get("environment")
        if env:
            key = env.lower().replace(" ", "_")
            envs[key] = env
    return envs

def prepare_folders(characters, environments):
    os.makedirs("ref_images/characters", exist_ok=True)
    os.makedirs("ref_images/environments", exist_ok=True)

    for cname in characters:
        os.makedirs(f"ref_images/characters/{cname}", exist_ok=True)

    for ename in environments:
        os.makedirs(f"ref_images/environments/{ename}", exist_ok=True)

if __name__ == "__main__":
    script = load_script()

    characters = extract_characters(script)
    environments = extract_environments(script)

    print("\nCharacters found:")
    print(characters)

    print("\nEnvironments found:")
    print(environments)

    prepare_folders(characters, environments)
    print("\nReference image folders created successfully.")
