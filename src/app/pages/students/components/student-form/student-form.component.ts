import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { SelectReactiveComponent } from '../../../../shared/components/reactive-form/select-reactive/select-reactive.component';
import { DatePickerReactiveComponent } from '../../../../shared/components/reactive-form/date-picker-reactive/date-picker-reactive.component';
import { SelectOption } from '../../../../shared/models/select-option.model';
import { FormErrorHelper } from '../../../../shared/utils/form-error.helper';
import { DateFormatUtil } from '../../../../shared/utils/date-format.util';
import { StringSanitizeUtil } from '../../../../shared/utils/string-sanitize.util';
import { Student, CreateStudentDto, UpdateStudentDto, StudentFormData } from '../../models/student.model';
import { EconomicLevel } from '../../../finances/economic-levels/models/economic-level.model';
import { STUDENT_STATUS_OPTIONS, StudentStatus, StudentStatusType } from '../../../../shared/constants/student-status.constant';
import { GENDER_OPTIONS } from '../../../../shared/constants/gender.constant';
import { Gender } from '../../../../shared/models/person.model';
import { DocumentValidators } from '../../../../shared/validators/document.validator';
import { ContactValidators } from '../../../../shared/validators/contact.validator';

@Component({
  selector: 'app-student-form',
  imports: [
    CommonModule,
    InputFieldReactiveComponent,
    LabelComponent,
    ButtonComponent,
    ReactiveFormsModule,
    SelectReactiveComponent,
    DatePickerReactiveComponent
  ],
  templateUrl: './student-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentFormComponent implements OnInit, OnChanges {
  @Input() student: Student | null = null;
  @Input() economicLevels: EconomicLevel[] = [];
  @Input() isEditMode = false;
  
  @Output() submitForm = new EventEmitter<CreateStudentDto | UpdateStudentDto>();
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  formErrors!: FormErrorHelper;
  isSubmitted = false;

  readonly statusOptions: SelectOption[] = STUDENT_STATUS_OPTIONS;
  readonly genderOptions: SelectOption[] = GENDER_OPTIONS;

  ngOnInit(): void {
    this.form = this.buildForm();
    this.formErrors = new FormErrorHelper(this.form, () => this.isSubmitted);
    if (this.student) {
      this.populateForm(this.student);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student'] && this.student && this.form) {
      this.populateForm(this.student);
    }
  }

  get economicLevelOptions(): SelectOption[] {
    return this.economicLevels.map(el => ({
      value: String(el.id),
      label: el.name
    }));
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const studentData = this.isEditMode 
      ? this.buildUpdateDto() 
      : this.buildCreateDto();
    
    this.submitForm.emit(studentData);
  }

  onCancel(): void {
    this.form.reset();
    this.isSubmitted = false;
    this.cancelForm.emit();
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Guardar Cambios' : 'Registrar Estudiante';
  }

  // Private helpers

  private buildForm(): FormGroup {
    const group = new FormGroup({
      paternalSurname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(75)]),
      maternalSurname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(75)]),
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      dni: new FormControl('', [Validators.required, DocumentValidators.dni()]),
      gender: new FormControl<Gender | null>(null, [Validators.required]),
      birthDate: new FormControl<string | null>(null, [Validators.required]),
      address: new FormControl('', [Validators.minLength(2), Validators.maxLength(150)]),
      phoneNumber: new FormControl('', [ContactValidators.phone()]),
      email: new FormControl('', [Validators.email]),
      level: new FormControl({ value: '', disabled: true }),
      grade: new FormControl({ value: '', disabled: true }),
      status: new FormControl<StudentStatus | null>({ value: StudentStatusType.PENDIENTE, disabled: !this.isEditMode }, [Validators.required]),
      economicLevelId: new FormControl<string | null>(null, [Validators.required]),
    });
    return group;
  }

  private populateForm(student: Student): void {
    this.form.patchValue({
      paternalSurname: student.paternalSurname,
      maternalSurname: student.maternalSurname,
      name: student.name,
      dni: student.dni,
      gender: student.gender,
      birthDate: student.birthDate ? DateFormatUtil.toInputFormat(student.birthDate) : '',
      address: student.address,
      phoneNumber: student.phoneNumber,
      email: student.email,
      level: student.level,
      grade: student.grade,
      status: student.status,
      economicLevelId: String(student.economicLevelId),
    });
  }

  private buildCreateDto(): CreateStudentDto {
    const formValue = this.form.getRawValue() as StudentFormData;
    
    return {
      paternalSurname: StringSanitizeUtil.toStringOrNull(formValue.paternalSurname)!,
      maternalSurname: StringSanitizeUtil.toStringOrNull(formValue.maternalSurname)!,
      name: StringSanitizeUtil.toStringOrNull(formValue.name)!,
      dni: StringSanitizeUtil.toStringOrNull(formValue.dni)!,
      gender: formValue.gender,
      birthDate: formValue.birthDate ? DateFormatUtil.toApiFormat(formValue.birthDate) : null,
      address: StringSanitizeUtil.toStringOrNull(formValue.address),
      phoneNumber: StringSanitizeUtil.toStringOrNull(formValue.phoneNumber),
      email: StringSanitizeUtil.toStringOrNull(formValue.email),
      status: formValue.status,
      economicLevelId: Number(formValue.economicLevelId),
    };
  }

  private buildUpdateDto(): UpdateStudentDto {
    const formValue = this.form.getRawValue() as StudentFormData;
    
    return {
      paternalSurname: StringSanitizeUtil.toStringOrNull(formValue.paternalSurname),
      maternalSurname: StringSanitizeUtil.toStringOrNull(formValue.maternalSurname),
      name: StringSanitizeUtil.toStringOrNull(formValue.name),
      dni: StringSanitizeUtil.toStringOrNull(formValue.dni),
      gender: formValue.gender,
      birthDate: formValue.birthDate ? DateFormatUtil.toApiFormat(formValue.birthDate) : null,
      address: StringSanitizeUtil.toStringOrNull(formValue.address),
      phoneNumber: StringSanitizeUtil.toStringOrNull(formValue.phoneNumber),
      email: StringSanitizeUtil.toStringOrNull(formValue.email),
      status: formValue.status,
      economicLevelId: Number(formValue.economicLevelId),
    };
  }
}
