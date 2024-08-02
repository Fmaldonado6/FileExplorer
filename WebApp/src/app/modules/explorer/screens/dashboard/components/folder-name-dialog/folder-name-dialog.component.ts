import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, inject, output, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DialogHeaderComponent } from 'src/app/shared/components/dialog-header/dialog-header.component';

@Component({
  selector: 'app-folder-name-dialog',
  templateUrl: './folder-name-dialog.component.html',
  styleUrls: ['./folder-name-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogActions,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    DialogHeaderComponent
  ]
})
export class FolderNameDialogComponent implements OnInit {

  dialog = inject(MatDialogRef<FolderNameDialogComponent>)

  nameInput = viewChild.required<ElementRef>('nameInput')

  folderName?: string = "Nuevo folder"

  createClicked = output<string>()

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nameInput().nativeElement.focus();
      this.nameInput().nativeElement.select();

    }, 200)
  }

  close() {
    this.dialog.close();
  }


  create() {
    this.createClicked.emit(this.folderName!)
  }

}
