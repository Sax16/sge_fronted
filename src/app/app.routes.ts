import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { UsersComponent } from './pages/users/users.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { SchoolComponent } from './pages/school/school.component';
import { GradesSectionsComponent } from './pages/grades-sections/grades-sections.component';
import { UserRoleType } from './shared/constants/role.constant';
import { EconomicLevelsComponent } from './pages/finances/economic-levels/economic-levels.component';
import { StudentsComponent } from './pages/students/students.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    data: { breadcrumb: 'Inicio' },
    children: [
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'Angular Ecommerce Dashboard | TailAdmin - Angular Admin Dashboard Template',
      },
      {
        path: 'calendar',
        component: CalenderComponent,
        title: 'Angular Calender | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumb: 'Perfil' },
        title: 'Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'form-elements',
        component: FormElementsComponent,
        title: 'Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'basic-tables',
        component: BasicTablesComponent,
        title: 'Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'blank',
        component: BlankComponent,
        title: 'Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      // support tickets
      {
        path: 'invoice',
        component: InvoicesComponent,
        title: 'Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'line-chart',
        component: LineChartComponent,
        title: 'Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'bar-chart',
        component: BarChartComponent,
        title: 'Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'alerts',
        component: AlertsComponent,
        title: 'Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'avatars',
        component: AvatarElementComponent,
        title: 'Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'badge',
        component: BadgesComponent,
        title: 'Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
        title: 'Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'images',
        component: ImagesComponent,
        title: 'Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'videos',
        component: VideosComponent,
        title: 'Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'economic-levels',
        component: EconomicLevelsComponent,
        title: 'Niveles Económicos | ELOHIM SGE',
        data: { breadcrumb: 'Niveles Económicos' },
      },
      {
        path: 'grades-sections',
        children: [
          {
            path: '',
            component: GradesSectionsComponent,
            title: 'Grados y Secciones | ELOHIM SGE',
            data: { breadcrumb: 'Grados y Secciones' },
          }
        ]
      },
      {
        path: 'school',
        canActivate: [roleGuard],
        data: { breadcrumb: 'Datos de la Institución', roles: [UserRoleType.SUPER_ADMIN] },
        component: SchoolComponent,
        title: 'Datos Institucionales | ELOHIM SGE',
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { breadcrumb: 'Gestión de Usuarios', roles: [UserRoleType.SUPER_ADMIN] },
        children: [
          {
            path: '',
            component: UsersComponent,
            title: 'Gestión de Usuarios | ELOHIM SGE',
            data: { breadcrumb: 'Gestión de Usuarios', mode: 'list' },
          },
          {
            path: 'create',
            component: UsersComponent,
            title: 'Crear Usuario | ELOHIM SGE',
            data: { breadcrumb: 'Crear Usuario', mode: 'create' },
          },
          {
            path: 'edit/:id',
            component: UsersComponent,
            title: 'Editar Usuario | ELOHIM SGE',
            data: { breadcrumb: 'Editar Usuario', mode: 'edit' },
          },
          {
            path: 'view/:id',
            component: UsersComponent,
            title: 'Ver Usuario | ELOHIM SGE',
            data: { breadcrumb: 'Ver Usuario', mode: 'view' },
          }
        ]
      },
      {
        path: 'employees',
        data: { breadcrumb: 'Gestión de Empleados' },
        children: [
          {
            path: '',
            component: EmployeesComponent,
            title: 'Gestión de Empleados | ELOHIM SGE',
            data: { breadcrumb: 'Gestión de Empleados', mode: 'list' },
          },
          {
            path: 'create',
            component: EmployeesComponent,
            title: 'Crear Empleado | ELOHIM SGE',
            data: { breadcrumb: 'Crear Empleado', mode: 'create' },
          },
          {
            path: 'edit/:id',
            component: EmployeesComponent,
            title: 'Editar Empleado | ELOHIM SGE',
            data: { breadcrumb: 'Editar Empleado', mode: 'edit' },
          },
          {
            path: 'view/:id',
            component: EmployeesComponent,
            title: 'Ver Empleado | ELOHIM SGE',
            data: { breadcrumb: 'Ver Empleado', mode: 'view' },
          }
        ],
      },
      {
        path: 'students',
        data: { breadcrumb: 'Gestión de Estudiantes' },
        children: [
          {
            path: '',
            component: StudentsComponent,
            title: 'Gestión de Estudiantes | ELOHIM SGE',
            data: { breadcrumb: 'Gestión de Estudiantes', mode: 'list' },
          },
          {
            path: 'create',
            component: StudentsComponent,
            title: 'Registrar Estudiante | ELOHIM SGE',
            data: { breadcrumb: 'Registrar Estudiante', mode: 'create' },
          },
          {
            path: 'edit/:id',
            component: StudentsComponent,
            title: 'Editar Estudiante | ELOHIM SGE',
            data: { breadcrumb: 'Editar Estudiante', mode: 'edit' },
          },
          {
            path: 'view/:id',
            component: StudentsComponent,
            title: 'Ver Estudiante | ELOHIM SGE',
            data: { breadcrumb: 'Ver Estudiante', mode: 'view' },
          }
        ],
      }
    ]
  },
  // auth pages
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  // error pages
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
];
