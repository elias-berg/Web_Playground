import os
import subprocess

# Big ol' thanks to rebrickable.com for providing this API!
# Swagger: rebrickable.com/api/v3/swagger
# Endpoints of interest:
# - GET /api/v3/lego/colors/
# - GET /api/v3/lego/part_categories/
# - GET /api/v3/lego/parts/
# - GET /api/v3/lego/parts/{part_num}/colors/

key = os.getenv("REBRICKABLE_API_KEY")
print(key)

# TO DO!