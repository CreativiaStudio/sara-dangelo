# Media Selection and Processing Plan (Handoff Report)

## Observation
- The directory `c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi` contains several event subdirectories.
- A search for image files identified a curated folder at `Castello lancellotti/Castello lancellotti/TOPTEN` containing exactly 12 `.JPG`/`.jpg` files.
- A search for video files identified 5 `.mp4` files within `matrimoni 2025/Rino&raffaella - Villa Eliana/`. The largest of these is `Rino&Raffaella_AQNB3ja3sdMJooPK7W92qaALwXx9opifCjMwzGy-w5vQ_eIriNcjY1YcuklwueOyNceIicc3k-8EbeVvZmqZfGcQcNoxtWbLBOBgPGU.mp4` with a size of 826 KB.
- `SCOPE.md` specifies that the target directory is `c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media`. Images must be in WebP format and the video must be compressed for background use.

## Logic Chain
1. **Photo Selection**: The user requested 10-15 of the "best" photos. The explicit directory name "TOPTEN" signifies these photos have already been manually curated as the top choices by the owner. The count of 12 perfectly matches the 10-15 requested range.
2. **Video Selection**: A background video is required. Without visual context, file size is the best proxy for quality/duration. The 826 KB MP4 file is the largest available, making it the best candidate.
3. **Processing Strategy**: Both conversions can be efficiently handled using `ffmpeg` through a PowerShell script. WebP conversion will use `libwebp` with a quality of 80. The background video will use `libx264` with `-an` to strip audio (saving size and preventing auto-play issues) and `-movflags +faststart` to optimize for web delivery.

## Caveats
- Since I cannot visually inspect the files, the selection relies entirely on folder naming (`TOPTEN`) and file size heuristics.
- The largest video file is relatively small (826 KB). It is likely a short social media clip. No aggressive downscaling was applied to the script to avoid degrading an already small file.

## Conclusion

**Selected Photos (12):**
Source path: `c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi/Castello lancellotti/Castello lancellotti/TOPTEN`
1. `Sara D'angelo (101).JPG`
2. `Sara D'angelo (105).JPG`
3. `Sara D'angelo (107).JPG`
4. `Sara D'angelo (125).JPG`
5. `Sara D'angelo (130).jpg`
6. `Sara D'angelo (132).JPG`
7. `Sara D'angelo (165).JPG`
8. `Sara D'angelo (174).jpg`
9. `Sara D'angelo (78).jpg`
10. `Sara D'angelo (81).jpg`
11. `Sara D'angelo (91).JPG`
12. `Sara D'angelo (99).JPG`

**Selected Background Video (1):**
Source path: `c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi/matrimoni 2025/Rino&raffaella - Villa Eliana/Rino&Raffaella_AQNB3ja3sdMJooPK7W92qaALwXx9opifCjMwzGy-w5vQ_eIriNcjY1YcuklwueOyNceIicc3k-8EbeVvZmqZfGcQcNoxtWbLBOBgPGU.mp4`

## Verification Method (Processing Script)
The implementer agent can run the following PowerShell script to process the files and verify they appear correctly in the target directory:

```powershell
$sourceBase = "c:\Users\mario\Progetti Antigravity\sara-dangelo\WeTrasfer matrimoni nuovi"
$targetDir = "c:\Users\mario\Progetti Antigravity\sara-dangelo\public\media"

# Create target directory if it doesn't exist
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir }

# 1. Process Photos to WebP
$photosDir = Join-Path $sourceBase "Castello lancellotti\Castello lancellotti\TOPTEN"
Get-ChildItem -Path $photosDir -File | Where-Object { $_.Extension -match "\.jpe?g" } | ForEach-Object {
    $outName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name) + ".webp"
    $outPath = Join-Path -Path $targetDir -ChildPath $outName
    Write-Host "Converting $($_.Name) to WebP..."
    ffmpeg -y -i $_.FullName -c:v libwebp -quality 80 $outPath
}

# 2. Process Background Video
$sourceVideo = Join-Path $sourceBase "matrimoni 2025\Rino&raffaella - Villa Eliana\Rino&Raffaella_AQNB3ja3sdMJooPK7W92qaALwXx9opifCjMwzGy-w5vQ_eIriNcjY1YcuklwueOyNceIicc3k-8EbeVvZmqZfGcQcNoxtWbLBOBgPGU.mp4"
$outVideo = Join-Path $targetDir "hero-bg.mp4"
Write-Host "Compressing background video..."
ffmpeg -y -i $sourceVideo -c:v libx264 -crf 28 -preset fast -an -movflags +faststart $outVideo

Write-Host "Media processing complete."
```
To verify, check that `public/media` contains the 12 `.webp` images and 1 `hero-bg.mp4` video.
