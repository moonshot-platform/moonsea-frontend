import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke,
} from 'ng-apexcharts';
import { CollectionApiService } from 'src/app/services/collection-api.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
};
@Component({
  selector: 'app-line-charts',
  templateUrl: './line-charts.component.html',
  styleUrls: ['./line-charts.component.scss'],
})
export class LineChartsComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart: ChartComponent;
  public activeOptionButton = 'all';
 
  public updateOptionsData = {};
  data01: any = [];
  chartData: any = [];

  ///*****
  // Chart Initialization
  //******* */
  chartOptions: Partial<ChartOptions> = {
    series: [
      {
        data: [],
      },
    ],
    chart: {
      type: 'area',
      height: 350,
    },
    
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      min: new Date('01 Mar 2012').getTime(),
      tickAmount: 6,
    },
  };
  constructor(private dataservice: CollectionApiService, public dialogRef: MatDialogRef<LineChartsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {}

  ngOnInit(): void {
    console.log(this.data);
    
    var ago1Month = new Date();
    ago1Month.setMonth(ago1Month.getMonth() - 1);

    var ago6Month = new Date();
    ago6Month.setMonth(ago6Month.getMonth() - 6);

    var ago1year = new Date();
    ago1year.setMonth(ago1year.getMonth() - 12);

    this.updateOptionsData = {
      '1m': {
        xaxis: {
          min: new Date(ago1Month).getTime(),
          max: new Date().getTime(),
        },
      },
      '6m': {
        xaxis: {
          min: new Date(ago6Month).getTime(),
          max: new Date().getTime(),
        },
      },
      '1y': {
        xaxis: {
          min: new Date(ago1year).getTime(),
          max: new Date().getTime(),
        },
      },
      all: {
        xaxis: {
          min: undefined,
          max: undefined,
        },
      },
    };

    this.chartOptions.series[0].data = this.data.arr;
    setTimeout(() => {
      this.chart.updateOptions(
        this.updateOptionsData['all'],
        false,
        true,
        true
      );
    }, 500);
  }

  

  public updateOptions(option: any): void {
    this.activeOptionButton = option;
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  }
}
