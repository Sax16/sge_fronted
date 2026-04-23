import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
} from '@angular/core';
import { Level } from '../../models/level.model';
import { Grade } from '../../models/grade.model';

@Component({
  selector: 'app-level-accordion-item',
  templateUrl: './level-accordion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelAccordionItemComponent {
  readonly level = input.required<Level>();
  readonly grades = input<Grade[]>([]);

  readonly isOpen = signal(false);

  readonly gradesForLevel = computed(() =>
    this.grades().filter((g) => g.levelId === this.level().id)
  );

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }
}
