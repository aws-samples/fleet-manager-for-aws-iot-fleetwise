import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";

require("highcharts/modules/exporting")(Highcharts);

const options = {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Battery State of Health'
    },
    subtitle: {
        text: 'Battery SoH over time (Fleet)'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        title: {
            text: 'SoH (%)'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
    series: [{
        name: 'Fleet',
        data: [
            98, 97.2, 96.1, 94.3, 92.8, 92.1, 91.4, 90.2, 90.1, 89.3,
            89.2, 89.1
        ]
    }, {
        name: 'Expected Avg',
        data: [
            96.3, 92.4, 91.1, 90.3, 89.3, 88.1, 85.3, 84.1, 83.5, 82.9, 81.4, 80.1
        ]
    }]
};


const BatterySOHChart = () => {
  return (
    <figure class="highcharts-figure">
    <div class="highcharts-light">
        <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
    </figure>
  );
};

export default BatterySOHChart;
