import { FormGroup } from '@angular/forms';
import { FormValidationUtil } from './form-validation.util';


export class FormErrorHelper {
  constructor(
    private readonly form: FormGroup,
    private readonly submitted: () => boolean,
  ) {}

  shouldShowError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  getHint(controlName: string): string | undefined {
    const control = this.form.get(controlName);
    if (!control || !this.shouldShowError(controlName)) return undefined;
    return FormValidationUtil.getErrorMessage(controlName, control.errors);
  }
}
