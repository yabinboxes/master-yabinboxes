#!/usr/bin/env bash
#
# install-docker.sh
# Installs Docker CE on Ubuntu 26.04 (Resolute Raccoon) and other LTS releases.
#
# Usage:
#   chmod +x install-docker.sh
#   sudo ./install-docker.sh
#

set -euo pipefail

# Kernel release only, e.g. "6.8.0-45-generic"
echo "Linux $(uname -r)"

# Full pretty string, e.g. "Ubuntu 24.04.1 LTS"
. /etc/os-release && echo "$PRETTY_NAME"

# -------- Colors --------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()   { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[ OK ]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[FAIL]${NC} $*" >&2; }

# -------- Must run as root --------
if [[ "$EUID" -ne 0 ]]; then
  error "This script must be run as root. Use: sudo $0"
  exit 1
fi

# -------- Verify Ubuntu --------
[[ -f /etc/os-release ]] || { error "/etc/os-release not found."; exit 1; }
# shellcheck disable=SC1091
. /etc/os-release

if [[ "${ID:-}" != "ubuntu" ]]; then
  error "Unsupported distribution: ${ID:-unknown}. This script is for Ubuntu only."
  exit 1
fi

# Prefer UBUNTU_CODENAME (26.04 = resolute), fall back to VERSION_CODENAME
CODENAME="${UBUNTU_CODENAME:-${VERSION_CODENAME:-}}"
if [[ -z "$CODENAME" ]]; then
  error "Could not determine Ubuntu codename."
  exit 1
fi

log "Detected OS: ${PRETTY_NAME:-$ID $VERSION_ID} (codename: ${CODENAME})"

# -------- Remove conflicting / stale Docker sources --------
log "Cleaning up existing Docker apt sources..."
rm -f /etc/apt/sources.list.d/docker.list
rm -f /etc/apt/sources.list.d/docker.sources

# -------- Uninstall unofficial Docker packages --------
log "Removing any unofficial Docker packages that may conflict..."
CONFLICTS="docker.io docker-compose docker-compose-v2 docker-doc docker-buildx podman-docker containerd runc"
for pkg in $CONFLICTS; do
  if dpkg -s "$pkg" &>/dev/null; then
    apt-get remove -y "$pkg" || true
  fi
done

# -------- Install prerequisites --------
log "Installing prerequisites..."
apt-get update -y
apt-get install -y ca-certificates curl

# -------- Add Docker GPG key --------
log "Adding Docker GPG key..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL "https://download.docker.com/linux/ubuntu/gpg" \
  -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# -------- Add Docker repository for detected codename --------
log "Adding Docker repository for '${CODENAME}'..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list

# -------- Install Docker --------
log "Updating package index..."
apt-get update -y

log "Installing Docker CE packages..."
apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

# -------- Enable & start --------
log "Enabling and starting Docker..."
systemctl enable docker
systemctl start docker

# -------- Verify --------
if docker --version >/dev/null 2>&1; then
  ok "Docker installed: $(docker --version)"
else
  error "Docker installation failed."
  exit 1
fi

# -------- Add invoking user to docker group --------
if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
  log "Adding '${SUDO_USER}' to the 'docker' group..."
  usermod -aG docker "${SUDO_USER}"
  warn "User '${SUDO_USER}' must log out and back in for group changes to take effect."
fi

# -------- Smoke test --------
log "Running hello-world smoke test..."
if docker run --rm hello-world >/dev/null 2>&1; then
  ok "Docker is working correctly!"
else
  warn "hello-world test failed. Check 'systemctl status docker'."
fi

echo
ok "Done! Docker is installed and running on ${CODENAME}."
echo "   Try: docker run --rm hello-world"