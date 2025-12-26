import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { ModalService } from '../../shared/services/modal.service';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    EmployeeTableComponent,
    ModalComponent,
    EmployeeFormComponent,
  ],
  templateUrl: './employees.component.html',
  styles: ``
})
export class EmployeesComponent {

  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

}
