"""
Seed Script: Tech Buying Guides & Hardware Recommendations
──────────────────────────────────────────────────────────
Seeds tech categories, products, buying guides, settings, and author.
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from cleanup_and_seed_tech import cleanup_and_seed_tech

if __name__ == '__main__':
    cleanup_and_seed_tech()
