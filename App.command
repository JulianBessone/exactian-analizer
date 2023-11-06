#!/bin/bash
# Define el directorio en el que deseas trabajar
directorio="dev/exactian-analizer"

# Navega al directorio deseado
cd "$directorio" 

echo "Instalando dependencias con npm install..."
npm install

echo "Esperando a que termine la instalación..."

# Espera 5 segundos para asegurarte de que npm install haya terminado
sleep 180

echo "Iniciando la aplicación con npm start..."
npm start
