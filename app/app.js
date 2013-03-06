//main app file

console.log('-------- app started! ---------');


$(document).ready(function() {
    $(".main-content").kendoSplitter({
        panes: [
            { collapsible: false },
            { collapsible: false }
        ]
    });
});