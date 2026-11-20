import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HandleDeploymentsRequest } from '../../services/handlers/handle-deployments-request.api';

@Component({
  selector: 'snow-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './filters.html'
})
export class Filters {
  sources = inject(HandleDeploymentsRequest);

  private fb = inject(FormBuilder);


  typesForm: FormGroup = this.fb.group({
    applications: [true],
    services: [true],
    cluster: [true],
    resources: [true],
    civo: [true],
    digitalocean: [true],
    cloudflare: [true],
    azure: [true],
    aws: [true],
    nocolor: [true],
    blue: [true],
    green: [true],
    red: [true],
    yellow: [true],
    orange: [true]
  });


  onChangeFilter() {
    // Push form state into the handler; it derives the visible list.
    this.sources.setFilters(
      this.typesForm.value
    );
    this.sources.applyFilters(
      this.typesForm.value
    );
  }

}
