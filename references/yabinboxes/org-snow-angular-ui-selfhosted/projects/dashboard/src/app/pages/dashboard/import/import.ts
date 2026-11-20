import { Component } from '@angular/core';
import { ImportGitReporitoies } from '../../../components/import-git-reporitories/import-git-reporitories';

/**
 * @deprecated Import screen. Not routed.
 * Publishing repositories from this screen is deprecated and is not implemented.
 */
@Component({
  selector: 'app-import',
  imports: [ImportGitReporitoies],
  templateUrl: './import.html'
})
export default class Import {

}
