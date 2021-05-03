import { Component, OnInit } from '@angular/core';
import { GameMode } from 'src/app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  GameMode = GameMode;

  constructor() {}

  ngOnInit(): void {}

  public getGameModeUrl(mode: string): string {
    return `/game/mode=${mode}`;
  }
}
