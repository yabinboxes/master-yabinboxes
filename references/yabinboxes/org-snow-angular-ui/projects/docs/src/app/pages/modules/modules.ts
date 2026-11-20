import { Component } from '@angular/core';
import { DocsFilters } from '../../components/docs-filters/docs-filters';
import { ModulesList } from '../../components/modules-list/modules-list';

@Component({
  selector: 'app-modules',
  imports: [DocsFilters, ModulesList],
  templateUrl: './modules.html'
})
export default class Modules {


}
