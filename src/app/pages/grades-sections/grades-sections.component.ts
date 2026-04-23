import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TabComponent, TabOption } from '../../shared/components/common/tab/tab.component';
import { LevelListComponent } from './components/level-list/level-list.component';
import { LevelService } from './services/level.service';
import { GradeService } from './services/grade.service';
import { Level, LevelAcademicType } from './models/level.model';
import { Grade } from './models/grade.model';

@Component({
  selector: 'app-grades-sections',
  imports: [PageBreadcrumbComponent, TabComponent, LevelListComponent],
  templateUrl: './grades-sections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradesSectionsComponent {
  private readonly levelService = inject(LevelService);
  private readonly gradeService = inject(GradeService);

  /** Tab options */
  readonly tabOptions: TabOption[] = [
    { label: 'Educación Básica Regular', value: LevelAcademicType.REGULAR },
    { label: 'Educación Extraordinaria', value: LevelAcademicType.EXTRAORDINARIA },
  ];

  /** Currently active tab — starts on "Regular" */
  readonly activeTab = signal<string | number>(LevelAcademicType.REGULAR);

  /** Data signals */
  readonly levels = signal<Level[]>([]);
  readonly grades = signal<Grade[]>([]);
  readonly isLoading = signal(true);

  /** Levels filtered by active tab type */
  readonly filteredLevels = computed(() =>
    this.levels().filter((l) => l.type === this.activeTab())
  );

  readonly LevelAcademicType = LevelAcademicType;

  constructor() {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [levels, grades] = await Promise.all([
        firstValueFrom(this.levelService.getAllLevels()),
        firstValueFrom(this.gradeService.getAllGrades()),
      ]);
      this.levels.set(levels);
      this.grades.set(grades);
    } finally {
      this.isLoading.set(false);
    }
  }
}