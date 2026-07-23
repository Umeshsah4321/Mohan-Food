import os
import sys

# Ensure the backend directory is in the Python path
sys.path.append(os.path.dirname(__file__))

from core.wsgi import application

# Vercel requires the WSGI application to be named 'app'
app = application
