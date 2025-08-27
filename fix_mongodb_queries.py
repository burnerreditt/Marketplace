#!/usr/bin/env python3
"""
Script to fix MongoDB ObjectId serialization issues by adding {"_id": 0} projection
to all database queries in the backend server.
"""

import re

def fix_mongodb_queries():
    with open('/app/backend/server.py', 'r') as f:
        content = f.read()
    
    # Fix find_one queries that don't already have projection
    patterns = [
        # Pattern for find_one without projection
        (r'await db\.(\w+)\.find_one\(\{([^}]+)\}\)(?!\s*,\s*\{)', r'await db.\1.find_one({\2}, {"_id": 0})'),
        # Pattern for find queries without projection  
        (r'db\.(\w+)\.find\(\{([^}]+)\}\)(?!\.)', r'db.\1.find({\2}, {"_id": 0})'),
        (r'await db\.(\w+)\.find\(\{([^}]+)\}\)(?!\.)', r'await db.\1.find({\2}, {"_id": 0})'),
    ]
    
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)
    
    with open('/app/backend/server.py', 'w') as f:
        f.write(content)
    
    print("Fixed MongoDB queries to exclude _id field")

if __name__ == "__main__":
    fix_mongodb_queries()