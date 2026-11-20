# <a id="snow-monkeys"></a>Snow Monkeys

Snow Monkeys is a dashboard portal designed to efficiently organize and visualize your repositories, with native compatibility for GitHub, GitLab, and ArgoCD.

Provision this functionality:

1. Reusable modules for source of truth
2. Resource Dashboard
3. Discovery service
4. Liveness probe

The dashboard automatically analyzes your code and classifies each repository according to its function into three main categories:
- **CLUSTER**: k8s and VMs
- **APPLICATION**: application code in java, angular, etc..
- **SERVICE**: application dependencies like bukets


While traditionally Git repositories primarily host application code, in Infrastructure as Code (IaC) git repositories is used as **Source of Truth** which one we use as code manage, infraestructure definition and dependency services definition.


## <a id="api-and-self-detection"></a>API and Self detection 
Snow Monkeys integrates directly with your CI/CD pipeline, offering a dedicated *API* to manually publish changes or using **Automatic detection** with real-time synchronization with your dashboard.

## <a id="extended-functionality"></a>Extended Functionality
In **Snow Monkeys dashboard** we can also extend functionality like **Color tagging** in order to group repositories by project and the ability to add **comments** and **metadata**
