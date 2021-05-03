import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() stones: Stone[] = [];
  @Input() stoneSize: number;

  constructor() {}

  ngOnInit(): void {}
}
