Remove-Item -Recurse -Force .\deploy -ErrorAction SilentlyContinue
Remove-Item .\rag-response.zip -ErrorAction SilentlyContinue

New-Item -ItemType Directory -Path .\deploy

Copy-Item ".\dist\*" ".\deploy\" -Recurse
Copy-Item ".\node_modules" ".\deploy\" -Recurse

Compress-Archive `
  -Path ".\deploy\*" `
  -DestinationPath ".\rag-response.zip" `
  -Force