#!/usr/bin/env bash
# copy_listing.sh
# Copy a Chapter 10 caller listing into a repository's .github/workflows/.
# Does not vendor snow-monkeys-modules; the listing still uses: that repo.
#
# Usage:
#   ./copy_listing.sh listing_10_2_cluster_hcloud_server.yml /path/to/caller-repo

set -euo pipefail

usage() {
  echo "usage: copy_listing.sh <listing.yml> <caller-repo-root>" >&2
  exit 1
}

listing="${1:-}"
dest_root="${2:-}"

if [[ -z "${listing}" || -z "${dest_root}" ]]; then
  usage
fi

if [[ ! -f "${listing}" ]]; then
  echo "missing listing: ${listing}" >&2
  exit 1
fi

if [[ ! -d "${dest_root}" ]]; then
  echo "missing caller repo: ${dest_root}" >&2
  exit 1
fi

workflow_dir="${dest_root}/.github/workflows"
mkdir -p "${workflow_dir}"
base="$(basename "${listing}")"
cp "${listing}" "${workflow_dir}/${base}"
echo "copied ${listing} -> ${workflow_dir}/${base}"
