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
  // public chartOptions: Partial<ChartOptions>;
  public activeOptionButton = 'all';
  // public updateOptionsData = {
  //   "1m": {
  //     xaxis: {
  //       min: new Date("28 Jan 2013").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   "6m": {
  //     xaxis: {
  //       min: new Date("27 Sep 2012").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   "1y": {
  //     xaxis: {
  //       min: new Date("27 Feb 2012").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   "1yd": {
  //     xaxis: {
  //       min: new Date("01 Jan 2013").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   all: {
  //     xaxis: {
  //       min: undefined,
  //       max: undefined
  //     }
  //   }
  // };
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
    // annotations: {
    //   yaxis: [
    //     {
    //       y: 30,
    //       borderColor: '#999',
    //       label: {
    //         text: 'Support',
    //         style: {
    //           color: '#fff',
    //           background: '#00E396',
    //         },
    //       },
    //     },
    //   ],
    //   xaxis: [
    //     {
    //       x: new Date('14 Nov 2012').getTime(),
    //       borderColor: '#999',
    //       label: {
    //         text: 'Rally',
    //         style: {
    //           color: '#fff',
    //           background: '#775DD0',
    //         },
    //       },
    //     },
    //   ],
    // },
    dataLabels: {
      enabled: false,
    },
    // markers: {
    //   size: 0,
    // },
    xaxis: {
      type: 'datetime',
      min: new Date('01 Mar 2012').getTime(),
      tickAmount: 6,
    },
    // tooltip: {
    //   x: {
    //     format: 'dd MMM yyyy',
    //   },
    // },
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shadeIntensity: 1,
    //     opacityFrom: 0.7,
    //     opacityTo: 0.9,
    //     stops: [0, 100],
    //   },
    // },
  };
  constructor(private dataservice: CollectionApiService, public dialogRef: MatDialogRef<LineChartsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {}

  ngOnInit(): void {
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

    this.getSaleChart();
    setTimeout(() => {
      this.chart.updateOptions(
        this.updateOptionsData['all'],
        false,
        true,
        true
      );
    }, 500);
  }

  getSaleChart() {
    let url =`api/getSaleChart?collectionId=${this.data.collectionId}`;
    this.dataservice.getTemparory(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.chartData = res.data;

          for (let i = 0; i < this.chartData.length; i++) {
            this.data01.push([
              this.chartData[i].dateTime,
              this.chartData[i].AveragePrice,
              this.chartData[i].Sales,
            ]);
          }
          this.chartOptions.series[0].data = this.data01;
        } else {
          console.log(res.message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public updateOptions(option: any): void {
    this.activeOptionButton = option;
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  }
}
