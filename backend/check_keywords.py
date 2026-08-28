from app.config.settings import CRISIS_KEYWORDS_PATH
print(CRISIS_KEYWORDS_PATH)

import json
with open(CRISIS_KEYWORDS_PATH) as f:
    data = json.load(f)

print(json.dumps(data, indent=2))