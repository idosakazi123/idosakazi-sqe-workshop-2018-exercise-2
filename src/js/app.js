import $ from 'jquery';
import {parseCode,getElementFromParseCode,createTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        //$('#parsedCode').text(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        $('#viewTable').empty();
        $('#viewTable').append(createTable(getElementFromParseCode(parsedCode)));

    });
});

