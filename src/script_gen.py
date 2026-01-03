import os, json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# --- CONFIG ---
# Direct string assignment is safer for your current setup
GROQ_KEY = "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"
# Using a widely available stable model
MODEL = "llama-3.3-70b-versatile" 

# Initialize LLM client
llm = ChatGroq(model=MODEL, temperature=0.7, groq_api_key=GROQ_KEY)

# Improved Prompt: Forces the LoRA keyword 'CyberHero' into every scene
PROMPT = """
You are a cinematic game director. Generate a branching 3-scene story based on the user prompt.
Output ONLY a JSON array of objects.
Each object MUST have:
  "scene_id": (int),
  "description": (short summary),
  "visual_prompt": (Detailed SD prompt, MUST include the word 'CyberHero'),
  "camera": (angle),
  "action": (what happens)

User prompt: {user_prompt}
"""

def generate_script(user_prompt: str):
    formatted_prompt = PROMPT.format(user_prompt=user_prompt)
    resp = llm.invoke(formatted_prompt)
    text = resp.content
    
    # Clean the output in case the LLM adds markdown backticks
    try:
        start = text.find('[')
        end = text.rfind(']') + 1
        json_text = text[start:end]
        return json.loads(json_text)
    except Exception as e:
        print(f"❌ JSON Parsing failed. Raw output: {text}")
        raise e

def save_script(script):
    filename = "scenes/generated_script.json"
    os.makedirs("scenes", exist_ok=True)
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(script, f, indent=2, ensure_ascii=False)
    return filename

if __name__ == "__main__":
    user_input = input("Enter your game theme: ").strip() or "CyberHero escaping a high-security lab"
    print("🧠 Thinking...")
    try:
        script = generate_script(user_input)
        path = save_script(script)
        print(f"✅ Success! Script saved to: {path}")
    except Exception as e:
        print(f"💥 Failed: {e}")