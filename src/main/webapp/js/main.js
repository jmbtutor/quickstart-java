$(document).ready(function () {
    setInterval(redoQuery, 1000);
    prettyJson();
    if (!$('#raw').prop('checked')) {
        $('.jsonValue').each(function(index, value){
          try {
            $(this).JSONView(JSON.parse($(this).text()), { collapsed: $('#collapse').prop('checked')});
            $(this).show();
          } catch (e) {
            console.log(e);
          }
        });
    }
   $( "#collection" ).autocomplete({
      source: ${Mappers.writeValueAsString(collections)},
      delay: 20,
      minLength:0
    });
    if (${biasingProfileCount} > 1) {
      $('.highlightCorresponding').each(function(index, value){
        var text = '| ';
        for (var i = 0; i < ${biasingProfileCount}; i++) {
          var matchingRecords = $(this).attr('data-id').substring(5);
          var matchingRow = $('.recordColumn' + i + ' .' + matchingRecords);
          if (matchingRow.length) {
            text += $('h2', matchingRow).attr('data-id') + '&nbsp;|&nbsp;';
          } else {
            text += '&nbsp;&nbsp;|&nbsp;';
          }
          $('.otherColumns',this).html(text);
        }
      });
    }
});

function showAdvanced(){
    $('#advanced').toggle('slide', function(){
        $.cookie('showAdvanced', $('#advanced').is(":visible"));
    });
}
function redoQuery() {
    if ($.cookie('reload') == 'true') {
        $.cookie('reload', 'false');
    } else {
        return;
    }
    var sForm = $('#form').serialize();
    $.ajax({
        type: 'post',
        url: 'index.html',
        data: $('#form').serialize() + '&action=getOrderList',
        dataType: 'json'
    }).done(function (pResponse) {
        $('#scratchArea').html(pResponse);
        $('.replacementRow').each(function () {
            var row = $(this).attr('data-count');
            $('#row' + row).quicksand($('#replacementRow' + row + ' li'))
        });
    });
}

function getMoreNav(navigationName) {
    $.post('moreRefinements.html', {
        'navigationName' : navigationName,
        'originalQuery' : $('#originalQuery').text()
    }).done(function(data){
        if (data != '' || data != undefined) {
            var navElement = document.getElementById("nav-"+navigationName);
            $(navElement).html(data);
        } else {
            console.log('No data received.');
        }
    });
}


function prettyJson() {
    $('.reformatJson').each(function (index, element) {
        try {
            var e = $(element);
            e.html(e.html()
                    .replace(/\[\{/g, '[<br/>{')
                    .replace(/},/g, '},<br/>')
                    .replace(/}]/g, '}<br/>]')
            );
        } catch (exception) {
            console.log('parse exception: ', exception);
        }
    });
}

var currentHash = location.hash;
if (currentHash){
    var hashes = currentHash.substring(1).split('&');
    hashes.forEach(function(pItem){
        var keyValue = pItem.split('=');
        if (keyValue && keyValue.length == 2 && keyValue[0] && keyValue[1] && keyValue[1] !== 'undefined') {
            $('#' + keyValue[0]).attr('value', decodeURIComponent(keyValue[1]));
            $.cookie(keyValue[0], decodeURIComponent(keyValue[1]));
        }
    });
}
var customerIdFromRequestScopeExists = ${!empty customerId};
if ($('#customerId').attr('value') && !customerIdFromRequestScopeExists){
    self.location.reload();
}

$('#cookieForm input').each(function(){
    $(this).keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
         if (code == 13) {
            e.preventDefault();
            e.stopPropagation();
            saveForm();
            $('#form').submit();
         }
     });
});
function saveForm() {
    $('#cookieForm input').each(function(){
        var myId = $(this).attr('id');
        var type = $(this).attr('type');
        if ($.cookie(myId)) {
            if (type === 'checkbox'){
              $(this).prop("checked", $.cookie(myId) === 'true');
            } else {
                $(this).val($.cookie(myId));
            }
        }
    });
    generateHash();
}
function generateHash() {
    var hashLocation = '';
    $('#cookieForm input').each(function(){
        var myId = $(this).attr('id');
        if ($.cookie(myId)) {
            hashLocation += myId + '=' + $.cookie($(this).attr('id')) + '&';
        }
    });
    location.hash = hashLocation;
}
saveForm();
$('#cookieForm input').bind('keyup blur click change', function(){
    var type = $(this).attr('type');
    if (type === 'checkbox') {
        $.cookie($(this).attr('id'), $(this).prop('checked'));
    } else {
        $.cookie($(this).attr('id'), $(this).val());
    }
    generateHash();
});

$('#form').submit(function(e){
    saveForm();
});

function showForm(){
    $('#settings').toggle('slide', function(){
        $.cookie('showForm', $('#settings').is(":visible"));
    });
}
function showZones(){
    $('#allZones').toggle('slide', function(){
        $.cookie('showZones', $('#allZones').is(":visible"));
    });
}

function showMatchStrategy(){
    $('.matchStrategyHolder').toggle('slide', function(){
        $.cookie('showMatchStrategy', $('.matchStrategyHolder').is(":visible"));
    });
}
function showSort(){
    $('.sortHolder').toggle('slide', function(){
        $.cookie('showSort', $('.sortHolder').is(":visible"));
    });
}
function showRawQuery(){
    $('.rawQuery').toggle('slide', function(){
        $.cookie('showRawQuery', $('.rawQuery').is(":visible"));
    });
}
function showJsonResponse(){
    $('.jsonResponse').toggle('slide', function(){
        $.cookie('showJsonResponse', $('.jsonResponse').is(":visible"));
    });
}
function showColumnSpecifics(){
    $('.columnSpecifics fieldset').toggle('slide', function(){
        $.cookie('showColumnSpecifics', $('.columnSpecifics fieldset').is(":visible"));
    });
}

