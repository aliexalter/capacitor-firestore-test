import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonBadge, IonButton } from '@ionic/angular/standalone';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { addMonths, addYears, format } from 'date-fns';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon, NgFor, IonBadge, NgIf],
})
export class HomePage {

  public s_year:number = 0; //use for UI
  public s_month:string = ''; //use for UI
  private currentDate = new Date();
  public entries:any[] = [];

  constructor() {}

  async ngOnInit() {
    this.s_year = this.currentDate.getFullYear();
    this.s_month = format(this.currentDate, 'MMMM');
  }

  async ionViewWillEnter() {
      await this.loadCurrentMonthData();
  };

  async prevYear() {
      this.currentDate = addYears(this.currentDate, -1);
      this.s_year = this.currentDate.getFullYear();
      await this.loadCurrentMonthData();
  };
  async nextYear() {
      this.currentDate = addYears(this.currentDate, +1);
      this.s_year = this.currentDate.getFullYear();
      await this.loadCurrentMonthData();
  };
  async prevMonth() {
      this.currentDate = addMonths(this.currentDate, -1);
      this.s_month = format(this.currentDate, 'MMMM');
      await this.loadCurrentMonthData();
  };
  async nextMonth() {
      this.currentDate = addMonths(this.currentDate, +1);
      this.s_month = format(this.currentDate, 'MMMM');
      await this.loadCurrentMonthData();
  };
  async loadCurrentMonthData() {
      console.log("loadCurrentMonthData", this.currentDate, format(this.currentDate, "yyyy"), format(this.currentDate, "MM"));
      this.entries = [];
        const monthData = await FirebaseFirestore.getCollection({
          reference: 'users/docs/entries',
          compositeFilter:{
            type: 'and',
            queryConstraints: [
              {
                type: 'where',
                fieldPath: 'Year',
                opStr: '==',
                value: format(this.currentDate, "yyyy")
              },
              {
                type: 'where',
                fieldPath: 'Month',
                opStr: '==',
                value: format(this.currentDate, "MM")
              }
            ]
          }
        });
        if(monthData.snapshots.length > 0)
        {
          monthData.snapshots.forEach((doc:any) => {
            let entry:any = doc.data;
            entry.id = doc.id;
            this.entries.push(entry);
          });
        }
  };

  async addDocument() {
    await FirebaseFirestore.addDocument({
      reference: 'users/docs/entries',
      data: {
        Year: format(this.currentDate, "yyyy"),
        Month: format(this.currentDate, "MM"),
        Day: format(this.currentDate, "dd"),
        Title: "Test",
        Description: "Test Description"
      }
    });
    await this.loadCurrentMonthData();
  }

}
