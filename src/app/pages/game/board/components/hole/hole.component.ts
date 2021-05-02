import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss'],
})
export class HoleComponent implements OnInit {
  @Input() size: number;
  @Input() holeImageUrl: string;

  constructor() {}

  ngOnInit(): void {}
}
