import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-walking-skeleton',
  templateUrl: './walking-skeleton.component.html',
  styleUrls: ['./walking-skeleton.component.css']
})
export class WalkingSkeletonComponent implements OnInit {
  
  output:number;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    let btnTmp = document.getElementById("btn0");
    btnTmp.addEventListener("click", (e:Event) => this.count());

    btnTmp = document.getElementById("btn1");
    btnTmp.addEventListener("click", (e:Event) => this.reset());
  }

  count()
  {
    this.apiService.fetchDataCount().subscribe((data: any[])=>{
      //console.log(data);
      this.output = data[0];
    })
  }

  reset()
  {
    this.output = 0; 
  }

}
