# Handoff Report: Media Processing Plan

## 1. Observation
- Explored `c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi` and identified over 60 image files (JPEG) and 5 MP4 videos.
- Images are spread across multiple directories, including `Castello lancellotti/Castello lancellotti/TOPTEN`, `SAN CRISTOFORO/SAN CRISTOFORO`, etc.
- Videos are located in `matrimoni 2025/Rino&raffaella - Villa Eliana/`.
- Target directory is `c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media`.

## 2. Logic Chain
- A diverse set of 15 images was selected to showcase different locations and setups. `TOPTEN` folders and distinct named files like `SDA` were prioritized as they likely represent curated shots by the photographer.
- One MP4 video was selected to serve as the background video. Since background videos should be lightweight, audio will be stripped and resolution scaled.
- FFmpeg is the optimal tool to handle both image conversion to WebP and video compression.

## 3. Caveats
- Since this was a read-only investigation without visual review, the "best" photos were selected based on file naming conventions (like `TOPTEN`) and file sizes rather than aesthetic judgment. The user or implementer may want to swap specific photos if they prefer others.
- User permission timed out for deep directory inspection via PowerShell, but initial `find_by_name` results provided sufficient files to meet the 15-photo requirement.

## 4. Conclusion
**Selected Photos (15):**
1. `Castello lancellotti/Castello lancellotti/TOPTEN/Sara D'angelo (130).jpg`
2. `Castello lancellotti/Castello lancellotti/TOPTEN/Sara D'angelo (174).jpg`
3. `Castello lancellotti/Castello lancellotti/TOPTEN/Sara D'angelo (78).jpg`
4. `Castello lancellotti/Castello lancellotti/TOPTEN/Sara D'angelo (81).jpg`
5. `SAN CRISTOFORO/SAN CRISTOFORO/1SDA Il Cristoforo 15.jpg`
6. `SAN CRISTOFORO/SAN CRISTOFORO/5SDA Il Cristoforo 28.jpg`
7. `SAN CRISTOFORO/SAN CRISTOFORO/SDA 1(1).jpg`
8. `SAN CRISTOFORO/SAN CRISTOFORO/SDA 7.jpg`
9. `Castello lancellotti/Castello lancellotti/IMG_0014.jpg`
10. `Castello lancellotti/Castello lancellotti/IMG_0022.jpg`
11. `Castello lancellotti/Castello lancellotti/Sara D'angelo (131).jpg`
12. `Castello lancellotti/Castello lancellotti/Sara D'angelo (169).jpg`
13. `Castello lancellotti/Castello lancellotti/IMG_0033.jpg`
14. `Castello lancellotti/Castello lancellotti/Sara D'angelo (64).jpg`
15. `Castello lancellotti/Castello lancellotti/Sara D'angelo (80).jpg`

**Selected Background Video (1):**
- `matrimoni 2025/Rino&raffaella - Villa Eliana/Rino&Raffaella_AQMro5x7iFDsoMlTOb5I2dU6Me8unTdEnQIvMWim_hyyhB0y9Pdto72YRgN4HKpfcBzD46O-d-0WNTuBlQ1LPS89N2UgQ-IHj3DqqJk.mp4`

**Processing Strategy:**
Use a PowerShell script to iterate over the selected files and run FFmpeg.

*WebP Image Conversion:*
```powershell
ffmpeg -i "<source_path>" -c:v libwebp -quality 80 "c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media/<filename>.webp"
```

*Video Compression (No audio, 720p, smaller file size):*
```powershell
ffmpeg -i "<video_source_path>" -vcodec libx264 -crf 28 -preset fast -an -s 1280x720 "c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media/background.mp4"
```

## 5. Verification Method
- Execute the proposed FFmpeg commands on one test image and the video.
- Inspect the output directory `c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media` to ensure files exist, WebP images look correct in a browser, and the MP4 video plays without sound at a reasonable file size.
