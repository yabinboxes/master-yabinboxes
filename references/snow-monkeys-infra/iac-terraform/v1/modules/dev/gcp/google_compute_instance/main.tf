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

resource "google_compute_instance" "this" {
  name         = var.name
  machine_type = var.server_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = var.image
      size  = var.disk_size_gb
    }
  }

  network_interface {
    network    = var.network
    subnetwork = var.subnetwork == "" ? null : var.subnetwork

    dynamic "access_config" {
      for_each = var.associate_public_ip ? [1] : []
      content {}
    }
  }

  metadata = var.ssh_public_key != "" ? {
    ssh-keys = "${var.ssh_user}:${var.ssh_public_key}"
  } : var.metadata

  labels = merge(
    {
      managed_by = "terraform"
    },
    var.labels,
  )

  tags = var.tags
}
