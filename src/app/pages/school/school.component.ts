import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { SchoolService } from './services/school.service';
import { AlertService } from '../../shared/services/alert.service';
import { School, SchoolDto, MANAGEMENT_OPTIONS, UGEL, Management, Ugel } from './models/school.model';
import { DocumentValidators } from '../../shared/validators/document.validator';
import { ContactValidators } from '../../shared/validators/contact.validator';
import { FormValidationUtil } from '../../shared/utils/form-validation.util';
import { StringSanitizeUtil } from '../../shared/utils/string-sanitize.util';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { InputFieldReactiveComponent } from '../../shared/components/reactive-form/input/input-field-reactive.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { SelectReactiveComponent } from '../../shared/components/reactive-form/select-reactive/select-reactive.component';
import { SelectOption } from '../../shared/models/select-option.model';
import { parseApiError } from '../../shared/utils/api-error.util';
import { EmployeeService } from '../employees/services/employee.service';
import { Employee } from '../employees/models/employee.model';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageBreadcrumbComponent,
    AlertComponent,
    InputFieldReactiveComponent,
    LabelComponent,
    ButtonComponent,
    SelectReactiveComponent,
  ],
  templateUrl: './school.component.html',
}) 
export class SchoolComponent implements OnInit { 
  public readonly schoolService = inject(SchoolService);
  public readonly alertService = inject(AlertService);
  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  schoolData: School = {} as School;
  schoolId: number = 1;

  employees: Employee[] = [];
  headmasterOptions: SelectOption[] = [];
  deputyDirectorOptions: SelectOption[] = [];

  readonly managementOptions: SelectOption[] = MANAGEMENT_OPTIONS;
  readonly ugelOptions: SelectOption[] = UGEL;

  ngOnInit(): void {
    this.form = this.buildForm();
    this.loadEmployees();
    this.loadSchoolData();
  }

  loadSchoolData(): void {
    this.isLoading = true;
    this.schoolService.getSchool(this.schoolId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (school) => {
          this.schoolData = school;
          this.populateForm(school);
          this.isLoading = false;
        },
        error: (err) => {
          const errorMsg = parseApiError(err, 'Error al cargar datos de la institución. Por favor, recargue la página.');
          this.alertService.showAlert('error', 'Error', errorMsg);
          this.isLoading = false;
          console.error('Error loading school data:', err);
        }
      });
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.buildDto();
    
    this.schoolService.updateSchool(this.schoolId, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedSchool) => {
          this.schoolData = updatedSchool;
          this.alertService.showAlert('success', 'Éxito', '¡Datos actualizados correctamente!');
        },
        error: (err) => {
          const errorMsg = parseApiError(err, 'Error al actualizar datos de la institución. Por favor, recargue la página.');
          this.alertService.showAlert('error', 'Error', errorMsg);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          console.error('Error updating school data:', err);
        }
      });
  }

  shouldShowError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.isSubmitted);
  }

  getHint(controlName: string): string | undefined {
    const control = this.form.get(controlName);
    if (!control || !this.shouldShowError(control)) return undefined;
    
    return FormValidationUtil.getErrorMessage(controlName, control.errors);
  }

  private buildForm(): FormGroup {
    return new FormGroup({
      companyName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      businessName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      management: new FormControl<Management | null>(null, [Validators.required]),
      address: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, ContactValidators.phone()]),
      ruc: new FormControl('', [Validators.required, DocumentValidators.ruc()]),
      dre: new FormControl(''),
      ugel: new FormControl<Ugel | null>(null),
      headmasterId: new FormControl<number | null>(null, [Validators.required]),
      deputyDirectorId: new FormControl<number | null>(null)
    });
  }

  private mapEmployeeOptions(): void {
    this.headmasterOptions = this.employees
      .filter((employee) => employee.position === 'Director')
      .map((employee) => ({
        value: employee.id,
        label: `${employee.firstName} ${employee.lastName}`
      }));
      
    this.deputyDirectorOptions = this.employees
      .filter((employee) => employee.position === 'Subdirector')
      .map((employee) => ({
        value: employee.id,
        label: `${employee.firstName} ${employee.lastName}`
      }));
  }

  private populateForm(school: School): void {
    this.form.patchValue({
      companyName: school.companyName,
      businessName: school.businessName,
      management: school.management,
      address: school.address,
      email: school.email,
      phoneNumber: school.phoneNumber,
      ruc: school.ruc,
      dre: school.dre,
      ugel: school.ugel,
      headmasterId: school.headmasterId,
      deputyDirectorId: school.deputyDirectorId
    });
  }

  private buildDto(): SchoolDto {
    const v = this.form.value;
    return {
      companyName: v.companyName.trim(),
      businessName: v.businessName.trim(),
      management: v.management as Management,
      address: v.address.trim(),
      email: v.email.trim(),
      phoneNumber: v.phoneNumber.trim(),
      ruc: v.ruc.trim(),
      dre: StringSanitizeUtil.toStringOrNull(v.dre),
      ugel: (v.ugel || null) as Ugel | null,
      headmasterId: Number(v.headmasterId),
      deputyDirectorId: v.deputyDirectorId ? Number(v.deputyDirectorId) : null
    };
  }

  private loadEmployees(): void {
    this.employeeService.getAllEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (employees) => {
          this.employees = employees;
          this.mapEmployeeOptions();
        },
        error: (err) => {
          const errorMsg = parseApiError(err, 'Error al cargar datos de los empleados. Por favor, recargue la página.');
          this.alertService.showAlert('error', 'Error', errorMsg);
          console.error('Error loading employees:', err);
        }
      });
  }
}
