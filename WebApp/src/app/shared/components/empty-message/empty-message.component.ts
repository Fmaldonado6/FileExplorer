import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'empty-message',
  templateUrl: './empty-message.component.html',
  styleUrls: ['./empty-message.component.scss'],
  standalone:true,
  imports:[
    MatIconModule,
    CommonModule
  ]
})
export class EmptyMessageComponent implements OnInit {

  title = input("Vacío")
  message = input("No hay datos disponibles")

  constructor() { }

  ngOnInit() {
  }

}
