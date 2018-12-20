import $ from 'jquery';
import {makeTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let inputVector = $('#inputVector').val();


        $('#viewTable').empty();
        $('#viewTable').append(makeTable(inputVector,codeToParse));

    });
});

