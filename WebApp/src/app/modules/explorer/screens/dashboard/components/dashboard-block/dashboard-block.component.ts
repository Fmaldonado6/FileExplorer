import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-block',
  templateUrl: './dashboard-block.component.html',
  styleUrls: ['./dashboard-block.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class DashboardBlockComponent implements OnInit {

  title = input<string>()
  subtitle = input<string>()
  count = input<number>(0)
  icon = input<string>()
  color = input<string>()
  tooltipTitle = input<string>()
  tooltipSummary = input<string>()
  last = input<boolean>(false)

  constructor() { }

  ngOnInit() {
  }

}
