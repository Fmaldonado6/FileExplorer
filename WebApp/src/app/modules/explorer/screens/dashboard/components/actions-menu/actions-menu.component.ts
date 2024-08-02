import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MediaResource } from 'src/app/core/mapper/resources/media.resource';
import { MediaFolder } from 'src/app/core/models/media.types';

@Component({
  selector: 'actions-menu',
  templateUrl: './actions-menu.component.html',
  styleUrls: ['./actions-menu.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule
  ]
})
export class ActionsMenuComponent implements OnInit {

  filesToMove = input<MediaFolder[]>([])
  selectedRows = input<Map<string, MediaResource>>()

  onMoveFilesClicked = output();
  onMoveFilesConfirm = output();
  onCancelClicked = output();

  constructor() { }

  ngOnInit() {
  }

  moveFilesConfirm() {
    this.onMoveFilesConfirm.emit();
  }
  moveFilesClicked() {
    this.onMoveFilesClicked.emit();
  }
  cancelMove() {
    this.onCancelClicked.emit();
  }
}
