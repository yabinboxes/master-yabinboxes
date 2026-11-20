import { Component } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-self-license',
  imports: [DatePipe, MarkdownModule, CommonModule],
  templateUrl: './self-license.html'
})
export default class SelfLicense {
  currentDate = new Date();
  
  readonly markdownContent = `# License Terms

**Self-Hosted License Agreement**

> **License Type: Self-Hosted**  
> This license allows you to use the software for personal or internal business purposes.

---
## 1. Limitations
### Self-Hosted License

- Unlimited deployments to the same infrastructure
- Unlimited monitoring repositories to the same infrastructure

### Individual License

- Limited to 1 deployment in portal
- Limited to 20 monitoring repository in portal

## 2. Grant of License

Subject to the terms and conditions of this Agreement, we grant you a non-exclusive, non-transferable license to use the Software for your personal or internal business purposes.

## 3. Permitted Uses

- Install and use the Software on your own infrastructure
- Use the Software for personal or internal business operations
- Make reasonable backup copies of the Software
- Modify the Software for your own use (subject to restrictions below)

## 4. Restrictions

- You may not redistribute, sell, lease, or sublicense the Software
- You may not use the Software to provide services to third parties
- You may not remove or alter any proprietary notices or labels
- You may not reverse engineer, decompile, or disassemble the Software

## 5. Support and Updates

This self-hosted license includes access to community support and documentation. Premium support and updates may be available through separate agreements.

## 6. Warranty Disclaimer

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

## 7. Limitation of Liability

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 8. Termination

This license is effective until terminated. Your rights under this license will terminate automatically without notice if you fail to comply with any of its terms. Upon termination, you must destroy all copies of the Software.

## 9. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the Software is provided, without regard to its conflict of law provisions.

---

## License Acceptance

By using this Software, you acknowledge that you have read this license agreement, understand it, and agree to be bound by its terms and conditions.`;
}
