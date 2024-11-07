import React from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting'
import DonutChart from "highcharts-react-official";

require("highcharts/modules/exporting")(Highcharts);

const options = {
    chart: {
        type: 'pie',
        custom: {},
        events: {
            render() {
                const chart = this,
                    series = chart.series[0];
                let customLabel = chart.options.chart.custom.label;

                if (!customLabel) {
                    customLabel = chart.options.chart.custom.label =
                        chart.renderer.label(
                            'Total<br/>' +
                            '<strong>435</strong>'
                        )
                            .css({
                                color: '#000',
                                textAnchor: 'middle'
                            })
                            .add();
                }

                const x = series.center[0] + chart.plotLeft,
                    y = series.center[1] + chart.plotTop -
                    (customLabel.attr('height') / 2);

                customLabel.attr({
                    x,
                    y
                });
                // Set font size based on chart diameter
                customLabel.css({
                    fontSize: `${series.center[2] / 12}px`
                });
            }
        }
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: 'Vehicle Health Status'
    },
    subtitle: {
        text: 'Current state of all fleet vehicles'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 8,
            dataLabels: [{
                enabled: true,
                distance: 20,
                format: '{point.name}'
            }, {
                enabled: true,
                distance: -15,
                format: '{point.percentage:.0f}%',
                style: {
                    fontSize: '0.9em'
                }
            }],
            showInLegend: true
        }
    },
    series: [{
        name: 'Registrations',
        colorByPoint: true,
        innerSize: '75%',
        data: [{
            name: 'Overdue',
            color: '#1399FF',
            y: 23.9
        }, {
            name: 'Action Now',
            color: '#e2000f',
            y: 12.6
        }, {
            name: 'Up-to-date',
            color: '#25a032',
            y: 37.0
        }, {
            name: 'Action Soon',
            color: '#FF9900',
            y: 26.4
        }]
    }]
};

const FleetStatusChart = () => {
  return (
    <figure class="highcharts-figure">
    <div class="highcharts-light">
        <DonutChart highcharts={Highcharts} options={options} />
    </div>
    </figure>
  );
};

export default FleetStatusChart;
