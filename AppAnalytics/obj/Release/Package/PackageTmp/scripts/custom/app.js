
$(function () {
    $("#starRating").rateYo({
        rating: 2.51,
        starWidth: "25px",
        readOnly: true

    });
    $("#starRating2").rateYo({
        rating: 3.56,
        starWidth: "25px",
        readOnly: true

    });

    $(".mbrace-apple-icon").click(function () {
        $("#mbrace-apple .hidethis").hide();
        $("#mbrace-apple " + ($(this).attr("data-target")) + "").show();
    });

    $(".mbrace-android-icon").click(function () {
        console.log("clicked");
        $("#mbrace-android .hidethis").hide();
        $("#mbrace-android " + ($(this).attr("data-target")) + "").show();
    });

    $.getJSON('App/GetAppData?AppID=1', function (data) {
        RenderDailyChart(GetDailyData(data, 'Apple'), "AppleDaily");
        RenderMonthlyChart(GetMonthlyData(data, 'Apple'), "AppleMonthly");
        RenderYearlyChart(GetYearlyData(data, 'Apple'), "AppleYearly");
        RenderDailyChart(GetDailyData(data, 'Android'), "AndroidDaily");
        RenderMonthlyChart(GetMonthlyData(data, 'Android'), "AndroidMonthly");
        RenderYearlyChart(GetYearlyData(data, 'Android'), "AndroidYearly");
        if(PublishTable(data, 'Apple', 'applereviews'))
        {
            $('#Apple_applereviews').DataTable({
                "order": [[0, "desc"]],
                "pagingType": "full_numbers"
            });
        }
        if(PublishTable(data, 'Android', 'androidreviews')) {
            $('#Android_androidreviews').DataTable({
                "order": [[0, "desc"]],
                "pagingType": "full_numbers"
            });
        }
    });
   

});

var RenderDailyChart = function (data, divID) {
    var xData = [];
    var yData = [];
    $.each(data, function (key, value) {
        var date = new Date(value[0]);
        xData.push(date.getDate() + '/' + monthNames[date.getMonth()] + '/' + date.getFullYear());
        yData.push(value[1]);
    });
    var chartOptions = $.extend(true, {}, chartOptionsBase);
    chartOptions.chartType = 'line';
    chartOptions.renderTo = divID;
    chartOptions.plotStacking = 'normal'
    chartOptions.yAxisTitleText = 'Rating';
    chartOptions.xAxisTitleText = 'Date';
    chartOptions.yAxisMin = null;
    chartOptions.yAxisMax = null;
    chartOptions.xAxisLabelRotation = null;
    chartOptions.yAxisLabelsFormat = null;
    chartOptions.yAxisStackLabelsEnabled = false;
    chartOptions.plotDataLabelsEnabled = true;
    chartOptions.xAxisCategory = xData;
    chartOptions.seriesData[0] = {
        color: '#FA5858',
        name: 'Daily Avg Rating',
        data: yData
    };
    renderCharts(chartOptions);
};
var RenderMonthlyChart = function (data, divID) {
    var xData = [];
    var yData = [];
    $.each(data, function (key, value) {
        var date = new Date(value[0]);
        xData.push(value[0]);
        yData.push(value[1]);
    });
    var chartOptions = $.extend(true, {}, chartOptionsBase);
    chartOptions.chartType = 'line';
    chartOptions.renderTo = divID ;
    chartOptions.plotStacking = 'normal'
    chartOptions.yAxisTitleText = 'Rating';
    chartOptions.xAxisTitleText = 'Date';
    chartOptions.yAxisMin = null;
    chartOptions.yAxisMax = null;
    chartOptions.xAxisLabelRotation = null;
    chartOptions.yAxisLabelsFormat = null;
    chartOptions.yAxisStackLabelsEnabled = false;
    chartOptions.plotDataLabelsEnabled = true;
    chartOptions.xAxisCategory = xData;
    chartOptions.seriesData[0] = {
        color: '#FA5858',
        name: 'Monthly Avg Rating',
        data: yData
    };
    renderCharts(chartOptions);
};
var RenderYearlyChart = function (data, divID) {
    var xData = [];
    var yData = [];
    $.each(data, function (key, value) {
        var date = new Date(value[0]);
        xData.push(value[0]);
        yData.push(value[1]);
    });
    var chartOptions = $.extend(true, {}, chartOptionsBase);
    chartOptions.chartType = 'line';
    chartOptions.renderTo = divID;
    chartOptions.plotStacking = 'normal'
    chartOptions.yAxisTitleText = 'Rating';
    chartOptions.xAxisTitleText = 'Date';
    chartOptions.yAxisMin = null;
    chartOptions.yAxisMax = null;
    chartOptions.xAxisLabelRotation = null;
    chartOptions.yAxisLabelsFormat = null;
    chartOptions.yAxisStackLabelsEnabled = false;
    chartOptions.plotDataLabelsEnabled = true;
    chartOptions.xAxisCategory = xData;
    chartOptions.seriesData[0] = {
        color: '#FA5858',
        name: 'Yearly Avg Rating',
        data: yData
    };
    renderCharts(chartOptions);
};


var GetDailyData = function (data, device) {
    var whereCriteria = _.where(data, { "AppDevice": device });
    var sortedByReviewDate = _.sortBy(whereCriteria, 'ReviewDate');
    var sortedArray = _.toArray(sortedByReviewDate);
    var lastFiftyRecords = _.last(sortedArray, 50);
    var pickedData = _.map(lastFiftyRecords, function (currentObject) {
        pick = _.pick(currentObject, 'ReviewDate', 'Rating');
        return _.toArray(pick);
    });
    var grouped = _.groupBy(pickedData, function (item) {
        return item[0];
    });
    return GetAvgArray(grouped);
};
var GetMonthlyData = function (data, device) {
    var whereCriteria = _.where(data, { "AppDevice": device });
    var sortedByReviewDate = _.sortBy(whereCriteria, 'ReviewDate');
    var pickedData = _.map(sortedByReviewDate, function (currentObject) {
        pick = _.pick(currentObject, 'ReviewDate', 'Rating');
        return _.toArray(pick);
    });
    var groupedByMonth = _.groupBy(pickedData, function (item) {
        return item[0].substring(0, 7);
    });
    return GetAvgArray(groupedByMonth);
};
var GetYearlyData = function (data, device) {
    var whereCriteria = _.where(data, { "AppDevice": device });
    var sortedByReviewDate = _.sortBy(whereCriteria, 'ReviewDate');
    var pickedData = _.map(sortedByReviewDate, function (currentObject) {
        pick = _.pick(currentObject, 'ReviewDate', 'Rating');
        return _.toArray(pick);
    });

    var groupedByYear = _.groupBy(pickedData, function (item) {
        return item[0].substring(0, 4);
    });
    return GetAvgArray(groupedByYear);
};
var GetAvgArray = function (data) {
    var avgArray = [];
    $.each(data, function (key, value) {
        total = 0;
        $.each(value, function (k, v) {
            total = total + v[1];
        });
        var totalratings = value.length; var absolute = total / totalratings; var avg = Number((absolute).toFixed(2)); avgArray.push(new Array(key, avg));
    });
    return avgArray;
};


var PublishTable = function (data, device,containerID) {

    var whereCriteria = _.where(data, { "AppDevice": device });
    var sortedByReviewDate = _.sortBy(whereCriteria, 'ReviewDate');
    var pickedData = _.map(sortedByReviewDate, function (currentObject) {
        pick = _.pick(currentObject, 'ReviewDate', 'Review', 'Rating', 'Version');
        return _.toArray(pick);
    });
    var $tablehead = "<table id='"+device+'_'+containerID+"' class='display' cellspacing='0' width='100%'>" +
                "<thead>" +
                "<tr>" +
                "<th>Review Date</th>" +
                "<th>Comments</th>" +
                "<th>Rating</th>" +
                "<th>Version</th>" +
                "</tr>" +
                "</thead>";

    var $tbody = '<tbody>';
    $.each(pickedData, function (key, value) {

        $tbody += '<tr><td>' + value[0] + '</td><td>' + value[1] + '</td><td>' + value[2] + '</td><td>' + value[3] + '</td></tr>';
    });
    $tbody += '</tbody>';
    $tableContent = $tablehead + $tbody + "</table>";
    if(containerID == 'androidreviews')
    console.log($tableContent);
    $('#' + containerID + '').html($tableContent);
    return true;
   
};
