@echo off
REM Define el directorio en el que deseas trabajar
set "directorio=dev\exactian-analizer"

REM Navega al directorio deseado
cd /d "%directorio%"
cls

echo.
echo.
echo.
echo.      ******                                                    
echo.      /*////**                                                   
echo.      /*   /**   *****   ******  ******  ******  *******   ***** 
echo.      /******   **///** **////  **////  **////**//**///** **//**
echo.      /*//// **/*******//***** //***** /**   /** /**  /**/*******
echo.      /*    /**/**////  /////** /////**/**   /** /**  /**/**//// 
echo.      /******* //****** ******  ****** //******  ***  /**//******
echo.      ///////   ////// //////  //////   //////  ///   //  ////// 
echo.
echo.                      Technologhy Innovations ©
echo.                          Make with 🧠 - 2023
echo.
echo.
echo.

REM Pregunta al usuario si desea instalar las dependencias
set /p "respuesta=¿Deseas instalar las dependencias? (S/N): "

if /i "%respuesta%"=="S" (
    echo ⏱ Instalando dependencias con npm install...
    npm install

    echo Esperando a que termine la instalación...

    REM Espera 120 segundos (2 minutos) para asegurarte de que npm install haya terminado
    timeout /t 120 >nul

    echo Iniciando la aplicación con npm start...
    npm start
) else (
    echo Iniciando la aplicación con npm start...
    npm start
)
