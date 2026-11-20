export type GithubRepo = {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    private: boolean;
    visibility?: 'public' | 'private' | 'internal';
    language: string | null;
    updated_at: string;
  };
  
  export type GithubOrg = {
    login: string;
  };
  
  export type GithubEnterprise = {
    slug: string;
  };