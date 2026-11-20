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

resource "google_sql_database_instance" "this" {
  name             = var.name
  database_version = var.database_version
  region           = var.region
  deletion_protection = var.deletion_protection

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_size         = var.disk_size
    disk_type         = var.disk_type

    ip_configuration {
      ipv4_enabled = var.ipv4_enabled
    }

    user_labels = merge(
      {
        managed_by = "terraform"
      },
      var.labels,
    )
  }
}
