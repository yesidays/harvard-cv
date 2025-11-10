#!/bin/bash

case "$1" in
  start)
    echo "🚀 Iniciando backend..."
    cd /home/user/harvard-cv/backend
    source venv/bin/activate
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ;;
  
  background)
    echo "🚀 Iniciando backend en background..."
    cd /home/user/harvard-cv/backend
    source venv/bin/activate
    nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
    echo "✅ Backend iniciado en background"
    echo "📋 Ver logs: tail -f /home/user/harvard-cv/backend/backend.log"
    ;;
  
  stop)
    echo "🛑 Deteniendo backend..."
    pkill -f "uvicorn main:app"
    echo "✅ Backend detenido"
    ;;
  
  restart)
    echo "🔄 Reiniciando backend..."
    pkill -f "uvicorn main:app"
    sleep 2
    cd /home/user/harvard-cv/backend
    source venv/bin/activate
    nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
    echo "✅ Backend reiniciado"
    ;;
  
  status)
    if pgrep -f "uvicorn main:app" > /dev/null; then
      echo "✅ Backend está CORRIENDO"
      curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || echo "API respondiendo"
    else
      echo "❌ Backend NO está corriendo"
    fi
    ;;
  
  logs)
    tail -f /home/user/harvard-cv/backend/backend.log
    ;;
  
  *)
    echo "Harvard CV Generator - Backend Manager"
    echo ""
    echo "Uso: ./manage_backend.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start      - Iniciar backend (bloquea terminal)"
    echo "  background - Iniciar backend en background"
    echo "  stop       - Detener backend"
    echo "  restart    - Reiniciar backend"
    echo "  status     - Ver estado del backend"
    echo "  logs       - Ver logs en tiempo real"
    echo ""
    echo "URLs:"
    echo "  • API:  http://localhost:8000"
    echo "  • Docs: http://localhost:8000/docs"
    ;;
esac
