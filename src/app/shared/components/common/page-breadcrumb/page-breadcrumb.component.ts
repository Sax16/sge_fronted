import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { BreadcrumbItem } from '../../../models/breadcrumb.model';

/**
 * Page Breadcrumb Component
 * Implements Single Responsibility Principle (SRP) - Displays breadcrumb navigation only
 * Implements Dependency Inversion Principle (DIP) - Depends on BreadcrumbService abstraction
 */
@Component({
  selector: 'app-page-breadcrumb',
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './page-breadcrumb.component.html',
  styles: ``
})
export class PageBreadcrumbComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  breadcrumbs: BreadcrumbItem[] = [];
  pageTitle = '';

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.subscribeToBreadcrumbs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribe to breadcrumb changes
   */
  private subscribeToBreadcrumbs(): void {
    this.breadcrumbService.breadcrumbs$
      .pipe(takeUntil(this.destroy$))
      .subscribe((breadcrumbs) => this.handleBreadcrumbsUpdate(breadcrumbs));
  }

  /**
   * Handle breadcrumbs update
   * @param breadcrumbs - Updated breadcrumbs
   */
  private handleBreadcrumbsUpdate(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbs = breadcrumbs;
    this.updatePageTitle(breadcrumbs);
  }

  /**
   * Update page title from last active breadcrumb
   * @param breadcrumbs - Current breadcrumbs
   */
  private updatePageTitle(breadcrumbs: BreadcrumbItem[]): void {
    const activeBreadcrumb = this.findActiveBreadcrumb(breadcrumbs);
    this.pageTitle = activeBreadcrumb?.label || '';
  }

  /**
   * Find active breadcrumb
   * @param breadcrumbs - Breadcrumb items
   * @returns Active breadcrumb or undefined
   */
  private findActiveBreadcrumb(breadcrumbs: BreadcrumbItem[]): BreadcrumbItem | undefined {
    return breadcrumbs.find((item) => item.isActive);
  }

  /**
   * Handle breadcrumb click
   * @param item - Clicked breadcrumb item
   */
  onBreadcrumbClick(item: BreadcrumbItem): void {
    // Early return if not clickable
    if (!this.isClickable(item)) {
      return;
    }

    this.breadcrumbService.navigateTo(item);
  }

  /**
   * Check if breadcrumb is clickable
   * @param item - Breadcrumb item
   * @returns true if clickable, false otherwise
   */
  isClickable(item: BreadcrumbItem): boolean {
    return this.breadcrumbService.isClickable(item);
  }

  /**
   * Check if should show breadcrumbs navigation
   * @returns true if should show, false otherwise
   */
  shouldShowBreadcrumbs(): boolean {
    return this.breadcrumbService.shouldShowBreadcrumbs();
  }

  /**
   * Get breadcrumb items except the last (active) one
   * @returns Clickable breadcrumb items
   */
  getClickableBreadcrumbs(): BreadcrumbItem[] {
    return this.breadcrumbs.filter((item) => !item.isActive);
  }

  /**
   * Get the last (active) breadcrumb
   * @returns Active breadcrumb or undefined
   */
  getActiveBreadcrumb(): BreadcrumbItem | undefined {
    return this.findActiveBreadcrumb(this.breadcrumbs);
  }
}
