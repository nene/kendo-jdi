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
    $(".main-content").height(800).resize();

    $(".left-pane").kendoListView({
        dataSource: APP.dataSource,
        selectable: "single",
        // dataBound: onDataBound,
        change: function(e) {
            var data = APP.dataSource.view();
            var selected = $.map(this.select(), function(item) {
                return data[$(item).index()];
            });

            // index selected or read item information through data
            console.log(selected);
            APP.setSelected(selected[0]);
        },
        template: kendo.template($("#list-tpl").html())
    });

    kendo.bind($(".top-bar"), APP.topBar);
    kendo.bind($(".right-pane"), APP.EmptyModelInstance);

});


APP.Task = kendo.data.Model.define({
    // id: "ProductID",
    fields: {

        id: {
            editable: false,
            nullable: true
        },
        label: {
            editable: true,
            type: 'string'
        },
        date: {
            editable: true,
            type: 'date'
        },
        duration: {
            editable: true,
            type: 'number'
        },
        done: {
            type: 'boolean',
            editable: true
        },
        header: {
            defaultValue: "",
            type: 'string'
        }
    },
    getDueDate: function() {
        var now = Date.now();
        var diff = this.get('date').getTime() - now;
        var days = Math.abs(Math.round(diff / (1000 * 24 * 60 * 60)));
        var text;

        if (diff < 0) {
            text = 'Due: ' + days + ' days ago';
        } else {
            text = 'Due: in ' + days + ' days';
        }

        if (days === 0) {
            text = "Due: today";
        }


        return text;
    },

    deleteRecord: function() {
        APP.dataSource.remove(this);
        this.set('wasDeleted', true);
    },

    isVisible: function() {
        if (this.get('wasDeleted')) {
            return false;
        } else {
            return true;
        }
    },
    isEditing: function() {
        return APP.isEditingTask;
    },
    editRecord: function() {
        APP.isEditingTask = true;
        APP.setSelected(this);
    },
    doneEditing: function() {
        APP.isEditingTask = false;
        APP.setSelected(this);
    }
});

APP.EmptyModelInstance = new APP.Task();
APP.EmptyModelInstance.set('wasDeleted', true);

APP.isChangingDate = false;
APP.dataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: "data.json", 
            dataType: "json" 
        }
    },
    schema: {
        model: APP.Task, 
        data: function(data) {
            data.forEach(function(item){
                item.header = "";
                item.group = "late";
            });
            return data;
        }
    },
    change: function() { // subscribe to the CHANGE event of the data source

        if (APP.isChangingDate) {
            return;
        }
        console.log('-------- change event! ---------');

        APP.isChangingDate = true;

        var counter = 0;
        var record;
        var records = [];

        while (record = APP.dataSource.at(counter++)){
            records.push(record);
        }

        records.sort(function(a,b){
            if (a.get('date') < b.get('date')) {
                return -1;
            } else if (a.get('date') > b.get('date')) {
                return 1;
            } else {
                return 0;
            }
        });


        var now = Date.now() / 1000; //seconds
        var late = false;
        var today = false;
        var soon = false;
        var someday = false;
        // while (record = APP.dataSource.at(counter++)){

        for (var i = 0; i < records.length; i++) {

            record = records[i];

            console.log(record.get('label'), record.get('date'));
            record.set('header', "");

            var now = Date.now();
            var diff = record.get('date').getTime() - now;
            var days = Math.round(diff / (1000 * 24 * 60 * 60));


            if (days < 0) {
                record.set('group', 'late');
                if (!late) {
                    record.set('header', "Late");
                    late = true;
                }
            } else if (days === 0) {
                record.set('group', 'today');
                if (!today) {
                    record.set('header', "Today");
                    today = true;
                }
            } else if (days > 0 && days < 7) {
                record.set('group', 'soon');
                if (!soon) {
                    record.set('header', "Soon");
                    soon = true;
                }
            } else if (days > 6) {
                record.set('group', 'someday');
                if (!someday) {
                    record.set('header', "Someday");
                    someday = true;
                }
            }
        }
        APP.isChangingDate = false;
    }
});

APP.dataSource.sort({field: "date", dir: 'asc'});


APP.setSelected = function(record) {
    APP.selectedRecord = record;

    kendo.bind($(".right-pane"), record);
};


APP.topBar = kendo.observable({
    addTask: function() {
        console.log('add task');
        var task = new APP.Task();
        task.set('date', new Date());
        task.set('label', 'untitled');
        task.set('duration', 30);
        APP.dataSource.add(task);
        task.editRecord();
    }
});

