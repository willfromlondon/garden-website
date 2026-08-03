#!/bin/sh
set -eu

repo="willfromlondon/garden"
api="https://api.github.com/repos/$repo/releases/latest"
json="$(curl -fsSL -H 'Accept: application/vnd.github+json' "$api")"
os="$(uname -s)"
arch="$(uname -m)"

asset_url() {
  printf '%s' "$json" | awk -v pattern="$1" '
    /"browser_download_url"/ {
      line=$0
      gsub(/.*"browser_download_url": "/, "", line)
      gsub(/".*/, "", line)
      lower=tolower(line)
      if (lower ~ pattern) { print line; exit }
    }'
}

case "$os" in
  Darwin)
    case "$arch" in
      arm64|aarch64) url="$(asset_url '\.(dmg)$.*(aarch64|arm64)|((aarch64|arm64).*)?\.dmg$')" ;;
      *) url="$(asset_url '\.(dmg)$.*(x64|x86_64)|((x64|x86_64).*)?\.dmg$')" ;;
    esac
    [ -n "$url" ] || url="$(asset_url '\.dmg$')"
    [ -n "$url" ] || { echo "The latest garden release does not include a macOS installer." >&2; exit 1; }
    file="${TMPDIR:-/tmp}/garden-installer.dmg"
    curl -fL "$url" -o "$file"
    echo "garden has been downloaded to $file. Open it to install garden."
    open "$file"
    ;;
  Linux)
    url="$(asset_url '\.appimage$')"
    if [ -n "$url" ]; then
      target="${HOME}/.local/bin/garden"
      mkdir -p "${HOME}/.local/bin"
      curl -fL "$url" -o "$target"
      chmod +x "$target"
      echo "garden installed at $target"
      exit 0
    fi
    url="$(asset_url '\.deb$')"
    [ -n "$url" ] || { echo "The latest garden release does not include a Linux installer." >&2; exit 1; }
    file="${TMPDIR:-/tmp}/garden-installer.deb"
    curl -fL "$url" -o "$file"
    echo "garden has been downloaded to $file. Install it with: sudo apt install $file"
    ;;
  *) echo "garden does not have an installer for $os." >&2; exit 1 ;;
esac
