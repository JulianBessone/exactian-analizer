@echo off
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

REM Define el directorio en el que deseas trabajar
set "directorio=C:\dev\extracto-credicop"

set "descargas=C:\Users\JGBessone\Downloads"

REM Navega al directorio deseado
cd /d "%descargas%"

REM Buscar el archivo XLS más reciente en el directorio de origen
for /f "delims=" %%A in ('dir /b /o-d /a-d "%descargas%\*.xls*" 2^>nul') do (
    set "archivo=%%A"
    goto copiar_archivo
)
echo No se encontraron archivos XLS en %descargas%


:copiar_archivo
REM Copiar el archivo al directorio de destino
copy /Y "%descargas%\%archivo%" "%directorio%\excels\data.xls"
echo Archivo %archivo% copiado a %directorio_destino%


REM Navega al directorio deseado
cd /d "%directorio%"

REM Pregunta al usuario si desea instalar las dependencias
set /p "respuesta=¿Deseas instalar las dependencias? (S/N): "

if /i "%respuesta%"=="S" (
    echo ⏱ Instalando dependencias con npm install...
    npm install

    echo Esperando a que termine la instalación...

    REM Espera 120 segundos (2 minutos) para asegurarte de que npm install haya terminado
    timeout /t 120 >nul

    echo Iniciando la aplicación con npm start...
    node app.js
) else (
    echo Iniciando la aplicación con npm start...
    node app.js
)