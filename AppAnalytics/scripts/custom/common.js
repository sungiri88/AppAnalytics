var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var formatDate = function(value)
{
    var formattedDate = new Date(value);
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    return m + "/" + d + "/" + y;
}

var chartOptionsBase = {
    chartType: null,
    renderTo: null,
    plotStacking: null,
    plotDataLabelsEnabled: false,
    dataLabelsEnabled: false,
    tooltipHeaderFormat: null,
    tooltipPointFormat: null,
    tooltipData: null,
    chartTitleText: null,
    yAxisMultipleAxes: false,
    yAxisData: null,
    yAxisTickInterval: null,
    yAxisTitleText: null,
    xAxisTitleText: null,
    yAxisMin: null,
    yAxisMax: null,
    xAxisLabelRotation: 0,
    yAxisLabelsFormat: null,
    yAxisStackLabelsEnabled: false,
    xAxisCategory: null,
    credits: {
        enabled: false
    },
    seriesData: [{
        color: null,
        name: null,
        data: []
    }],
    drilldownSeries: [{
        id: null,
        name: null,
        data: []
    }]
};

var renderCharts = function (chartOptions, chartType) {

    var options = {
        chart: {
            renderTo: null,
            type: 'line',
            zoomType: null,
        },
        lang: {
            loading: 'Loading...',
            noData: 'No data to display'

        },
        rangeSelector: {
            allButtonsEnabled: true,
            selected: 2
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [],
            labels: {
                rotation: 0
            },
            title: {
                text: 'Kit Names',
            }
        },
        tooltip: {


        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                }
            },
            line: {
                dataLabels: {
                    enabled: false
                }
            },
            column: {
                stacking: null,
                distance: -50,
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {

                        textShadow: '1px 1px 2px black'
                    },
                    //groupPadding: 5,
                    formatter: function () {
                        //console.log(this);
                        if (this.y != '0') {
                            return this.y;
                        } else {
                            return null;
                        }
                    }
                }

            },
            bar: {
                stacking: 'normal',
                distance: -50,
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {

                        textShadow: '0 0 2px black'
                    },
                    //groupPadding: 5,
                    formatter: function () {
                        //console.log(this);
                        if (this.y != '0') {
                            return this.y;
                        } else {
                            return null;
                        }
                    }
                }

            }
        },
        credits: false,
        yAxis: {
            labels: {
                format: null
            },
            title: {
                text: '',
            },
            min: 0,
            max: 100,
            tickInterval: null,
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'grey'
                }
            }
        },
        series: [{
            color: 'red',
            name: null,
            data: []
        }],
        drilldown: {
            activeDataLabelStyle: {
                color: 'white',
                textShadow: '0 0 2px black, 0 0 2px black'
            },
            series: [{
                id: null,
                name: null,
                data: []
            }]
        }

    };
    options.chart.renderTo = chartOptions.renderTo;
    options.chart.zoomType = 'x';
    options.title.text = chartOptions.chartTitleText || null;
    options.xAxis.title.text = chartOptions.xAxisTitleText;
    options.xAxis.labels.rotation = chartOptions.xAxisLabelRotation;
    options.xAxis.categories = chartOptions.xAxisCategory;
    if (chartOptions.yAxisMultipleAxes) {
        options.yAxis = chartOptions.yAxisData;
    }
    else {
        options.yAxis.title.text = chartOptions.yAxisTitleText;
        options.yAxis.min = chartOptions.yAxisMin;
        options.yAxis.max = chartOptions.yAxisMax;
        options.yAxis.labels.format = chartOptions.yAxisLabelsFormat;
        options.yAxis.stackLabels.enabled = chartOptions.yAxisStackLabels || false;
        options.yAxis.tickInterval = chartOptions.yAxisTickInterval;
    }
    options.series = chartOptions.seriesData;
    options.chart.type = chartOptions.chartType || 'line';
    if (chartOptions.tooltipData)
        options.tooltip = $.extend(true, {}, chartOptions.tooltipData);
    //if (chartOptions.chartType == 'column') {
    //    console.log(this);
    //}
    options.plotOptions.column.stacking = chartOptions.plotStacking || null;
    options.drilldown.series = chartOptions.drilldownSeries;
    options.plotOptions.column.dataLabels.enabled = chartOptions.dataLabelsEnabled || false;
    options.plotOptions.bar.dataLabels.enabled = chartOptions.dataLabelsEnabled || false;
    options.plotOptions.pie.dataLabels.enabled = chartOptions.dataLabelsEnabled || false;
    options.plotOptions.line.dataLabels.enabled = chartOptions.dataLabelsEnabled || false;
    var chartM2 = new Highcharts.Chart(options);
    return false;
};