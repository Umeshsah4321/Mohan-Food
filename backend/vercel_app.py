import os
from core.wsgi import application

# Vercel requires the WSGI application to be named 'app'
app = application
