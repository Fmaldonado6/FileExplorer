import { CommonModule } from '@angular/common';
import { Component, OnInit, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule
  ]
})
export class DialogHeaderComponent implements OnInit {

  showBackButton = input(false);
  showCloseButton = input(true);

  title = input<string | null | undefined>("Título");
  subtitle = input<string | null | undefined>("Subtítulo");

  onCloseClicked = output();
  onBackClicked = output();

  constructor() { }

  ngOnInit() {
  }

  closeClicked() {
    this.onCloseClicked.emit();
  }

  backClicked() {
    this.onBackClicked.emit();
  }

}
