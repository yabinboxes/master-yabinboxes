import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsPageHeader } from '../../components/docs-page-header/docs-page-header';

@Component({
  selector: 'app-reporting',
  imports: [RouterLink, DocsPageHeader],
  templateUrl: './reporting.html',
})
export default class Reporting {}
