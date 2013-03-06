//main app file

console.log('-------- app started! ---------');

var APP = {};

$(document).ready(function() {
    $(".main-content").kendoSplitter({
        panes: [
            { collapsible: false },
            { collapsible: false }
        ]
    });

    $(".left-pane").kendoListView({
        dataSource: APP.dataSource,
        selectable: "single",
        // dataBound: onDataBound,
        // change: onChange,
        template: kendo.template($("#list-tpl").html())
    });


});




APP.dataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: "data.json", // the remove service url
            dataType: "json" // JSONP (JSON with padding) is required for cross-domain AJAX
        }
    },
    // schema: { // describe the result format
    //     data: "results" // the data which the data source will be bound to is in the "results" field
    // },
    change: function() { // subscribe to the CHANGE event of the data source
        console.log('-------- change event! ---------');

        var counter = 0;
        var record;
        var now = Date.now();
        var late = false;
        var today = false;
        var soon = false;
        var someday = false;
        while (record = APP.dataSource.at(counter++)){
            console.log(record.get('label'));
            
            var time = new Date(record.get('date')).getTime();
            if (time < now && !late) {
                record.set('header', "Late");
                late = true;
            } else if (time > now && time < now + 24*60*60 && !today) {
                record.set('header', "Today");
                today = true;
            } else if (time > now + 24*60*60 && time < now + 7*24*60*60 && !soon) {
                record.set('header', "Soon");
                soon = true;
            } else if (time > now + 7*24*60*60 && !someday) {
                record.set('header', "Someday");
                someday = true;
            } else {
                record.set('header', "");
            }
        }
    }
});

// read data from the remote service
APP.dataSource.read();

APP.dataSource.sort({field: "date", dir: 'asc'});

