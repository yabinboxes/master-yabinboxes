terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.0"
    }
  }
  required_version = ">= 1.3"
}

provider "google" {
  project     = var.project
  region      = var.region
  credentials = var.credentials == "" ? null : var.credentials
}

resource "google_storage_bucket" "this" {
  name                        = var.name
  location                    = var.location
  force_destroy               = var.force_destroy
  uniform_bucket_level_access = var.uniform_bucket_level_access
  storage_class               = var.storage_class

  labels = merge(
    {
      managed_by = "terraform"
    },
    var.labels,
  )
}
