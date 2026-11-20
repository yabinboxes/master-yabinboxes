terraform {

  required_version = ">= 0.13.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.54.0"
    }
  }


}

provider "digitalocean" {
  # Configuration options
  token = var.digitalocean_token
}
