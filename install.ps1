$ErrorActionPreference = "Stop"
$repository = "willfromlondon/garden"
$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$repository/releases/latest" -Headers @{ Accept = "application/vnd.github+json" }
$asset = $release.assets | Where-Object { $_.name -match '\.msi$' } | Select-Object -First 1
if (-not $asset) {
  $asset = $release.assets | Where-Object { $_.name -match '(setup|installer).*\.exe$|\.exe$' } | Select-Object -First 1
}
if (-not $asset) { throw "The latest garden release does not include a Windows installer." }
$extension = [IO.Path]::GetExtension($asset.name)
$installer = Join-Path ([IO.Path]::GetTempPath()) ("garden-installer" + $extension)
Write-Host "Downloading garden $($release.tag_name)..."
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $installer
try {
  if ($extension -eq ".msi") {
    Start-Process msiexec.exe -ArgumentList @('/i', $installer) -Wait
  } else {
    Start-Process $installer -Wait
  }
} finally {
  Remove-Item -LiteralPath $installer -Force -ErrorAction SilentlyContinue
}
