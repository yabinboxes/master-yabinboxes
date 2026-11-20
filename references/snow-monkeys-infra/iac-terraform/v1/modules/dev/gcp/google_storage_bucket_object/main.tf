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

resource "google_storage_bucket_object" "this" {
  name         = var.name
  bucket       = var.bucket
  content      = var.content != "" ? var.content : null
  source       = var.source != "" ? var.source : null
  content_type = var.content_type == "" ? null : var.content_type
  cache_control = var.cache_control == "" ? null : var.cache_control
}
