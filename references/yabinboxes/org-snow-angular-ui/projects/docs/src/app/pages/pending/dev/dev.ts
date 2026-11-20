import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-dev',
  imports: [],
  templateUrl: './dev.html'
})
export default class Dev {

   mdFile = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['mdFile'] || ''))
  );

}
