import { Component, inject ,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIResponse, Customer, IStation, ITrain, Search } from '../../model/train';
import { TrainService } from '../../service/train.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [DatePipe,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{

  activatedRoute = inject(ActivatedRoute);
  tarinerService= inject(TrainService);
  searchData: Search = new Search();
  trainList: ITrain[] = [];
  stationList: IStation[]= [];
  selectedTrain?: ITrain;
  passenger: any = {
    "passengerName": "", 
    "age": "" 
  }
  passengerList: any[]=[];
  loagedUserData: Customer = new Customer();

  constructor(){
    const localData = localStorage.getItem('trainApp');
    if(localData != null) {
      this.loagedUserData = JSON.parse(localData)
    }
    this.activatedRoute.params.subscribe((res:any)=>{
      debugger;
      this.searchData.fromStationId =  res.fromStationId;
      this.searchData.toStationId =  res.toStationId;
      this.searchData.dateOfTravel =  res.dateOfTravel;
      this.getSearchTrains()
    })
  }

  ngOnInit(): void {
    this.loadAllStattion();
  }

  bookTicket() {
    debugger;
    const bookingObj = {
      "bookingId": 0,
      "trainId":  this.selectedTrain?.trainId,
      "passengerId": this.loagedUserData.passengerID,
      "travelDate": this.searchData.dateOfTravel,
      "bookingDate": new Date(),
      "totalSeats": 0,
      "TrainAppBookingPassengers":  [] as any
    };
    bookingObj.TrainAppBookingPassengers = this.passengerList;
    bookingObj.totalSeats = this.passengerList.length;
    this.tarinerService.bookTrain(bookingObj).subscribe((re:APIResponse)=>{
      if(re.result) {
        alert("Ticket Booked Success")
      } else {
        alert(re.message)
      }
    })

  }

  addPassenger() {
    const strObj =  JSON.stringify(this.passenger);
    const parseObj = JSON.parse(strObj);
    this.passengerList.push(parseObj);
  }

  loadAllStattion() {
    this.tarinerService.getAllStations().subscribe((res:any)=>{
      this.stationList =  res.data;
    })
  }
  getSearchTrains() {
    this.tarinerService.getTrainsSerach(this.searchData.fromStationId, this.searchData.toStationId,this.searchData.dateOfTravel).subscribe((res:any)=>{
      debugger;
      this.trainList =  res.data;
    })
  }

  open(train: ITrain) {
    this.selectedTrain =  train;
    const model =  document.getElementById("myBookModal");
    if(model != null) {
      model.style.display = 'block'
    }
  }
  close() {
    const model =  document.getElementById("myBookModal");
    if(model != null) {
      model.style.display = 'none'
    }
  }
}
