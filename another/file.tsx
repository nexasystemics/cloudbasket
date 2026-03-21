<full file content>
"""

import sys
import os

BASE = r"F:\cloudbasket"

def apply_codes(input_file):
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    sections = content.split('