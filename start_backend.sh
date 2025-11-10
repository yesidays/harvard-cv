#!/bin/bash
cd /home/user/harvard-cv/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
