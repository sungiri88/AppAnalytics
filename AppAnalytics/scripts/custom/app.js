
var AppData = [
{ "ID": 1, "Name": "M-B mbrace", "Android": "comhtiactivity", "Apple": "335276900", "AndroidRef": "com.hti.activity", "AppleRef": "335276900" }
];

var headingTemplate = '<div class="row">' +
                            '<span style="font-size:14px; padding-left: 8px" id="DEVICEID-title"></span>' +
                            '<div style="float:right; padding-right:10px;">' +
                                '<i class="fa fa-icon header-icon fa-home DEVICEID-icon" data-target="#DEVICEID-home" data-parent="#DEVICEID-body"></i>' +
                                '<i class="fa fa-icon header-icon fa-line-chart DEVICEID-icon" data-target="#DEVICEID-charts" data-parent="#DEVICEID-body" ></i>' +
                                '<i class="fa fa-icon header-icon fa-comments DEVICEID-icon" data-target="#DEVICEID-reviews" data-parent="#DEVICEID-body" ></i>' +
                            '</div>' +
                        '</div>';

var homeTemplate = '<div class="col-lg-12 col-md-12">' +
                        '<div class="row">' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                            'Version' +
                            '</div>' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                                '<span id="version" class="text-info"></span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                            'Release Date' +
                            '</div>' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                                '<span id="releaseDate" class="text-info"></span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                            'Rating' +
                            '</div>' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                                '<span id="starRating"></span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                            'Review Count' +
                            '</div>' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                                '<span id="reviewCount" class="text-info"></span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                            'Developed By' +
                            '</div>' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                                '<span id="developedBy" class="text-info"></span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                            'Email' +
                            '</div>' +
                            '<div class="col-lg-6 col-md-6 emptyRow">' +
                                '<span id="email" class="text-muted"></span>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

var chartTemplate = '<ul id="DEVICEID-Charting" class="nav nav-tabs nav-justified">' +
                            '<li class="active"><a data-toggle="tab" href="#DEVICEID-Daily">Daily</a></li>' +
                            '<li><a data-toggle="tab" href="#DEVICEID-Monthly">Monthly</a></li>' +
                            '<li><a data-toggle="tab" href="#DEVICEID-Yearly">Yearly</a></li>' +
                        '</ul>' +
                        '<div class="tab-content box">' +
                            '<div id="DEVICEID-Daily" class="tab-pane fade in active">' +
                            '</div>' +
                            '<div id="DEVICEID-Yearly" class="tab-pane fade">' +
                            '</div>' +
                            '<div id="DEVICEID-Monthly" class="tab-pane fade">' +
                            '</div>' +
                        '</div>';
$(function () {
  
    $.each(AppData, function (index,value) {
        $("#" + value["Apple"] + "-heading").append(headingTemplate.replace(/DEVICEID/g, value["Apple"]));
        $("#" + value["Apple"] + "-home").append(homeTemplate.replace(/DEVICEID/g, value["Apple"]));
        $("#" + value["Apple"] + "-charts").append(chartTemplate.replace(/DEVICEID/g, value["Apple"]));
        $("#" + value["Apple"] + "-heading #" + value["Apple"] + "-title").text(value["Name"]+ " - IOS");
        console.log(headingTemplate);
        $("#" + value["Android"] + "-heading").append(headingTemplate.replace(/DEVICEID/g, value["Android"]));
        $("#" + value["Android"] + "-home").append(homeTemplate.replace(/DEVICEID/g, value["Android"]));
        $("#" + value["Android"] + "-charts").append(chartTemplate.replace(/DEVICEID/g, value["Android"]));
        $("#" + value["Android"] + "-heading #" + value["Android"] + "-title").text(value["Name"] + " - Android");

        
     


    });

    $(".header-icon").on('click', function () {
        $(""+ $(this).attr("data-parent") +" .hidethis").hide();
        $($(this).attr("data-target")).show();
    });

    $.getJSON('App/SyncData', function (status) {
        if (status) {
            $.each(AppData, function (index, value) { getAppData(value['ID'], value['Apple'], value['Android'], value['AppleRef'], value['AndroidRef']) });
        }
    });
  
   

});

var getAppData = function (value, appleID, androidID,appleRef,androidRef) {
    $.getJSON('App/GetAppInfo?AppID='+value, function (data){
        $.each(data, function (index, value) {
            if(value["DeviceID"] == appleRef)
            {
                $("#" + appleRef + "-home #releaseDate").text(formatDate(value["ReleaseDate"]));
                setStarRating(value["Rating"], "#" + appleRef + "-home #starRating");
                $("#" + appleRef + "-home #reviewCount").text(value["ReviewCount"]);
                $("#" + appleRef + "-home #version").text(value["Version"]);
                $("#" + appleRef + "-home #developedBy").text(value["DevelopedBy"]);
                $("#" + appleRef + "-home #email").text(value["Email"]);
            }
            if (value["DeviceID"] == androidRef) {
                $("#" + androidID + "-home #releaseDate").text(formatDate(value["ReleaseDate"]));
                setStarRating(value["Rating"], "#" + androidID   + "-home #starRating");
                $("#" + androidID + "-home #reviewCount").text(value["ReviewCount"]);
                $("#" + androidID + "-home #version").text(value["Version"]);
                $("#" + androidID + "-home #developedBy").text(value["DevelopedBy"]);
                $("#" + androidID + "-home #email").text(value["Email"]);
            }
        });
    });
    $.getJSON('App/GetAppData?AppID='+value, function (data) {
        RenderDailyChart(GetDailyData(data, 'Apple'), appleID+"-Daily");
        RenderMonthlyChart(GetMonthlyData(data, 'Apple'), appleID + "-Monthly");
        RenderYearlyChart(GetYearlyData(data, 'Apple'), appleID + "-Yearly");
        RenderDailyChart(GetDailyData(data, 'Android'), androidID+"-Daily");
        RenderMonthlyChart(GetMonthlyData(data, 'Android'), androidID + "-Monthly");
        RenderYearlyChart(GetYearlyData(data, 'Android'), androidID + "-Yearly");
        if (PublishTable(data, 'Apple', appleID+"-reviews")) {
            $('#Apple_'+appleID+'-reviews').DataTable({
                "order": [[0, "desc"]],
                "pagingType": "full_numbers"
            });
        }
        if (PublishTable(data, 'Android', androidID + '-reviews')) {
            $('#Android_'+androidID+'-reviews').DataTable({
                "order": [[0, "desc"]],
                "pagingType": "full_numbers"
            });
        }
    });
};

var setStarRating = function (value, divID) {
    $(divID).rateYo({
        rating: value,
        starWidth: "25px",
        readOnly:true
    });

};
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

        $tbody += '<tr><td>' + formatDate(value[0]) + '</td><td>' + value[1] + '</td><td>' + value[2] + '</td><td>' + value[3] + '</td></tr>';
    });
    $tbody += '</tbody>';
    $tableContent = $tablehead + $tbody + "</table>";
    $('#' + containerID + '').html($tableContent);
    return true;
   
};



