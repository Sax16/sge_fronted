import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { AlertService } from '../../shared/services/alert.service';
import { TabComponent, TabOption } from '../../shared/components/common/tab/tab.component';
import { LevelListComponent } from './components/level-list/level-list.component';
import { LevelService } from './services/level.service';
import { GradeService } from './services/grade.service';
import { SectionService } from './services/section.service';
import { Level, LevelAcademicType } from './models/level.model';
import { Grade } from './models/grade.model';
import { Section } from './models/section.model';

@Component({
  selector: 'app-grades-sections',
  imports: [PageBreadcrumbComponent, AlertComponent, TabComponent, LevelListComponent],
  templateUrl: './grades-sections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradesSectionsComponent {
  private readonly levelService = inject(LevelService);
  private readonly gradeService = inject(GradeService);
  private readonly sectionService = inject(SectionService);

  public alertService = inject(AlertService);

  /** Tab options */
  readonly tabOptions: TabOption[] = [
    { label: 'Educación Básica Regular', value: LevelAcademicType.REGULAR },
    { label: 'Educación Extraordinaria', value: LevelAcademicType.EXTRAORDINARIA },
  ];

  /** Currently active academic type */
  readonly selectedAcademicType = signal<string | number>(LevelAcademicType.REGULAR);

  /** Data signals */
  readonly levels = signal<Level[]>([]);
  readonly grades = signal<Grade[]>([]);
  readonly sections = signal<Section[]>([]);
  readonly isLoading = signal(true);

  /** Levels filtered by active tab type */
  readonly filteredLevels = computed(() =>
    this.levels().filter((l) => l.type === this.selectedAcademicType())
  );

  constructor() {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.alertService.clearAlert();
  }

  async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [levels, grades, sections] = await Promise.all([
        firstValueFrom(this.levelService.getAllLevels()),
        firstValueFrom(this.gradeService.getAllGrades()),
        firstValueFrom(this.sectionService.getAllSections()),
      ]);
      this.levels.set(levels);
      this.grades.set(grades);
      this.sections.set(sections);
    } finally {
      this.isLoading.set(false);
    }
  }
}