var allowed_variable_names = [
    { id: 'alpha', text: 'alpha' },
    { id: 'beta', text: 'beta' },
    { id: 'gamma', text: 'gamma' },
    { id: 'theta', text: 'theta' },
    { id: 'var', text: 'variable' },
    { id: 'my_var', text: 'my var' },
    { id: 'my_variable', text: 'my variable' },
    { id: 'random_number', text: 'random number' },
    { id: 'a', text: 'a' },
    { id: 'b', text: 'b' },
    { id: 'c', text: 'c' },
    { id: 'd', text: 'd' },
    { id: 'e', text: 'e' },
    { id: 'f', text: 'f' },
    { id: 'g', text: 'g' },
    { id: 'h', text: 'h' },
    { id: 'i', text: 'i' },
    { id: 'j', text: 'j' },
    { id: 'k', text: 'k' },
    { id: 'l', text: 'l' },
    { id: 'm', text: 'm' },
    { id: 'n', text: 'n' },
    { id: 'o', text: 'o' },
    { id: 'p', text: 'p' },
    { id: 'q', text: 'q' },
    { id: 'r', text: 'r' },
    { id: 's', text: 's' },
    { id: 't', text: 't' },
    { id: 'u', text: 'u' },
    { id: 'v', text: 'v' },
    { id: 'x', text: 'x' },
    { id: 'y', text: 'y' },
    { id: 'z', text: 'z' },
]

var allowed_relational_operators = [
    { id: 'equal_to', text: 'equal to' },
    { id: 'equal_to', text: 'equals to' },
    { id: 'equal_to', text: 'equals' },
    { id: 'greater_than', text: 'greater than' },
    { id: 'greater_than', text: 'is greater than' },
    { id: 'less_than', text: 'less than' },
    { id: 'less_than', text: 'is less than' },
    { id: 'less_than_or_equal_to', text: 'is less than or equal to' },
    { id: 'greater_than_or_equal_to', text: 'is greater than or equal to' },
    { id: 'less_than_or_equal_to', text: 'less than or equal to' },
    { id: 'greater_than_or_equal_to', text: 'greater than or equal to' },
]

var allowed_logical_operators = [
    { id: 'and', text: 'and' },
    { id: 'or', text: 'or' },
    { id: 'not', text: 'not' },
]

var allowed_arithmetic_operators = [
    { id: 'sum', text: 'sum' },
    { id: 'difference', text: 'difference' },
    { id: 'product', text: 'product' },
    { id: 'division', text: 'division' },
    { id: 'modulo', text: 'remainder' },
]

var allowed_numbers = [
    { id: 'zero', text: 'zero' },
    { id: 'one', text: 'one' },
    { id: 'two', text: 'two' },
    { id: 'three', text: 'three' },
    { id: 'four', text: 'four' },
    { id: 'five', text: 'five' },
    { id: 'six', text: 'six' },
    { id: 'seven', text: 'seven' },
    { id: 'eight', text: 'eight' },
    { id: 'nine', text: 'nine' },
]

var allowed_function_names = [
    { id: 'fibonacci', text: 'fibonacci' },
    { id: 'factorial', text: 'factorial' },
    { id: 'prime_finder', text: 'prime finder' },
    { id: 'display', text: 'display' },
    { id: 'input', text: 'input' },
    { id: 'reverse_digits', text: 'reverse digits' },
    { id: 'swap_two_numbers', text: 'swap two numbers' },
    { id: 'check_palindrome', text: 'check palindrome' },
    { id: 'armstrong_number', text: 'armstrong number' },
    
]

var known_commands = [
    { id: 'js_move_up', text: 'javascript move up' },
    { id: 'js_move_down', text: 'javascript move down' },
    { id: 'js_move_left', text: 'javascript move left' },
    { id: 'js_move_right', text: 'javascript move right' },

    { id: 'py_move_up', text: 'python move up' },
    { id: 'py_move_down', text: 'python move down' },
    { id: 'py_move_left', text: 'python move left' },
    { id: 'py_move_right', text: 'python move right' },
    { id: 'iris_javascript', text: 'javascript full screen'},
    { id: 'iris_python', text: 'python full screen'},
    { id: 'iris_full', text: 'show both editors'},

    { id: 'js_clear', text: 'javascript clear' },
    { id: 'py_clear', text: 'python clear' },
   
    { id: 'iris_run_py', text: 'run python' },
    { id: 'iris_run_js', text: 'run javascript' },
    
    { id: 'iris_undo', text: 'undo statement' },
    { id: 'iris_redo', text: 'redo statement'},

]

function IsKnownCommand(command) {
    for (let each of known_commands) {
        if (each.id == command) return true
    }
    return false
}


function setUpNlp() {
    if (window.Bravey === undefined) {
        throw "Bravey is not available";
    }
         
    var nlp = new Bravey.Nlp.Fuzzy();
    {
        nlp.addIntent('declare_integer', [
            { entity: 'declare_integer_var_name', id: 'declare_integer_var_name' },
            { entity: 'declare_integer_var_value', id: 'declare_integer_var_value' },
        ]);

        let declare_integer_var_name = new Bravey.StringEntityRecognizer('declare_integer_var_name');
        
        for (let each of allowed_variable_names) {
            declare_integer_var_name.addMatch(each.id, each.text)
        }
        nlp.addEntity(declare_integer_var_name);

        let declare_integer_var_value = new Bravey.NumberEntityRecognizer('declare_integer_var_value');
        nlp.addEntity(declare_integer_var_value);

        // training with examples
        nlp.addDocument(
            'Declare an integer {declare_integer_var_name} with value {declare_integer_var_value}',
            'declare_integer'
        );

        nlp.addDocument(
            'Create an integer {declare_integer_var_name} with value {declare_integer_var_value}',
            'declare_integer'
        );

        // test our code
        showResults(nlp.test('declare an integer alpha with value 100'));
        
    }

    //function creation
    {
        nlp.addIntent('create_function', [
            { entity: 'create_function_name', id: 'create_function_name' },
            { entity: 'create_function_argument', id: 'create_function_argument' },
        ]);
        

        let create_function_name = new Bravey.StringEntityRecognizer('create_function_name')
        for (let each of allowed_function_names) {
            create_function_name.addMatch(each.id, each.text)
        }
        nlp.addEntity(create_function_name)

        let create_function_argument = new Bravey.StringEntityRecognizer('create_function_argument')
        for (let each of allowed_variable_names) {
            create_function_argument.addMatch(each.id, each.text)
        }

        nlp.addEntity(create_function_argument);

        nlp.addDocument(
            'Create a function {create_function_name} with argument {create_function_argument}',
            'create_function'
        )

        showResults(nlp.test('create function fibonacci with argument alpha.'));
        showResults(nlp.test('create function print with argument alpha.'));
        showResults(nlp.test('create function input with argument alpha.'));
        showResults(nlp.test('create function display with argument alpha.'));
        
    }
       
    // string declaration
    {
        nlp.addIntent('declare_string', [
            { entity: 'declare_string_var_name', id: 'declare_string_var_name' },
            { entity: 'declare_string_var_value', id: 'declare_string_var_value' },
        ]);

        let declare_string_var_name = new Bravey.StringEntityRecognizer('declare_string_var_name');
        for (let each of allowed_variable_names) {
            declare_string_var_name.addMatch(each.id, each.text)
        }
        nlp.addEntity(declare_string_var_name);

        let declare_string_var_value = new Bravey.NumberEntityRecognizer('declare_string_var_value');
        nlp.addEntity(declare_string_var_value);

        // training with examples
        nlp.addDocument(
            'Declare an string {declare_string_var_name} with value {declare_string_var_value}',
            'declare_string'
        );

        // testing our code
        showResults(nlp.test('declare an string alpha with value tomato'));
    }
    
    //loop creation
    {
        nlp.addIntent('create_loop', [
            { entity: 'create_loop_counts', id: 'create_loop_counts' },
        ]);
        
        let create_loop_counts = new Bravey.NumberEntityRecognizer('create_loop_counts');
        nlp.addEntity(create_loop_counts);

        // training with examples
        nlp.addDocument(
            'Create a loop for {create_loop_counts} counts',
            'create_loop'
        );

        // test our code
        showResults(nlp.test('run a loop for 100 counts'));
        showResults(nlp.test('make a loop for 20 counts'));
    }
    // if else case
    {
        nlp.addIntent('if_condition', [
            { entity: 'if_condition_1_lhs', id: 'if_condition_1_lhs' },
            { entity: 'if_condition_1_op', id: 'if_condition_1_op' },
            { entity: 'if_condition_1_rhs', id: 'if_condition_1_rhs' },
            
            { entity: 'if_condition_join_op', id: 'if_condition_join_op' },
            
            { entity: 'if_condition_2_lhs', id: 'if_condition_2_lhs' },
            { entity: 'if_condition_2_op', id: 'if_condition_2_op' },
            { entity: 'if_condition_2_rhs', id: 'if_condition_2_rhs' },
        ]);

        //matching variable names for left hand side(LHS)
        for (let target of ['if_condition_1_lhs', 'if_condition_2_lhs']) {
            let variable_name = new Bravey.StringEntityRecognizer(target)
            for (let each of allowed_variable_names) {
                variable_name.addMatch(each.id, each.text)
            }
            nlp.addEntity(variable_name)
        }
         
        //matching Numbers for right hand side(RHS)
        for (let target of ['if_condition_1_rhs', 'if_condition_2_rhs']) {
            let number = new Bravey.StringEntityRecognizer(target)
            for (let each of allowed_numbers) {
                number.addMatch(each.id, each.text)
            }
            nlp.addEntity(number)
        }

        // relational operators for LHS & RHS
        for (let target of ['if_condition_1_op', 'if_condition_2_op']) {
            let operator = new Bravey.StringEntityRecognizer(target)
            for (let each of allowed_relational_operators) {
                operator.addMatch(each.id, each.text)
            }
            nlp.addEntity(operator)
        }
        
        {
            let operator = new Bravey.StringEntityRecognizer('if_condition_join_op')
            for (let each of allowed_logical_operators) {
                operator.addMatch(each.id, each.text)
            }
            nlp.addEntity(operator)
        }
        
        //training with examples
        nlp.addDocument(
            'if alpha equals one and alpha equals two',
            'if_condition',
            { fromFullSentence: true, expandIntent: true },
        )

        nlp.addDocument(
            'if alpha equals one or beta equals one',
            'if_condition',
            { fromFullSentence: true, expandIntent: true },
        )
        
        nlp.addDocument(
            'if alpha equals one and x equals zero',
            'if_condition',
            { fromFullSentence: true, expandIntent: true },
        )

        showResults(nlp.test('if alpha equals one or beta equals two'))
    }
     
    //arithmetic operations
    {
        nlp.addIntent('arithmetic_operation', [
            { entity: 'arithmetic_operand_1', id: 'arithmetic_operand_1' },
            { entity: 'arithmetic_operand_2', id: 'arithmetic_operand_2' },
            { entity: 'arithmetic_operator', id: 'arithmetic_operator' },
            { entity: 'arithmetic_lhs', id: 'arithmetic_lhs' },
        ])

        nlp.addEntity(new Bravey.NumberEntityRecognizer('arithmetic_operand_2'))
        let arithmetc_operator = new Bravey.StringEntityRecognizer('arithmetic_operator')
        for (let each of allowed_arithmetic_operators) {
            arithmetc_operator.addMatch(each.id, each.text)
        }
        nlp.addEntity(arithmetc_operator)

        for (let target of ['arithmetic_operand_1', 'arithmetic_lhs']) {
            let variable_name = new Bravey.StringEntityRecognizer(target)
            for (let each of allowed_variable_names) {
                variable_name.addMatch(each.id, each.text)
            }
            nlp.addEntity(variable_name)
        }
    
        // training with examples
        nlp.addDocument(
            'store sum of x and 3 in alpha',
            'arithmetic_operation',
            { fromFullSentence: true, expandIntent: true }
        )

        nlp.addDocument(
            'store product of alpha and 30 in beta',
            'arithmetic_operation',
            { fromFullSentence: true, expandIntent: true }
        )

        nlp.addDocument(
            'store difference of gamma and 10 in x',
            'arithmetic_operation',
            { fromFullSentence: true, expandIntent: true }
        )

        nlp.addDocument(
            'store the division of y and 8 in y',
            'arithmetic_operation',
            { fromFullSentence: true, expandIntent: true }
        )
        // testing our code
        showResults(nlp.test('store the sum of z and 20 in z'))
        
    }

    for (let command of known_commands) {
        nlp.addDocument(command.text, command.id, { fromFullSentence: true, expandIntent: true })
    }
   
    //PRINTING OUR FUNCTION
    {
        nlp.addIntent('print', [
            { entity: 'argument', id: 'argument' },
            { entity: 'number', id: 'number' },
        ]);

        let argument = new Bravey.StringEntityRecognizer('argument');
        for (let each of allowed_variable_names) {
            argument.addMatch(each.id, each.text)
        }
        nlp.addEntity(argument);

        nlp.addEntity(new Bravey.NumberEntityRecognizer('number'))

        // training with examples
        nlp.addDocument(
            'print {argument}',
            'print'
        );

        nlp.addDocument(
            'print {number}',
            'print'
        )

        // testing our code
        showResults(nlp.test('print alpha'));
        showResults(nlp.test('print 100'))
    }

    return nlp;
}

function showResults(result) {
    if (result) {
        for (let entity of result.entities) {
            console.log(entity.id, entity.value);
        }
    } else {
        console.log('something failed here')
    }
}
