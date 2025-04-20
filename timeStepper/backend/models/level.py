import random
import string
import os

class Level:
    def __init__(self, level_id: int, level_dir: str = "../levels"):
        self.level_id = level_id
        self.passphrase = self._generate_passphrase()
        self.hint_index = 0
        self.level_path = os.path.join(level_dir, str(level_id))
        self.hints = self.load_hints()

    def _generate_passphrase(self, length: int = 6) -> str:
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

    def verify_solution(self, user_input: str) -> bool:
        return user_input == self.passphrase

    def get_hint(self) -> str:
        if self.hint_index < len(self.hints):
            hint = self.hints[self.hint_index]
            self.hint_index += 1
            return hint
        return "No more hints available."

    def load_hints(self):
        hints_path = os.path.join(self.level_path, "hints.txt")
        if os.path.exists(hints_path):
            with open(hints_path, "r") as f:
                return [line.strip() for line in f if line.strip()]
        return []

    def get_js_challenge(self) -> str:
        js_path = os.path.join(self.level_path, "challenge.js")
        if os.path.exists(js_path):
            with open(js_path, "r") as f:
                js_code = f.read()
                return js_code.replace("{passphrase}", self.passphrase)
        return ""
