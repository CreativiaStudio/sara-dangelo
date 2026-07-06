# Handoff Report: Media Selection & Optimization Plan

## 1. Observation
- Inspected the source directory `c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi`.
- Found multiple subdirectories representing different event locations (e.g., `Castello lancellotti`, `SAN CRISTOFORO`, `TAURINUS`, `aquapetra`, `scraio`, `pennata`).
- Identified image files (.jpg) and several video files (.mp4), including files within `matrimoni 2025/Rino&raffaella - Villa Eliana/`.
- The `SCOPE.md` specifies selecting 10-15 best photos and 1 background video, to be converted to WebP and compressed, with the output placed in `c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media`.

## 2. Logic Chain
- To create a diverse portfolio, images were selected across multiple venue/event folders to capture different styles and settings. 15 images in total were identified.
- The largest video file from the `Rino&raffaella - Villa Eliana` folder was selected as the background video candidate to ensure sufficient quality for compression.
- `ffmpeg` is chosen for the processing strategy because it natively supports both high-quality WebP image conversion and advanced video compression (e.g., removing audio and scaling for web backgrounds) without requiring multiple distinct tools.

## 3. Caveats
- The selection of "best" photos was determined by ensuring a representative mix across available subdirectories rather than visual inspection, since visual previewing was out of scope for the text-based explorer.
- Ensure `ffmpeg` is installed and accessible in the system PATH before running the recommended commands.
- File names contain spaces and special characters; paths in scripts must be properly quoted.

## 4. Conclusion
### Selected Background Video:
`c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi/matrimoni 2025/Rino&raffaella - Villa Eliana/Rino&Raffaella_AQNB3ja3sdMJooPK7W92qaALwXx9opifCjMwzGy-w5vQ_eIriNcjY1YcuklwueOyNceIicc3k-8EbeVvZmqZfGcQcNoxtWbLBOBgPGU.mp4`

### Selected Photos (15):
1. `Castello lancellotti/Castello lancellotti/IMG_0014.jpg`
2. `Castello lancellotti/Castello lancellotti/IMG_0052.jpg`
3. `Castello lancellotti/Castello lancellotti/IMG_9882.jpg`
4. `SAN CRISTOFORO/SAN CRISTOFORO/1SDA Il Cristoforo 15.jpg`
5. `SAN CRISTOFORO/SAN CRISTOFORO/SDA 7.jpg`
6. `SAN CRISTOFORO/SAN CRISTOFORO/SDA Il Cristoforo 35.jpg`
7. `TAURINUS/TAURINUS/IMG_6658.jpg`
8. `TAURINUS/TAURINUS/IMG_6891.jpg`
9. `TAURINUS/TAURINUS/IMG_7294.jpg`
10. `foto da inserire/aquapetra (lo stile vegetativo)/aquapetra (lo stile vegetativo)/IMG_9047.jpg`
11. `foto da inserire/aquapetra (lo stile vegetativo)/aquapetra (lo stile vegetativo)/IMG_9606.jpg`
12. `foto da inserire/aquapetra (lo stile vegetativo)/aquapetra (lo stile vegetativo)/IMG_9825.jpg`
13. `wetransfer_scraio-zip_2026-04-22_2149/pennata/pennata/SDA 43.jpg`
14. `wetransfer_scraio-zip_2026-04-22_2149/san cristoforo/san cristoforo/SDA Il Cristoforo 60.jpg`
15. `wetransfer_scraio-zip_2026-04-22_2149/scraio/scraio/SDA Scrajo 12.jpg`

### Recommended Processing Strategy (PowerShell with FFmpeg):
**Video Compression (Remove audio, downscale to 1080p width, lower bitrate for web background):**
```powershell
$srcVideo = "c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi/matrimoni 2025/Rino&raffaella - Villa Eliana/Rino&Raffaella_AQNB3ja3sdMJooPK7W92qaALwXx9opifCjMwzGy-w5vQ_eIriNcjY1YcuklwueOyNceIicc3k-8EbeVvZmqZfGcQcNoxtWbLBOBgPGU.mp4"
$outVideo = "c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media/background.mp4"
ffmpeg -i $srcVideo -an -vcodec libx264 -crf 28 -preset veryfast -vf "scale=1920:-2" $outVideo
```

**Image Conversion to WebP:**
```powershell
$outDir = "c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media"
New-Item -ItemType Directory -Force -Path $outDir

# Example for a single image, loop over the selected list:
$srcImage = "c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi/Castello lancellotti/Castello lancellotti/IMG_0014.jpg"
$outImage = Join-Path $outDir "IMG_0014.webp"
ffmpeg -i $srcImage -c:v libwebp -q:v 80 $outImage
```

## 5. Verification Method
- Execute the PowerShell processing commands in the terminal.
- Verify that `c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media` contains 15 `.webp` files and 1 `.mp4` file.
- Open the resulting WebP images in a browser to confirm visual integrity, and check the MP4 to confirm it plays silently as a background loop.
