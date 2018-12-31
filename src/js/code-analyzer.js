import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

/*const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};*/

const makeTable  = (inputVector, codeToParse) => {
    let table = '';
    let endOfTheRow = '</td></tr>';
    codeToTable(inputVector,codeToParse).forEach(lineTable => {
        let rowTable = '<tr><td>' + lineTable.row +endOfTheRow;
        if(lineTable.color === 'red' ){
            rowTable = '<tr bgcolor=#FF0000><td>' + lineTable.row +endOfTheRow;
        }else if(lineTable.color === 'green'){
            rowTable = '<tr bgcolor=#00FF00><td>' + lineTable.row +endOfTheRow;
        }else{
            rowTable = '<tr><td>' + lineTable.row +endOfTheRow;
        }

        table = table + rowTable;
    });
    return table;
};

let arrayVariables = {
    'localVariablesArray': [],
    'globalVariablesArray': [],
    'theModel': [],
    'localVariableIF' :[],
    'moveRow' : 0,
};

function checkTypeLocal(obj){
    return typeHandelLocal[obj.type](obj);
}

function checkTypeGlobal(obj){
    return typeHandelGlobal[obj.type](obj);
}

function checkTypeVariable(obj){
    return typeHandelVariable[obj.type](obj);
}

/*function checkTypeAssignmentVariable(obj){
    return typeHandelAssignmentVariable[obj.type](obj);
}*/

function checkTypeIf(obj){
    return typeHandelIf[obj.type](obj);
}

let typeHandelLocal = {
    'WhileStatement' :  whileStatementLocalHandle,
    'IfStatement' : ifStatementLocalHandle,
    'ReturnStatement' : returnStatementLocalHandle,
    //'BlockStatement' : blockStatementLocalHandle,
    'MemberExpression': memberExpressionLocalHandle,
    'VariableDeclaration' : variableDeclarationLocalHandle,
    //'ExpressionStatement': expressionStatementLocalHandle,

    'BinaryExpression' : binaryExpressionLocalHandel,

    'Literal' : literalLocalHandel,
    'Identifier' : identifierLocalHandel
};

let typeHandelGlobal ={
    'ExpressionStatement' : expressionStatementGlobalHandle,
    'VariableDeclaration' : variableDeclarationGlobalHandle,

    'ArrayExpression': arrayGlobalHandel,
    'MemberExpression' : memberExpressionGlobalHandel,
    'SequenceExpression': sequenceExpressionGlobalHandel,
    'AssignmentExpression': assignmentExpressionGlobalHandel,
    'BinaryExpression' : binaryExpressionGlobalHandel,
    //'UpdateExpression': updateExpressionGlobalHandel,
    //'UnaryExpression': unaryExpressionGlobalHandel,


    'Literal' : literalGlobalHandel,
    'Identifier' : identifierGlobalHandel,
};

let typeHandelVariable = {
    'Identifier': identifierVariableHandel,
    //'MemberExpression': memberExpressionVariableHandel,
    'Literal': literalVariableHandel,
};

/*let typeHandelAssignmentVariable = {
    //'MemberExpression' : memberExpressionAssignmentVariableHandel,
    //'BinaryExpression' : binaryExpressionAssignmentVariableHandel,
    //'Identifier' : identifierAssignmentVariableHandel,
    'Literal' : literalAssignmentVariableHandel,
};*/

let typeHandelIf = {
    'AssignmentExpression' : AssignmentExpressionIfHandel,
    'Literal': literalIfHandel,
    'ExpressionStatement': expressionStatementIfHandel,
    'Identifier': identifierIfHandel,
    'ReturnStatement': returnStatementIfHandel,
    'MemberExpression': memberExpressionIfHandel,
    'BinaryExpression': binaryExpressionIfHandel,
    'WhileStatement' :  whileStatementLocalHandle,
    'IfStatement' : ifStatementLocalHandle,
    'VariableDeclaration' : variableDeclarationIfHandel,
};

//typeHandelIf

function variableDeclarationIfHandel(obj){
    let objDeclaration = obj.declarations;
    let objectDeclaration = {};
    objDeclaration.forEach(dec =>{
        objectDeclaration['name'] = dec.id.name;objectDeclaration['value'] = null;
        objectDeclaration['value'] = checkTypeGlobal(dec.init);
        /*if(dec.init != null ){
            objectDeclaration['value'] = checkTypeGlobal(dec.init);
        }else{
            dec.init != null;
        }*/
        insertToLocalVariableIF(objectDeclaration);
    });
}

function insertToLocalVariableIF(res){
    arrayVariables.localVariableIF.push(res);
    /*let variableLocal;
    arrayVariables.localVariableIF.forEach(variable =>{
        if(res.name === variable.name){
            variableLocal = variable;
        }
    });
    if(variableLocal === undefined){
        arrayVariables.localVariableIF.push(res);
    }else {
        variableLocal.value = res.value;
    }*/
}

function binaryExpressionIfHandel(obj){
    let objBinaryRight = obj.right;let objBinaryLeft = obj.left;
    let binaryRight = checkTypeIf(objBinaryRight);
    let binaryLeft = checkTypeIf(objBinaryLeft);
    let operator = obj.operator ;
    let boolRight; let boolLeft;
    boolRight = objBinaryRight.type === 'Identifier';
    boolLeft = objBinaryLeft.type === 'Identifier';
    return createBinaryExpression(binaryRight,binaryLeft,operator,boolRight,boolLeft);
}

function memberExpressionIfHandel(obj){
    return obj.object.name + '[' + checkTypeGlobal(obj.property) +']';
}

function returnStatementIfHandel(obj){
    let objArgument = obj.argument;
    return checkTypeIf(objArgument);
}

function identifierIfHandel(obj){
    let objectVariableGlobal='';let objectVariableIfLocal;/*let variableLocal;*/
    arrayVariables.globalVariablesArray.forEach(variable =>{
        if(variable.name === obj.name ){
            objectVariableGlobal = variable;}
    });
    arrayVariables.localVariableIF.forEach( variable =>{
        if(variable.name === obj.name ){
            objectVariableIfLocal = variable;}
    });
    if(objectVariableIfLocal !== undefined)
        return objectVariableIfLocal.value;
    else
        return objectVariableGlobal.name;

    /*variableLocal = checkIfVariableInLocalVariable(obj);
    if(variableLocal !== undefined)
        return variableLocal.value;*/
}

/*function checkIfVariableInLocalVariable(obj){
    let variableLocal;
    arrayVariables.localVariablesArray.forEach(variable =>{
        if(obj.name === variable.name) {
            variableLocal = variable;
        }
    });
    return variableLocal;
}*/

function expressionStatementIfHandel(obj){
    let objExpression = obj.expression;
    return checkTypeIf(objExpression);
}

function literalIfHandel(obj){
    return obj.value;
}

function AssignmentExpressionIfHandel(obj){
    let leftObject = checkTypeVariable(obj.left);let objectVariableLocal; let objectVariableGlobal;let valueOfObject;
    arrayVariables.globalVariablesArray.forEach(variable =>{
        if(variable.name === leftObject ){
            objectVariableGlobal = variable;}
    });
    if(objectVariableGlobal !== undefined){
        /*valueOfObject = getNiceValue(checkTypeIf(obj.right));*/valueOfObject = checkTypeIf(obj.right);
    }
    arrayVariables.localVariableIF.forEach( variable =>{
        if(variable.name === leftObject ){
            objectVariableLocal = variable;}
    });
    if(objectVariableLocal !== undefined){
        /*valueOfObject = getNiceValue(checkTypeIf(obj.right));*/valueOfObject = checkTypeIf(obj.right);
        objectVariableLocal.value = valueOfObject;
    }
    let ans = {};ans.name = leftObject;ans.value = valueOfObject;
    return ans;
}

/*function getNiceValue(valueOfObject){
    let valueOfObjectEval;

    if (typeof(valueOfObjectEval) === 'string') {
        if(!valueOfObject.match(/[a-z]/i)) {
            valueOfObjectEval = eval(valueOfObject);
        }
    }else if(valueOfObject === true || valueOfObject === false)
        valueOfObjectEval = valueOfObject;
    else{
        valueOfObjectEval = valueOfObject;
    }
    return valueOfObjectEval;
}*/

//typeHandelLocal

function memberExpressionLocalHandle(obj){
    let res = '';
    let nameObj = {};
    res = res + checkTypeVariable(obj.object);
    res = res + '[' + checkTypeVariable(obj.property) + ']';
    nameObj.name = res;

    return identifierLocalHandel(nameObj);
}

/*function expressionStatementLocalHandle(obj){
    return checkTypeGlobal(obj.expression);
}*/

function returnStatementLocalHandle(obj){
    let objArgument = obj.argument;
    let typeObjArgument = checkTypeIf(objArgument);
    let ans = {};
    ans.row = moveRow() + 'return ' + typeObjArgument + ';';
    arrayVariables.theModel.push(ans);
    return ans;
}

function whileStatementLocalHandle(obj){
    let testObject = getParametersFromObjectTest(obj.test);
    let parameter = testObject.params;
    let rowWhile = moveRow() + 'while(' + parameter + '){';
    let lineInModel = {};
    lineInModel.row = rowWhile; lineInModel.color = testObject.color;
    arrayVariables.theModel.push(lineInModel);
    resetValuesInIf();
    parseInCondition(obj.body.body);
    let closeRow = {};
    closeRow.row = moveRow() + '}';
    arrayVariables.theModel.push(closeRow);
}

function binaryExpressionLocalHandel(obj){
    let objBinaryRight = obj.right;let objBinaryLeft = obj.left;
    let binaryRight = checkTypeLocal(objBinaryRight);
    let binaryLeft = checkTypeLocal(objBinaryLeft);
    let operator = obj.operator ;
    let boolRight; let boolLeft;
    boolRight = objBinaryRight.type === 'BinaryExpression';
    boolLeft = objBinaryLeft.type === 'BinaryExpression';
    return createBinaryExpression(binaryRight,binaryLeft,operator,boolRight,boolLeft);
}

function identifierLocalHandel(obj){
    let objName = obj.name;
    let ans = {};
    arrayVariables.globalVariablesArray.forEach(variable => {
        if(variable.name === objName){
            ans = variable;
        }
    });

    return ans.value;

}

function literalLocalHandel(obj){
    return obj.value;
}

function ifStatementLocalHandle(obj){
    let testObject = getParametersFromObjectTest(obj.test);
    let parameter = testObject.params;
    let rowIf = moveRow() + 'if(' + parameter + ' ){';
    let lineInModel = {};
    lineInModel.row = rowIf; lineInModel.color = testObject.color;
    arrayVariables.theModel.push(lineInModel);
    resetValuesInIf();
    parseInCondition(obj.consequent.body);
    if(obj.alternate !== null){
        parseInAlternate(obj.alternate);
    }else{
        let closeRow = {};
        closeRow.row = moveRow() + '}';
        arrayVariables.theModel.push(closeRow);
    }
}

function parseInAlternate(objAlternate){
    resetValuesInIf();let parameterObjAlternate;let lineIfElse;
    if(objAlternate.type !== 'IfStatement'){
        let lineElse = moveRow() + '}' +'else' + '{';let ans = {};ans.row = lineElse;
        let objAlternateBody = objAlternate.body;
        arrayVariables.theModel.push(ans);parseInCondition(objAlternateBody);
    }else{
        parameterObjAlternate = getParametersFromObjectTest(objAlternate.test);
        let strElseIf = '}else if(' + parameterObjAlternate.params + '){';
        lineIfElse = moveRow() + strElseIf;let ans = {};
        ans.row = lineIfElse;ans.color = parameterObjAlternate.color;
        arrayVariables.theModel.push(ans);
        let objAlternateBody = objAlternate.consequent.body;parseInCondition(objAlternateBody);
        //if(objAlternate.alternate !== null){
        parseInAlternate(objAlternate.alternate);
        /*}else{
            let ans = {};ans.row = moveRow() + '}';arrayVariables.theModel.push(ans);
        }*/
    }
}

function parseInCondition(objBody) {
    let j = 0;
    let objBodyLength = objBody.length - 1;
    //if (objBody !== undefined) {
    objBody.forEach(vari => {
        if (objBodyLength !== j) {
            toCopeThingsInCondition(vari);
            j++;
        } else {
            toCopeLastThingInCondition(vari);
        }
    });
    //}
}

function toCopeLastThingInCondition(expr){
    arrayVariables.moveRow = arrayVariables.moveRow +1;let line = '';let vari; let res = {};
    if(expr.type ===  'ExpressionStatement' && expr.expression.type === 'AssignmentExpression'){
        vari = checkTypeIf(expr);let variValue = vari.value;line = moveRow() + vari.name + '=' + variValue + ';';
        res.row = line;
        arrayVariables.theModel.push(res);
    }else if(expr.type === 'ReturnStatement'){
        vari = checkTypeIf(expr);
        if(typeof (vari)=== 'string'){
            let esprimaVari = esprima.parseScript(vari);
            let esprimaVariExpresion = esprimaVari.body[0].expression;
            let esprimaVariExpresionEsco = escodegen.generate(esprimaVariExpresion);
            line = moveRow() + 'return ' + esprimaVariExpresionEsco + ';';
        }else
            line = moveRow() + 'return ' + vari + ';';
        res.row = line;arrayVariables.theModel.push(res);
    }else
        checkForOtherTypes(expr);
    arrayVariables.moveRow = arrayVariables.moveRow - 1;
}

function checkForOtherTypes(expr){
    if(expr.type ===  'IfStatement' || expr.type === 'WhileStatement') {
        checkTypeIf(expr);
    }
}

function toCopeThingsInCondition(expr){
    //let exprType = expr.type;
    //if(exprType==='IfStatement' ||exprType === 'WhileStatement')
    //   arrayVariables.moveRow = arrayVariables.moveRow + 1 ;
    checkTypeIf(expr);
    //if(exprType==='IfStatement' || exprType === 'WhileStatement')
    //   arrayVariables.moveRow = arrayVariables.moveRow - 1 ;
}

function resetValuesInIf(){
    arrayVariables.localVariableIF = [];
    arrayVariables.localVariablesArray.forEach(localVariable =>{
        let variable = {};
        variable.name = localVariable.name;
        variable.value = localVariable.value;
        arrayVariables.localVariableIF.push(variable);
    });
}

function getParametersFromObjectTest(objTest){
    let parametersTest = {};
    if(objTest.type === 'Identifier'){
        parametersTest =  getFromIdentifierTest(objTest);
    }else if(objTest.type === 'MemberExpression'){
        parametersTest = getFromMemberExpressionTest(objTest);
    }else
        parametersTest = getFromBinaryExpressionTest(objTest);
    /*else if(objTest.type === 'BinaryExpression'){
        parametersTest = getFromBinaryExpressionTest(objTest);
    }*/
    return parametersTest;
}

function getFromMemberExpressionTest(objTest){
    let parametersTest = {};
    let objTestName = checkTypeGlobal(objTest);
    let objTestValue = checkTypeLocal(objTest);
    //if(objTestValue === false || objTestValue === true ){
    parametersTest.params = objTestName;
    if(eval(objTestValue)){
        parametersTest.color = 'green';
    }else
        parametersTest.color = 'red';
    /*}else{
         let ansEsco = escodegen.generate(objTestValue);
         parametersTest.params = objTestName;
         if(eval(ansEsco)){
             parametersTest.color = 'green';
         }else
             parametersTest.color = 'red';
     }*/
    return parametersTest;
}

function getFromIdentifierTest(objTest){
    let parametersTest = {};
    let objTestName = checkTypeLocal(objTest);
    //if(objTestName === false || objTestName === true ){
    parametersTest.params = objTestName;
    if(eval(objTestName)){
        parametersTest.color = 'green';
    }else
        parametersTest.color = 'red';
    /*}else{
        let ansEsco =  escodegen.generate(objTestName);
        parametersTest.params = objTestName;
        if(eval(ansEsco)){
            parametersTest.color = 'green';
        }else
            parametersTest.color = 'red';
    }*/
    return parametersTest;
}

function getFromBinaryExpressionTest(objTest){
    let parametersTest = {};
    let rightParam = checkTypeGlobal(objTest.right);
    let leftParam = checkTypeGlobal(objTest.left);
    let operator = objTest.operator;
    let strParams = leftParam + ' ' + operator + ' ' + rightParam;
    let res = insertValToParams(strParams);
    let escoAns = escodegen.generate(res);
    parametersTest.params = strParams;
    parametersTest.color = checkColor(eval(escoAns));
    return parametersTest;
}

function insertValToParams(strParams){
    let esStrParams = esprima.parseScript(strParams);
    let esStrParamsExpression = checkTypeLocal(esStrParams.body[0].expression);
    return esprima.parseScript(esStrParamsExpression);
}

function checkColor(test){
    if(test){
        return 'green';
    }else{
        return 'red';
    }
}

function insertToLocalVariableArray(res){
    arrayVariables['localVariablesArray'].push(res);
    /*let variableLocal;
    arrayVariables['localVariablesArray'].forEach(variable =>{
        if(res.name === variable.name) {
            variableLocal = variable;
        }
    });
    if(variableLocal === undefined){
        arrayVariables['localVariablesArray'].push(res);

    }*//*else {
        variableLocal.value = res.value;
    }*/
}

function variableDeclarationLocalHandle(obj){
    let objDeclaration = obj.declarations;
    let objectDeclaration = {};
    objDeclaration.forEach(dec =>{
        objectDeclaration['name'] = dec.id.name;objectDeclaration['value'] = null;
        //if(dec.init != null ){
        objectDeclaration['value'] = checkTypeGlobal(dec.init);
        // }
        insertToLocalVariableArray(objectDeclaration);
    });
}

function moveRow(){
    let move = '';
    let i = 0;
    while(i < arrayVariables.moveRow){
        move = move + '&nbsp;&nbsp;&nbsp;';
        i++;
    }
    return move;
}


//typeHandelGlobal
function identifierGlobalHandel(obj){
    return findIfObjectIsLocal(obj);
}

function findIfObjectIsLocal(obj){
    //let variableLocal;
    let variableLocal =arrayVariables['localVariablesArray'].find(variable =>{
        if(variable.name === obj.name) {
            return variable;
        }
    });
    if(variableLocal === undefined){
        return  obj.name;
    }else {
        return variableLocal.value;
    }
}

function literalGlobalHandel(obj){
    return obj.value;
}

function binaryExpressionGlobalHandel(obj){
    let objBinaryRight = obj.right;let objBinaryLeft = obj.left;
    let binaryRight = checkTypeGlobal(objBinaryRight);
    let binaryLeft = checkTypeGlobal(objBinaryLeft );
    let operator = obj.operator ;
    let boolRight = false ; let boolLeft = false;
    /*if(objBinaryRight.type === 'BinaryExpression'){
        boolRight = true;
    }else{
        boolRight = false;
    }
    if(objBinaryLeft.type === 'BinaryExpression'){
        boolLeft = true;
    }else{
        boolLeft = false;
    }*/
    return createBinaryExpression(binaryRight,binaryLeft,operator,boolRight,boolLeft);
}

function assignmentExpressionGlobalHandel(obj){
    let objectAssignment = {};
    objectAssignment.name = obj.left.name;
    objectAssignment.value = checkTypeGlobal(obj.right);
    searchIfArray(objectAssignment);
    return objectAssignment;
}

function sequenceExpressionGlobalHandel(obj){
    let seqArray = [];let sequenceValue; //let sequenceObject;
    obj.expressions.forEach(sequencExpression =>{
        sequenceValue = checkTypeGlobal(sequencExpression);
        if(!(sequencExpression.right === undefined || sequencExpression.right.type ==='ArrayExpression')){
            /*sequenceObject = seqArray.find(sao => {
                if(sao.name === sequenceValue.name)
                    return sao;
            });*/
            //if(sequenceObject === undefined)
            seqArray.push(sequenceValue);
            /*else
                sequenceObject.value = sequenceValue.value;*/
        }
    });
    return seqArray;
}

function memberExpressionGlobalHandel(obj){
    let res = '';
    let nameObj = {};
    res = res + checkTypeVariable(obj.object);
    res = res + '[' + checkTypeVariable(obj.property) + ']';
    nameObj.name = res;

    return identifierGlobalHandel(nameObj);
}

function arrayGlobalHandel(obj){
    let sizeElements = obj.elements.length;
    let eleArray = '';
    for(let i =0 ; i< sizeElements ; i++){
        if(i === 0){
            eleArray = eleArray + '[' +checkTypeGlobal(obj.elements[i]) +',';
        }else{
            eleArray = eleArray + checkTypeGlobal(obj.elements[i]) +',';
        }
    }
    eleArray = eleArray.substring(0,eleArray.length-1) + ']';
    return eleArray;
}

function variableDeclarationGlobalHandle(obj){
    let objectDeclaration = {};let declarationArray = [];
    obj.declarations.forEach(dec =>{
        objectDeclaration['name'] = dec.id.name;objectDeclaration['value'] = null;
        //if(dec.init !== null){
        objectDeclaration['value'] = checkTypeGlobal(dec.init);
        //}
        //let objInDec;
        /*declarationArray.forEach(decArr =>{
            if(decArr.name === objectDeclaration.name){
                objInDec = decArr;
            }
        });*/
        // if(objInDec === undefined)
        declarationArray.push(objectDeclaration);
        /*else
            objInDec.value = objectDeclaration.value;*/
    });
    return declarationArray;
}

function expressionStatementGlobalHandle(obj){
    return checkTypeGlobal(obj.expression);
}

/*function updateExpressionGlobalHandel(obj){
    let res;
    let operator = obj.operator;
    let valueOfObj = checkTypeGlobal(obj.argument);
    if(obj.prefix){
        res = operator + valueOfObj;
    }else{
        res =  valueOfObj + operator;
    }
    return res;
}*/

/*function unaryExpressionGlobalHandel(obj){
    let operator = obj.operator;
    let argumentObj = checkTypeGlobal(obj.argument);
    return operator + argumentObj;
}*/




//typeHandelVariable
function identifierVariableHandel(obj){
    return obj.name;
}

/*function memberExpressionVariableHandel(obj){
    return obj.object.name + '[' + checkTypeVariable(obj.property) + ']';
}*/

function literalVariableHandel(obj){
    return obj.value;
}


//typeHandelAssignmentVariable
/*function memberExpressionAssignmentVariableHandel(obj){
    return obj.object.name + '[' + checkTypeGlobal(obj.property) + ']';
}*/

/*function binaryExpressionAssignmentVariableHandel(obj){
    let objBinaryRight = obj.right;let objBinaryLeft = obj.left;
    let binaryRight = checkTypeAssignmentVariable(objBinaryRight);
    let binaryLeft = checkTypeAssignmentVariable(objBinaryLeft);
    let operator = obj.operator ;
    let boolRight; let boolLeft;
    if(objBinaryRight.type === 'Identifier'){
        boolRight = true;
    }else{
        boolRight = false;
    }
    if(objBinaryLeft.type === 'Identifier'){
        boolLeft = true;
    }else{
        boolLeft = false;
    }
    return createBinaryExpression(binaryRight,binaryLeft,operator,boolRight,boolLeft);
}*/

function createBinaryExpression(binaryRight,binaryLeft,operator,boolRight,boolLeft){
    let res;
    if(boolRight){
        if(boolLeft){
            res = '(' + binaryLeft +  ')' + ' '+ operator +' ' + '(' + binaryRight +  ')';
        }else{
            res = binaryLeft + ' ' + operator + ' ' + '(' + binaryRight + ')';
        }
    }else{
        if(boolLeft){
            res = '(' + binaryLeft +  ')' + ' '+ operator +' ' + binaryRight ;
        }else{
            res = binaryLeft + ' ' + operator +' ' + binaryRight;
        }
    }
    return res;
}

/*function identifierAssignmentVariableHandel(obj){
    let objLocal; let objGlobal ;
    arrayVariables['globalVariablesArray'].forEach(variable =>{
        if(obj.name === variable.name) {
            objGlobal = variable;
        }
    });
    if(objGlobal !== undefined){
        return objGlobal.name;
    }
    arrayVariables['localVariablesArray'].forEach(variable =>{
        if(obj.name === variable.name) {
            objLocal = variable;
        }
    });
    if(objLocal !== undefined){
        return objLocal.value;
    }

}*/

/*function literalAssignmentVariableHandel(obj){
    let objectValue = obj.value;
    return objectValue;
}*/



function codeToTable(inputVector,codeToParse){
    arrayVariables.theModel = [];
    arrayVariables.globalVariablesArray =[];
    arrayVariables.localVariablesArray = [];
    arrayVariables.localVariableIF = [];
    arrayVariables.moveRow = 0;
    takeVarFromInputVector(inputVector);
    takeThingsFromCodeToParse(codeToParse);
    return arrayVariables['theModel'];
}

function takeVarFromInputVector(inputVector){
    let result = esprima.parseScript(inputVector);
    let resultBody = result.body[0];
    //if( resultBody !== undefined){
    if(resultBody.expression.type !== 'SequenceExpression' || resultBody.type !== 'ExpressionStatement' ){
        let res = checkTypeGlobal(resultBody);
        if(!searchIfArray(res))
            insertToGlobalVariableArray(res);
    }else{
        takeVarFromInputVectorElseBranch(resultBody);
    }
    //}
}

function takeVarFromInputVectorElseBranch(resultBody){
    let vs = checkTypeGlobal(resultBody);
    for(let i =0;i<vs.length;i++){
        let v = vs[i];
        insertToGlobalVariableArray(v);
    }
}


function searchIfArray(res){
    let resValue = res.value;let boolAns;
    if(typeof(resValue) === 'string'){
        //if(resValue.includes('[',']')){
        boolAns = true;
        let resEsprima = esprima.parseScript(resValue);
        let resEsprimaElements = resEsprima.body[0].expression.elements;
        let i =0;
        resEsprimaElements.forEach(element =>{
            let vari = {};
            vari.name = res.name + '[' + i + ']';
            vari.value = checkTypeGlobal(element);
            insertToGlobalVariableArray(vari);
            i++;
        });
        //}
    }else
        boolAns = false;
    return boolAns;
}

function insertToGlobalVariableArray(res){
    //let variableGlobal;
    let variableGlobal = arrayVariables['globalVariablesArray'].find(variable =>{
        if(res.name === variable.name) {
            return  variable;
        }
    });
    if(variableGlobal === undefined){
        arrayVariables['globalVariablesArray'].push(res);
    }else {
        variableGlobal.value = res.value;
    }
}

function takeThingsFromCodeToParse(codeToParse){
    let codeBody = esprima.parseScript(codeToParse);
    //if(codeBody !== undefined){
    codeBody.body.forEach( experCode =>{
        if(experCode.type === 'FunctionDeclaration'){
            parseFunction(experCode);
        }else{
            let arrayDeclaration =  checkTypeGlobal(experCode);
            arrayDeclaration.forEach(declaration => {
                insertToGlobalVariableArray(declaration);
            });
        }
    });
    //}
}

/*function takeThingsFromCodeToParse(codeToParse){
    let codeBody = esprima.parseScript(codeToParse);
    if(codeBody !== undefined){
        codeBody.body.forEach( experCode =>{
            if(experCode.type == 'FunctionDeclaration'){
                parseFunction(experCode);
            }else{
                let arrayDeclaration =  checkTypeGlobal(experCode);
                arrayDeclaration.forEach(declaration => {
                    insertToGlobalVariableArray(declaration);
                });
            }
            else if(experCode.type == 'VariableDeclaration'){
                let arrayDeclaration =  checkTypeGlobal(experCode);
                arrayDeclaration.forEach(declaration => {
                    insertToGlobalVariableArray(declaration);
                });
            }else{
                //checkTypeLocal(experCode);
            }
        });
    }
}*/

function parseFunction(experCode){
    let parameters = getParametersFromFunction(experCode.params);
    let rowFunction = 'function '+ experCode.id.name;
    let parametersToRow = parametersOfFunctionToRow(parameters);
    rowFunction = rowFunction + '(' + parametersToRow + ')' + '{';
    let res = {'row': rowFunction};
    arrayVariables['theModel'].push(res);
    arrayVariables['moveRow'] = arrayVariables['moveRow'] + 1 ;
    //if(experCode.body.body !== undefined){
    experCode.body.body.forEach(exper => {
        checkTypeLocal(exper);
    });
    //}
    arrayVariables['moveRow'] = arrayVariables['moveRow'] - 1 ;
    res = {'row': '}'};
    arrayVariables['theModel'].push(res);
    return experCode;
}

function parametersOfFunctionToRow(parameters){
    let parametersRows = '';
    parameters.forEach( parameter => {
        parametersRows = parametersRows + parameter + ',';
    });
    let lengthOfparametersRows = parametersRows.length;
    parametersRows = parametersRows.substring(0,lengthOfparametersRows-1);
    return parametersRows;
}

function getParametersFromFunction(parametersFromFunction){
    let parameters = [];
    parametersFromFunction.forEach(parameter => {
        let ans = checkTypeGlobal(parameter);
        parameters.push(ans);
        //if(parameter.type === 'Identifier'){
        let variableGlobal;
        arrayVariables['globalVariablesArray'].forEach(variable =>{
            if(parameter.name === variable.name) {
                variableGlobal = variable;
            }
        });
        if(variableGlobal === undefined){
            variableGlobal = {'name': parameter.name , 'value': parameter.value};
            arrayVariables['globalVariablesArray'].push(variableGlobal);
        }
        //}
    });
    return parameters;
}






export {makeTable};

