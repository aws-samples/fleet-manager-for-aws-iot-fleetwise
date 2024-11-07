import React from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting'
import PieChart from "highcharts-react-official";

require("highcharts/modules/exporting")(Highcharts);

const options = {
  chart: {
      type: 'pie'
  },
  title: {
      text: 'Fleet Driver Scores'
  },
  tooltip: {
      valueSuffix: '%'
  },
  navigation: {
    buttonOptions: {
        enabled: true
    }
  },
  subtitle: {
      text: 'Breakdown of driver scores across the fleet'
  },
  plotOptions: {
      series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
              enabled: true,
              distance: 20
          }, {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                  fontSize: '1.2em',
                  textOutline: 'none',
                  opacity: 0.7
              },
              filter: {
                  operator: '>',
                  property: 'percentage',
                  value: 10
              }
          }]
      }
  },
  series: [
      {
          name: 'Percentage',
          data: [
            {
                name: 'Average',
                color: '#1399FF',
                y: 55.02
            },
            {
                name: 'Excellent',
                sliced: true,
                selected: true,
                color: '#25a032',
                y: 26.71
            },
            {
                name: 'Needs Improvement',
                color: '#FF9900',
                y: 1.09
            },
            {
                name: 'Below Average',
                color: '#F4B400',
                y: 15.5
            },
            {
                name: 'Risky',
                color: '#e2000f',
                y: 1.68
            }
        ]
      }
  ]
};


const DriverScoreChart = () => {
  return (
    <figure class="highcharts-figure">
    <div class="highcharts-light">
        <PieChart highcharts={Highcharts} options={options} />
    </div>
    </figure>
  );
};

export default DriverScoreChart;
