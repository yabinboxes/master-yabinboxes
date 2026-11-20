variable "cloudflare_api_token" {
  description = "Cloudflare API token (set via TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID (set via TF_VAR_account_id)"
  type        = string
}

variable "name" {
  description = "Workers script name (set via TF_VAR_name)"
  type        = string
  default     = "snow-worker"
}

variable "content" {
  description = "Worker script content (set via TF_VAR_content)"
  type        = string
  default     = <<-EOT
    export default {
      async fetch(request, env, ctx) {
        return new Response("Hello from snow-worker");
      },
    };
  EOT
}

variable "main_module" {
  description = "Main module filename for module syntax (set via TF_VAR_main_module). Empty omits."
  type        = string
  default     = "worker.js"
}
