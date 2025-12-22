import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { EmployeeTableComponent } from '../../shared/components/tables/employee-table/employee-table.component';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    EmployeeTableComponent,
  ],
  templateUrl: './employees.component.html',
  styles: ``
})
export class EmployeesComponent {

}
