import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
//import last2WeeksFile from '../../files/last2weeks.json';

@Component({
  selector: 'app-walking-skeleton',
  templateUrl: './walking-skeleton.component.html',
  styleUrls: ['./walking-skeleton.component.css']
})
export class WalkingSkeletonComponent implements OnInit {
  
  output:number;
  //arrLast2Weeks:string[];

  public last2Weeks:{_id:string,
                    consequence: {summary:string, description:string},
                    section:string,
                    name:string,
                    streets:string [],
                    validities: {timeFrom:string, timeTo:string, visible:boolean}[],
                    location: {type:string, coordinates:number []},
                    property:string [],
                    geometry: {type:string, coordinates: number[][]}
                    }[]; //= last2WeeksFile;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    let btnTmp = document.getElementById("btn0");
    btnTmp.addEventListener("click", (e:Event) => this.count());

    btnTmp = document.getElementById("btn1");
    btnTmp.addEventListener("click", (e:Event) => this.reset());

    //console.log(last2WeeksFile);
    this.showLast2Weeks();

  }

  count()
  {
    this.apiService.fetchLast2Weeks().subscribe((data: number)=>{
    //console.log(data);
    this.output = data;
    })
  }

  showLast2Weeks()
  {  
    this.apiService.fetchDataCount().subscribe((data: 
    {_id:string,
    consequence: {summary:string, description:string},
    section:string,
    name:string,
    streets:string [],
    validities: {timeFrom:string, timeTo:string, visible:boolean}[],
    location: {type:string, coordinates:number []},
    property:string [],
    geometry: {type:string, coordinates: number[][]}
    }[])=>{
    this.last2Weeks = data;
    })
  }

  reset()
  {
    this.output = 0; 
  }



}
