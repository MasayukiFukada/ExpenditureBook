@ECHO OFF

call gradlew build

xcopy /Y .\build\libs\*.jar .\release\