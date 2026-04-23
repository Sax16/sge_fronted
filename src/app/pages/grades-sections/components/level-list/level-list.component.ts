import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
} from '@angular/core';
import { Level, LevelAcademicType } from '../../models/level.model';
import { Grade } from '../../models/grade.model';
import { LevelAccordionItemComponent } from '../level-accordion-item/level-accordion-item.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/common/modal/modal.component';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';
import { ICONS } from '../../../../shared/constants/icons.constant';

@Component({
  selector: 'app-level-list',
  imports: [LevelAccordionItemComponent, ButtonComponent, ModalComponent, SafeHtmlPipe],
  templateUrl: './level-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelListComponent {
  readonly levels = input.required<Level[]>();
  readonly grades = input<Grade[]>([]);
  readonly type = input.required<LevelAcademicType>();

  readonly isModalOpen = signal(false);
  readonly LevelAcademicType = LevelAcademicType;
  readonly icons = ICONS;

  /** Descriptive title shown above the accordion list */
  readonly title = computed(() =>
    this.type() === LevelAcademicType.REGULAR
      ? 'Educación Básica Regular'
      : 'Educación Extraordinaria'
  );

  readonly description = computed(() =>
    this.type() === LevelAcademicType.REGULAR
      ? 'Estructura estándar de niveles y grados según el sistema educativo nacional'
      : 'Niveles, grados y secciones personalizados (academias, preparatorias, etc.)'
  );

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
