import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-individual-license',
  imports: [DatePipe],
  templateUrl: './individual-license.html'
})
export default class IndividualLicense {
  currentDate = new Date();
}
