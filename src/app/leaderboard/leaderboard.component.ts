import {
  Component,
  OnInit,
  Inject,
  NgZone,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { SharedService } from '../core/services/shared.service';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { BehaviorSubject } from 'rxjs';
import uniq from 'lodash-es/uniq';
import isEmpty from 'lodash-es/isEmpty';
import { LocalStorageService } from 'ngx-webstorage';
import { fadeInAnimation } from '../core/_animations/animations';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  animations: [fadeInAnimation],
})
export class LeaderboardComponent implements OnInit, AfterViewInit {
  private root: am5.Root | undefined;

  channel = new BroadcastChannel('channel');

  d = new BehaviorSubject<Object>({});
  newData = this.d.asObservable();

  allData = {
    'Round 1': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 2': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 3': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 4': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 5': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 6': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 7': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 8': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
    'Round 9': {
      'Team 1': Math.floor(Math.random() * 15),
      'Team 2': Math.floor(Math.random() * 15),
      'Team 3': Math.floor(Math.random() * 15),
      'Team 4': Math.floor(Math.random() * 15),
      'Team 5': Math.floor(Math.random() * 15),
    },
  };

  testData = {};

  chartCreated = false;
  showSplashScreen = true;
  round = 1;

  constructor(
    private storage: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone
  ) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    this.channel.addEventListener('message', (event) => {
      console.log(uniq(event.data));

      this.storage.store('scores', uniq(event.data));
      this.showSplashScreen = false;
      if (!this.chartCreated) {
        setTimeout(() => {
          this.createChart();
          this.chartCreated = true;
        }, 1000);
      }

      let i = 1;
  
      const holder = {};
      event.data.forEach((e) => {
        holder[`Round ${i}`] = {};

        // console.log(Object.keys(e));
        Object.keys(e).forEach((x) => {
          if (i > 1) {
            holder[`Round ${i}`][x] =
              holder[`Round ${i - 1}`][x] + event.data[i - 1][x];
          } else {
            holder[`Round ${i}`][x] = event.data[i - 1][x];
          }
        });

        i++;
      });

      // console.log(holder);
      this.testData = holder;

      this.d.next(holder);
    });
  }

  ngAfterViewInit() {
    // Chart code goes in here
  }

  createChart() {
    this.browserOnly(() => {
      let self = this;
      let root = am5.Root.new('chartdiv');

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: 'none',
          wheelY: 'none',
        })
      );

      var stepDuration = 2000;

      // We don't want zoom-out button to appear while animating, so we hide it at all
      chart.zoomOutButton.set('forceHidden', true);

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var yRenderer = am5xy.AxisRendererY.new(root, {
        minGridDistance: 20,
        inversed: true,
      });
      // hide grid
      yRenderer.grid.template.set('visible', false);

      var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0,
          categoryField: 'network',
          renderer: yRenderer,
          visible: false,
        })
      );

      var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 20,
        // inversed: false,
      });
      // hide grid
      xRenderer.grid.template.set('visible', false);

      var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 0,
          strictMinMax: true,
          // extraMax: 0.1,
          renderer: xRenderer,
          visible: false,
        })
      );

      xAxis.set('interpolationDuration', stepDuration / 10);
      xAxis.set('interpolationEasing', am5.ease.linear);

      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: 'value',
          categoryYField: 'network',
          sequencedInterpolation: true,
          stacked: true,
        })
      );

      // Rounded corners for columns
      series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });

      // Make each column to be of a different color
      series.columns.template.adapters.add(
        'fill',
        function (fill, target: any) {
          return chart.get('colors').getIndex(series.columns.indexOf(target));
        }
      );

      series.columns.template.adapters.add(
        'stroke',
        function (stroke, target: any) {
          return chart.get('colors').getIndex(series.columns.indexOf(target));
        }
      );

      // Add label bullet
      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          // locationX: 1,
          // locationY: 0.5,
          sprite: am5.Label.new(root, {
            text: '{categoryY}: [bold]{valueX}[/]',
            fill: root.interfaceColors.get('alternativeText'),
            centerX: am5.percent(50),
            centerY: am5.percent(50),
            populateText: true,
            fontSize: '20px',
            fontFamily: 'Poppins',
          }),
        });
      });

      // series.bullets.push(function() {
      //   return am5.Bullet.new(root, {
      //     locationX: 1,
      //     locationY: 0.5,
      //     sprite: am5.Label.new(root, {
      //       centerY: am5.p50,
      //       text: "{value}",
      //       populateText: true
      //     })
      //   });
      // });

      // var label = chart.plotContainer.children.push(
      //   am5.Label.new(root, {
      //     text: 'Round 1',
      //     fontSize: '8em',
      //     opacity: 0.2,
      //     x: am5.p100,
      //     y: am5.p100,
      //     centerY: am5.p100,
      //     centerX: am5.p100,
      //   })
      // );

      // Get series item by category
      function getSeriesItem(category) {
        for (var i = 0; i < series.dataItems.length; i++) {
          var dataItem = series.dataItems[i];
          if (dataItem.get('categoryY') == category) {
            return dataItem;
          }
        }
      }

      // Axis sorting
      function sortCategoryAxis() {
        // sort by value
        series.dataItems.sort(function (x, y) {
          return y.get('valueX') - x.get('valueX'); // descending
          //return x.get("valueX") - y.get("valueX"); // ascending
        });

        // go through each axis item
        am5.array.each(yAxis.dataItems, function (dataItem) {
          // get corresponding series item
          var seriesDataItem = getSeriesItem(dataItem.get('category'));

          if (seriesDataItem) {
            // get index of series data item
            var index = series.dataItems.indexOf(seriesDataItem);
            // calculate delta position
            var deltaPosition =
              (index - dataItem.get('index', 0)) / series.dataItems.length;
            // set index to be the same as series data item index
            if (dataItem.get('index') != index) {
              dataItem.set('index', index);
              // set deltaPosition instanlty
              dataItem.set('deltaPosition', -deltaPosition);
              // animate delta position to 0
              dataItem.animate({
                key: 'deltaPosition',
                to: 0,
                duration: stepDuration / 2,
                easing: am5.ease.out(am5.ease.cubic),
              });
            }
          }
        });
        // sort axis items by index.
        // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
        yAxis.dataItems.sort(function (x, y) {
          return x.get('index') - y.get('index');
        });
      }

      var year = 1;

      this.newData.subscribe((data: any) => {
        this.round = year;
        console.log('year: ', year);
        console.log(data);
        if (!isEmpty(data)) {
          switch (year) {
            case 1:
              setInitialData();
              sortCategoryAxis();

              break;
            default:
              updateData();
              setTimeout(() => {
                sortCategoryAxis();
              }, 2000);

              year++;
          }
        }
      });

      function setInitialData() {
        console.log('set initial data: ', year);
        var d = self.testData['Round ' + year];

        // console.log(self.testData);
        // var d = self.testData[year - 1];

        // console.log(d);
        for (var n in d) {
          series.data.push({ network: n, value: d[n] });
          yAxis.data.push({ network: n });
        }
        year = 2;
      }

      function updateData() {
        console.log('update data: ', year);
        var itemsWithNonZero = 0;

        if (self.testData['Round ' + year]) {
          // label.set('text', 'Round ' + year.toString());

          am5.array.each(series.dataItems, function (dataItem) {
            var category = dataItem.get('categoryY');
            var value = self.testData['Round ' + year][category];

            if (value > 0) {
              itemsWithNonZero++;
            }

            dataItem.animate({
              key: 'valueX',
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear,
            });
            dataItem.animate({
              key: 'valueXWorking',
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear,
            });
          });

          yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
        }
      }

      series.appear(1000);
      chart.appear(1000, 100);
      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
