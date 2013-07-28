
@ECHO OFF
SETLOCAL
::
:: ------------------------------------------------------------
::
:: debug node.js scripts in windows using node-inspector
::
:: REQUIREMENTS: Chrome browser, nodejs and node-inspector
::
:: MANUAL: either drag and drop js file to debug on this cmd
::         or main.js or index.js will be started
::         your local chrome will be opened with node-inspector
::         debug sessions, and break point on the first line of your code
::
::
:: (c) 2013 by DBJ(); License: MIT
::
:: NOTE: cmd files can be *much* more complex than this
::       In here there is almost no error checking etc.
::       starting node and node-inspector running will 
::       each time open MINIMIZED cmd windows which have 
::       to be closed manually.
::
:: ------------------------------------------------------------
:: first set the file to use to start the debugging
:: if file was dropped onto this cmd, use it
if not [] == [%1] (
     set start_file=%1
     goto :main
) 
if exist main.js  (
    SET start_file=main.js
     goto :main
) 
if exist index.js (
    SET start_file=index.js
     goto :main
) else (
      goto :err_no_file
)

:main
IF NOT EXIST %start_file% (
      goto :err_no_file
) ELSE (
     echo.
	 echo Using %start_file%
	 echo.
	 echo Console output is going to the main node.exe cmd window
	 echo After this session please close cmd windows opened, manually
	 echo.
	 pause
)

:: setup node env
call "%ProgramFiles%\nodejs\nodevars.bat" > nul

:: start node-inspector MINIMIZED in the background
start /min node-inspector &

:: start node main.js MINIMIZED in the debug+brk mode listening on the port 5858
start /min node --debug-brk=5858  %start_file% 

:: open the default browser with node-inspector UI
:: this will of course work only with chrome
start /min http://127.0.0.1:8080/debug?port=5858

goto :eof

:err_no_file
echo No meaningfull input file found to start debuging ?
echo It seems the file name given is: [%start_file%]
pause
goto :eof

:: -------------------------------------------------------------
:eof
ENDLOCAL