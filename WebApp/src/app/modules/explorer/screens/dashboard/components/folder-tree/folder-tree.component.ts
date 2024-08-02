import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MediaFolder } from 'src/app/core/models/media.types';

@Component({
  selector: 'folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
  standalone: true,
  imports: [
    MatMenuModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class FolderTreeComponent implements OnInit {

  folderStack = input<MediaFolder[]>([])
  currentFolderName = input<string>()

  onFolderClicked = output<MediaFolder | undefined>()

  constructor() { }

  ngOnInit() {
  }

  folderClicked(item?: MediaFolder) {
    this.onFolderClicked.emit(item)
  }

  getFolderTree() {
    const copy = [...this.folderStack()]
    copy.pop();
    return copy
  }
}

