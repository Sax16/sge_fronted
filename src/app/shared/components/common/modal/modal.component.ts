import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  input,
  output,
  effect,
  inject,
  DestroyRef,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [
    CommonModule,
  ],
  templateUrl: './modal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {

  readonly isOpen = input(false);
  readonly className = input('');
  readonly showCloseButton = input(true);
  readonly isFullscreen = input(false);

  readonly close = output<void>();

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.document.body.style.overflow = 'hidden';
      } else {
        this.document.body.style.overflow = 'unset';
      }
    });

    this.destroyRef.onDestroy(() => {
      this.document.body.style.overflow = 'unset';
    });
  }

  onBackdropClick(event: MouseEvent) {
    if (!this.isFullscreen()) {
      this.close.emit();
    }
  }

  onContentClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close.emit();
    }
  }
}
