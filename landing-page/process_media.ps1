$url = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
$zipPath = "$env:TEMP\ffmpeg.zip"
$extractPath = "$env:TEMP\ffmpeg_extract"

Write-Host "Downloading ffmpeg..."
Invoke-WebRequest -Uri $url -OutFile $zipPath

Write-Host "Extracting ffmpeg..."
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

$ffmpegExe = (Get-ChildItem -Path $extractPath -Recurse -Filter "ffmpeg.exe" | Select-Object -First 1).FullName

Write-Host "ffmpeg extracted to: $ffmpegExe"

$sourceBase = "c:\Users\mario\Progetti Antigravity\sara-dangelo\WeTrasfer matrimoni nuovi"
$targetDir = "c:\Users\mario\Progetti Antigravity\sara-dangelo\public\media"

if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir }

$photosDir = Join-Path $sourceBase "Castello lancellotti\Castello lancellotti\TOPTEN"
Get-ChildItem -Path $photosDir -File | Where-Object { $_.Extension -match "\.jpe?g" } | ForEach-Object {
    $outName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name) + ".webp"
    $outPath = Join-Path -Path $targetDir -ChildPath $outName
    Write-Host "Converting $($_.Name) to WebP..."
    & $ffmpegExe -y -i $_.FullName -c:v libwebp -quality 80 $outPath
}

$sourceVideo = Join-Path $sourceBase "matrimoni 2025\Rino&raffaella - Villa Eliana\Rino&Raffaella_AQNB3ja3sdMJooPK7W92qaALwXx9opifCjMwzGy-w5vQ_eIriNcjY1YcuklwueOyNceIicc3k-8EbeVvZmqZfGcQcNoxtWbLBOBgPGU.mp4"
$outVideo = Join-Path $targetDir "hero-bg.mp4"
Write-Host "Compressing background video..."
& $ffmpegExe -y -i $sourceVideo -c:v libx264 -crf 28 -preset fast -an -movflags +faststart $outVideo

Write-Host "Done"
