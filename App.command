#!/bin/bash
# Define el directorio en el que deseas trabajar
directorio="dev/exactian-analizer"

# Navega al directorio deseado
cd "$directorio" 
clear

echo "
#
#
#
#      ******                                                    
#      /*////**                                                   
#      /*   /**   *****   ******  ******  ******  *******   ***** 
#      /******   **///** **////  **////  **////**//**///** **///**
#      /*//// **/*******//***** //***** /**   /** /**  /**/*******
#      /*    /**/**////  /////** /////**/**   /** /**  /**/**//// 
#      /******* //****** ******  ****** //******  ***  /**//******
#      ///////   ////// //////  //////   //////  ///   //  ////// 
#
#                      Technologhy Innovations ©
#        
#                          Make with 🧠 - 2023
#
#
#
"

# Pregunta al usuario si desea instalar las dependencias
read -p "¿Deseas instalar las dependencias? (S/N): " respuesta

if [ "$respuesta" = "S" ] || [ "$respuesta" = "s" ]; then
    echo "⏱ Instalando dependencias con npm install..."
    npm install

    echo "Esperando a que termine la instalación..."

    # Espera 5 segundos para asegurarte de que npm install haya terminado
    sleep 120

    echo "Iniciando la aplicación con npm start..."
    npm start
else
    echo "Iniciando la aplicación con npm start..."
    npm start
fi