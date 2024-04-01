import { Component, OnInit } from '@angular/core';
import { Root } from '@amcharts/amcharts5';
import { Circle, Bullet, Tooltip, Scrollbar } from '@amcharts/amcharts5';
import { XYChart } from '@amcharts/amcharts5/.internal/charts/xy/XYChart';
import { XYCursor } from '@amcharts/amcharts5/.internal/charts/xy/XYCursor';
import { DateAxis } from '@amcharts/amcharts5/.internal/charts/xy/axes/DateAxis';
import { LineSeries, ValueAxis } from '@amcharts/amcharts5/xy';
import * as am5xy from '@amcharts/amcharts5/xy';

@Component({
  selector: 'app-label-chart',
  template: ` <div id="chartdiv" style="width: 100%; height: 500px;"></div> `,
})
export class LabelChartComponent implements OnInit {
  ngOnInit(): void {
    let root = Root.new('chartdiv');
    let chart = root.container.children.push(
      XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        paddingLeft: 0,
      })
    );
    let cursor = chart.set(
      'cursor',
      XYCursor.new(root, {
        behavior: 'zoomX',
      })
    );
    cursor.lineY.set('visible', false);
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let value = 100;

    function generateData() {
      value = Math.round(Math.random() * 10 - 5 + value);
      date.setDate(date.getDate() + 1);
      return {
        date: date.getTime(),
        value: value,
      };
    }

    function generateDatas(count: any) {
      let data = [];
      for (var i = 0; i < count; ++i) {
        data.push(generateData());
      }
      return data;
    }

    let xAxis = chart.xAxes.push(
      DateAxis.new(root, {
        maxDeviation: 0,
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minGridDistance: 200,
          minorLabelsEnabled: true,
        }),
        tooltip: Tooltip.new(root, {}),
      })
    );

    xAxis.set('minorDateFormats', {
      day: 'dd',
      month: 'MM',
    });

    let yAxis = chart.yAxes.push(
      ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    let series = chart.series.push(
      LineSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    series.bullets.push(function () {
      let bulletCircle = Circle.new(root, {
        radius: 5,
        fill: series.get('fill'),
      });
      return Bullet.new(root, {
        sprite: bulletCircle,
      });
    });

    chart.set(
      'scrollbarX',
      Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    let data = generateDatas(30);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);
  }
}
