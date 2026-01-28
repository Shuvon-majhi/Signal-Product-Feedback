# Simple HTTP Server for Signal Product Feedback
Add-Type -AssemblyName System.Web
Add-Type -AssemblyName System.IO

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()

Write-Host "Server started on http://localhost:8000"
Write-Host "Press Ctrl+C to stop the server"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') {
            $localPath = '/index.html'
        }
        
        $filePath = Join-Path (Get-Location) $localPath.Substring(1)
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                $content = [IO.File]::ReadAllBytes($filePath)
                
                # Set content type based on file extension
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($extension) {
                    '.html' { $response.ContentType = 'text/html' }
                    '.css' { $response.ContentType = 'text/css' }
                    '.js' { $response.ContentType = 'application/javascript' }
                    '.json' { $response.ContentType = 'application/json' }
                    default { $response.ContentType = 'text/plain' }
                }
                
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
            } catch {
                $response.StatusCode = 500
                $errorContent = [System.Text.Encoding]::UTF8.GetBytes("Internal Server Error")
                $response.ContentLength64 = $errorContent.Length
                $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
            }
        } else {
            $response.StatusCode = 404
            $notFoundContent = [System.Text.Encoding]::UTF8.GetBytes("File Not Found")
            $response.ContentLength64 = $notFoundContent.Length
            $response.OutputStream.Write($notFoundContent, 0, $notFoundContent.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped"
}
