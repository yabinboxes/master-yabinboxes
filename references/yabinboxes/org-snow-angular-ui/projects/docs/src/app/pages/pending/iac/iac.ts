import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-iac',
  imports: [],
  templateUrl: './iac.html',
  styleUrl: './iac.css'
})
export default class Iac {

  mdFile = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['mdFile'] || ''))
  );

}
