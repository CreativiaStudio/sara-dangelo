$directories = @("app", "components")
$pattern = "black|#2A2A2A|#000|#000000|rgba\(0,0,0"

$results = @()

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Recurse -File
        foreach ($file in $files) {
            $matches = Select-String -Path $file.FullName -Pattern $pattern -AllMatches
            if ($matches) {
                foreach ($match in $matches) {
                    $results += "$($file.FullName):$($match.LineNumber): $($match.Line.Trim())"
                }
            }
        }
    }
}

if ($results.Count -gt 0) {
    Write-Output "FOUND TRACES OF BLACK/DARK COLORS:"
    $results | ForEach-Object { Write-Output $_ }
} else {
    Write-Output "NO TRACES OF BLACK/DARK COLORS FOUND."
}
