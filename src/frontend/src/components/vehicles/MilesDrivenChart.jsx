import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";

require("highcharts/modules/exporting")(Highcharts);

const options = {
    chart: {
        zooming: {
            type: 'x'
        }
    },
    title: {
        text: 'Miles driven per day over time',
        align: 'left'
    },
    subtitle: {
        text: document.ontouchstart === undefined ?
            'Click and drag in the plot area to zoom in' :
            'Pinch the chart to zoom in',
        align: 'left'
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: {
            text: 'Miles driven'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        area: {
            marker: {
                radius: 2
            },
            lineWidth: 1,
            color: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, 'rgb(199, 113, 243)'],
                    [0.7, 'rgb(76, 175, 254)']
                ]
            },
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },

    series: [{
        type: 'area',
        name: 'Miles driven per day',
        data: [
            [1639526400000, 3432],
            [1639612800000, 3245],
            [1639699200000, 3526],
            [1639958400000, 3452],
            [1640044800000, 3323],
            [1640131200000, 3103],
            [1640217600000, 2405],
            [1640304000000, 2143],
            [1640563200000, 2834],
            [1640649600000, 3242],
            [1640736000000, 5325],
            [1640822400000, 4803],
            [1640908800000, 4320]
          ]
    }]
};

const MilesDrivenChart = () => {
  return (
    <figure class="highcharts-figure">
    <div class="highcharts-light">
        <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
    </figure>
  );
};

export default MilesDrivenChart;
