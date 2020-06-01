import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  public teamName: string;
  constructor() { }

  ngOnInit(): void {
    this.teamName = this.getTeamName();
  }

  public getTeamName() {
    return "Bluescreen Bandits";
  }

}
