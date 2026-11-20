import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { GithubRepo, GithubOrg, GithubEnterprise } from '../../interfaces/model/api-github.interface';

@Injectable({
  providedIn: 'root',
})
export class GithubActionsApi {
  // Aggregates GitHub REST calls so components stay UI-only.
  private readonly http = inject(HttpClient);

  fetchRepos(options: {
    token?: string;
    username?: string;
    perPage?: number;
    sort?: string;
    visibility?: string;
  }) {
    const perPage = String(options.perPage ?? 100);
    const sort = options.sort ?? 'updated';

    if (options.token) {
      return this.getUserAndOrgRepos(options.token, perPage, sort);
    }

    if (!options.username) {
      return of([] as GithubRepo[]);
    }

    const publicParams = new HttpParams()
      .set('per_page', perPage)
      .set('sort', sort)
      .set('type', 'all');
    return this.getPublicRepos(options.username, publicParams);
  }

  private githubHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private getPublicRepos(username: string, params: HttpParams) {
    return this.http.get<GithubRepo[]>(
      `https://api.github.com/users/${username}/repos`,
      { params, headers: this.githubHeaders() }
    );
  }

  private getUserAndOrgRepos(token: string, perPage: string, sort: string) {
    const headers = this.githubHeaders(token);

    // /user/repos: visibility=all includes public, private, and internal.
    const userParams = new HttpParams()
      .set('per_page', perPage)
      .set('sort', sort)
      .set('visibility', 'all')
      .set('affiliation', 'owner,collaborator,organization_member');

    // /orgs/{org}/repos uses type, not visibility. type=all includes internal.
    const orgRepoParams = new HttpParams()
      .set('per_page', perPage)
      .set('sort', sort)
      .set('type', 'all');

    const userRepos$ = this.http.get<GithubRepo[]>(
      'https://api.github.com/user/repos',
      { params: userParams, headers }
    );

    const orgRepos$ = this.http
      .get<GithubOrg[]>('https://api.github.com/user/orgs', {
        params: new HttpParams().set('per_page', perPage),
        headers,
      })
      .pipe(
        switchMap((orgs) => {
          if (!orgs.length) {
            return of([] as GithubRepo[]);
          }

          const orgRequests = orgs.map((org) =>
            this.http.get<GithubRepo[]>(
              `https://api.github.com/orgs/${org.login}/repos`,
              { params: orgRepoParams, headers }
            )
          );
          return forkJoin(orgRequests).pipe(
            map((results) => results.flat())
          );
        }),
        catchError(() => of([] as GithubRepo[]))
      );

    const enterpriseRepos$ = this.http
      .get<GithubEnterprise[]>('https://api.github.com/user/enterprises', {
        headers,
      })
      .pipe(
        switchMap((enterprises) => {
          if (!enterprises.length) {
            return of([] as GithubRepo[]);
          }

          const enterpriseRequests = enterprises.map((enterprise) =>
            this.http.get<GithubRepo[]>(
              `https://api.github.com/enterprises/${enterprise.slug}/repos`,
              { params: orgRepoParams, headers }
            )
          );

          return forkJoin(enterpriseRequests).pipe(
            map((results) => results.flat())
          );
        }),
        catchError(() => of([] as GithubRepo[]))
      );

    return forkJoin([userRepos$, orgRepos$, enterpriseRepos$]).pipe(
      map(([userRepos, orgRepos, enterpriseRepos]) => {
        const allRepos = [...userRepos, ...orgRepos, ...enterpriseRepos];
        const deduped = new Map<number, GithubRepo>();
        allRepos.forEach((repo) => deduped.set(repo.id, repo));
        return Array.from(deduped.values());
      })
    );
  }
}
