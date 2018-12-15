import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

const createTable = (finalModel) => {
    let table = '<tr>' + '<th> Line </th>' + '<th> Type </th>' + '<th> Name </th>' + '<th> Condition </th>' + '<th> Value </th>' + '</tr>';
    finalModel.forEach(modelRow => {
        table +=( '<tr>' +
            '<td>' + modelRow.line + '</td>' +
            '<td>' + modelRow.type + '</td>' +
            '<td>' + modelRow.name + '</td>' +
            '<td>' + modelRow.condition + '</td>' +
            '<td>' + modelRow.value + '</td>' +
            '</tr>');
    });
    return table;
};

const getElementFromParseCode = (parsedCode) => {
    //let model = [];
    model = [];
    index = 0;
    raw = 1;
    ifType ='if statement';
    parsedCode.body.forEach(obj => {
        //model[i] =  checkType(obj);
        checkType(obj);

    });
    //want to see the model

    return model;
};

let raw;
let model;
let index;
let ifType;

let typeHandel = {
    'FunctionDeclaration' : functionDeclarationHandle,
    'BlockStatement' : blockStatementHandle,
    'VariableDeclaration' : variableDeclarationHandle,
    'ExpressionStatement' : expressionStatementHandle,
    'WhileStatement' :  whileStatementHandle,
    'IfStatement' : ifStatementHandle,
    'ReturnStatement' : returnStatementHandle,
    'ForStatement' : forStatementHandle,

    'Literal' : literalHandel,
    'Identifier' : identifierHandel,
    'MemberExpression' : memberExpressionHandel,

    'UnaryExpression' : unaryHandel,
    'UpdateExpression' : updateHandel,

    'AssignmentExpression': assignmentExpressionHandel,
    'BinaryExpression' : binaryExpressionHandel,



};

function checkType(obj){
    //let elements = [];
    //elements = typeHandel[obj.type](obj);
    return typeHandel[obj.type](obj);
    //return elements;
}

function functionDeclarationHandle(obj){
    //let elements = [];
    model[index] = {line:raw,type:'function declaration',name:obj.id.name,condition:'',value:''};
    index++;
    obj.params.forEach(param => {
        model[index] = {line:raw,type:'variable declaration',name:param.name,condition:'',value:''};
        index++;
    });
    raw++;
    checkType(obj.body);

    //return elements;
}

function variableDeclarationHandle(obj){
    obj.declarations.forEach(variable => {
        if(variable.init == null){
            model[index] = {line: raw,type:'variable declaration',name:variable.id.name,condition:'',value:'null'};
        }else{
            if(variable.init.type === 'MemberExpression'){
                model[index] = {line: raw,type:'variable declaration',name:variable.id.name,condition:'',value: checkType(variable.init)};
            }else{
                model[index] = {line: raw,type:'variable declaration',name:variable.id.name,condition:'',value:variable.init.value};
            }
        }
        index++;
    });
    raw++;
}

function whileStatementHandle(obj){
    //let elements = [];
    let testLeft = checkType(obj.test.left);
    let testRight = checkType(obj.test.right);

    model[index] = {line:raw,type:'while statement',name:'',condition: testLeft + ' ' + obj.test.operator + ' ' + testRight,value:''};
    raw++;
    index++;
    checkType(obj.body);
    //return elements;
}

function ifStatementHandle(obj){
    let testLeft = checkType(obj.test.left);let testRight = checkType(obj.test.right);
    model[index] = {line:raw,type:ifType,name:'',condition: testLeft + ' ' + obj.test.operator + ' ' + testRight,value:''};
    raw++;index++;
    checkType(obj.consequent);
    if (obj.alternate != null && obj.alternate.type == 'IfStatement') {
        ifType = 'else if statement';
        ifStatementHandle(obj.alternate);
    } else if(obj.alternate != null) {
        model[index] = {line: raw, type: 'else statement',name:'',condition:'',value:''};
        raw++;
        index++;
        checkType(obj.alternate);
    }


}

function blockStatementHandle(obj){
    //let elements = [];
    //let i =0;
    obj.body.forEach(param => {
        checkType(param);
    });
    //return elements;
}

function expressionStatementHandle(obj){
    return checkType(obj.expression);
}

function returnStatementHandle(obj){
    let argument;
    if(obj.argument != null){
        argument = checkType(obj.argument);
    }else{
        argument = '';
    }
    model[index] = {line:raw,type:'return statement',name:'',condition:'',value:argument};
    raw++;
    index++;
}

function forStatementHandle(obj){
    let testLeft = checkType(obj.test.left);
    let testRight = checkType(obj.test.right);
    model[index] = {line:raw,type:'for statement',name:'',condition: testLeft + ' ' + obj.test.operator + ' ' + testRight,value:''};
    index++;
    checkInitInForStatement(obj);
    checkUpdateInForStatement(obj);
    raw++;
    checkType(obj.body);

}

function checkInitInForStatement(obj){
    if(obj.init != null && obj.init.type === 'AssignmentExpression' ){
        model[index] = {line:raw,type:obj.init.type,name:checkType(obj.init.left),condition:'',value:checkType(obj.init.right)};
        index++;
    }else if(obj.init.type === 'VariableDeclaration' ){
        variableDeclarationInForStatementHandle(obj.init.declarations[0]);
    }else{
        model[index] = {line:raw,type:obj.init.type,name:checkType(obj.init),condition:'',value:''};
        index++;
    }
}

function variableDeclarationInForStatementHandle(variable){
    if(variable.init != null){
        model[index] = {line: raw,type:'variable declaration',name:variable.id.name,condition:'',value:variable.init.value};
    }else{
        model[index] = {line: raw,type:'variable declaration',name:variable.id.name,condition:'',value: 'null'};
    }
    index++;
}

function checkUpdateInForStatement(obj){
    if(obj.update != null && obj.update.type === 'AssignmentExpression' ){
        model[index] = {line:raw,type:obj.update.type,name:checkType(obj.update.left),condition:'',value:checkType(obj.update.right)};
        index++;
    }else{
        model[index] = {line: raw, type: obj.update.type, name: checkType(obj.update), condition: '', value: ''};index++;
    }

}

function literalHandel(literal){
    return literal.value;
}

function identifierHandel(identifier){
    return identifier.name;
}

function memberExpressionHandel(me){
    let property = checkType(me.property);
    let nameProperty = me.object.name;

    return nameProperty + '[' + property + ']';
}

function unaryHandel(un){
    let operator = un.operator;
    let argument = checkType(un.argument);
    return operator+argument;
}

function updateHandel(update){
    let operator = update.operator;
    let argument = checkType(update.argument);
    if(!update.prefix){
        return argument+operator;
    }else{
        return operator+argument;
    }

}

function assignmentExpressionHandel(assignment){
    let assignmentLeft = checkType(assignment.left);
    let assignmentRight = checkType(assignment.right);
    model[index] = {line:raw,type:'assignment expression',name:assignmentLeft,condition:'',value: assignmentRight};
    raw++;
    index++;
}

function binaryExpressionHandel(binary){
    let operator = binary.operator;
    let binaryLeft = checkType(binary.left);
    let binaryRight = checkType(binary.right);
    if(binary.left.type === 'BinaryExpression'){
        binaryLeft = '(' + binaryLeft + ')';
    }
    if(binary.right.type === 'BinaryExpression'){
        binaryRight = '(' + binaryRight + ')';
    }
    return binaryLeft+operator+binaryRight;
}

export {parseCode,getElementFromParseCode,createTable};


