"""
CloudBasket Auto Code Writer v2.1
Usage: python scripts/apply-code.py <codes-file.txt>
Creates all files from structured text blocks.
"""
import sys, os

BASE = r"F:\cloudbasket"

def apply_codes(input_file):
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    sections = content.split('