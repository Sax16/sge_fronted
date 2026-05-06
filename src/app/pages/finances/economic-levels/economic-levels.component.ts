import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EconomicLevelService } from './services/economic-level.service';
import { EconomicLevel, EconomicLevelCreate, EconomicLevelUpdate } from './models/economic-level.model';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { InputFieldReactiveComponent } from '../../../shared/components/reactive-form/input/input-field-reactive.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ConfirmModalComponent } from '../../../shared/components/ui/confirm-modal/confirm-modal.component';
import { ICONS } from '../../../shared/constants/icons.constant';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { parseApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-economic-levels',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageBreadcrumbComponent,
    InputFieldReactiveComponent,
    ButtonComponent,
    AlertComponent,
    ConfirmModalComponent
  ],
  templateUrl: './economic-levels.component.html',
})
export class EconomicLevelsComponent {
  private readonly economicLevelService = inject(EconomicLevelService);
  private readonly fb = inject(FormBuilder);
  public readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);
  
  readonly icons = ICONS;

  readonly economicLevels = signal<EconomicLevel[]>([]);
  readonly loading = signal(false);

  readonly isFormOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  // Confirm Modal State
  readonly isConfirmDeleteOpen = signal(false);
  readonly levelToDelete = signal<number | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
    description: [null as string | null, [Validators.maxLength(75)]]
  });

  constructor() {
    this.loadEconomicLevels();

    this.destroyRef.onDestroy(() => {
      this.alertService.clearAlert();
    });
  }

  async loadEconomicLevels() {
    this.loading.set(true);
    try {
      const levels = await firstValueFrom(this.economicLevelService.getEconomicLevels());
      this.economicLevels.set(levels);
    } catch (err: any) {
      const errorMsg = parseApiError(err, 'Error al cargar los niveles económicos.');
      this.alertService.showAlert('error', 'Error', errorMsg);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateForm() {
    this.form.reset({ name: '', description: null });
    this.editingId.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(level: EconomicLevel) {
    this.form.reset({
      name: level.name,
      description: level.description
    });
    this.editingId.set(level.id);
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();
    this.loading.set(true);

    try {
      const id = this.editingId();
      if (id) {
        await firstValueFrom(this.economicLevelService.updateEconomicLevel(id, data as EconomicLevelUpdate));
        this.alertService.showAlert('success', 'Éxito', 'Nivel económico actualizado correctamente');
      } else {
        await firstValueFrom(this.economicLevelService.createEconomicLevel(data as EconomicLevelCreate));
        this.alertService.showAlert('success', 'Éxito', 'Nivel económico creado correctamente');
      }
      await this.loadEconomicLevels();
      this.closeForm();
    } catch (err: any) {
      const errorMsg = parseApiError(err, 'Error al guardar el nivel económico.');
      this.alertService.showAlert('error', 'Error', errorMsg);
    } finally {
      this.loading.set(false);
    }
  }

  requestDelete(id: number) {
    this.levelToDelete.set(id);
    this.isConfirmDeleteOpen.set(true);
  }

  cancelDelete() {
    this.isConfirmDeleteOpen.set(false);
    this.levelToDelete.set(null);
  }

  async confirmDelete() {
    const id = this.levelToDelete();
    if (!id) return;
    
    this.isConfirmDeleteOpen.set(false);
    this.loading.set(true);
    
    try {
      await firstValueFrom(this.economicLevelService.deleteEconomicLevel(id));
      this.alertService.showAlert('success', 'Éxito', 'Nivel económico eliminado correctamente');
      await this.loadEconomicLevels();
    } catch (err: any) {
      const errorMsg = parseApiError(err, 'No se puede eliminar porque tiene registros relacionados.');
      this.alertService.showAlert('error', 'Error', errorMsg);
    } finally {
      this.loading.set(false);
      this.levelToDelete.set(null);
    }
  }
}
