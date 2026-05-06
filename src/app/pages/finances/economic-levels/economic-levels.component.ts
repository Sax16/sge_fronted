import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EconomicLevelService } from './services/economic-level.service';
import { EconomicLevel, EconomicLevelCreate, EconomicLevelUpdate } from './models/economic-level.model';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { InputFieldReactiveComponent } from '../../../shared/components/reactive-form/input/input-field-reactive.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ICONS } from '../../../shared/constants/icons.constant';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-economic-levels',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageBreadcrumbComponent,
    InputFieldReactiveComponent,
    ButtonComponent,
  ],
  templateUrl: './economic-levels.component.html',
})
export class EconomicLevelsComponent {
  private readonly economicLevelService = inject(EconomicLevelService);
  private readonly fb = inject(FormBuilder);
  readonly icons = ICONS;

  readonly economicLevels = signal<EconomicLevel[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly isFormOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
    description: [null as string | null, [Validators.maxLength(75)]]
  });

  constructor() {
    this.loadEconomicLevels();
  }

  async loadEconomicLevels() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const levels = await firstValueFrom(this.economicLevelService.getEconomicLevels());
      this.economicLevels.set(levels);
    } catch (err: any) {
      this.error.set('Error al cargar los niveles económicos');
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
    this.error.set(null);

    try {
      const id = this.editingId();
      if (id) {
        await firstValueFrom(this.economicLevelService.updateEconomicLevel(id, data as EconomicLevelUpdate));
      } else {
        await firstValueFrom(this.economicLevelService.createEconomicLevel(data as EconomicLevelCreate));
      }
      await this.loadEconomicLevels();
      this.closeForm();
    } catch (err: any) {
      this.error.set(err.error?.detail || 'Error al guardar el nivel económico');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteLevel(id: number) {
    if (!confirm('¿Está seguro de eliminar este nivel económico?')) return;
    
    this.loading.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.economicLevelService.deleteEconomicLevel(id));
      await this.loadEconomicLevels();
    } catch (err: any) {
      this.error.set(err.error?.detail || 'No se puede eliminar porque tiene registros relacionados.');
    } finally {
      this.loading.set(false);
    }
  }
}
