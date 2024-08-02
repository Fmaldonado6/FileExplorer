import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Component, OnInit, inject, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-snackbar',
  templateUrl: './loading-snackbar.component.html',
  styleUrls: ['./loading-snackbar.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    MatProgressBarModule,
    MatIconModule
  ]
})
export class LoadingSnackbarComponent implements OnInit {
  progress = model(0)

  constructor() { }

  ngOnInit() {
  }

}
