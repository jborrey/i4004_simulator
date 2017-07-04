var pc = 0;
var runStepId;
var r0 = 0;
var r1 = 0;
initialProgram = "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
var no_update_cells = false;

function next_pc() {
    var current_pc = pc;
    current_pc += 1;
    return current_pc % 16;
}

function setRegister(register_num, value){
	var register = document.getElementById('cell_r' + register_num.toString());
	register.innerText = value.toString();
}

function increment_register(register_num){
	var value = registerValue(register_num);
	setRegister(register_num, value + 1); // no mod, we are cheating ...
}

function decrement_register(register_num){
	var value = registerValue(register_num);
	setRegister(register_num, value - 1); // no mod, we are cheating ...
}

function registerValue(register_num) {
	var register = document.getElementById('cell_r' + register_num.toString());
	return parseInt(register.innerText)
}

var halt = function() {
    executeStop();
    return pc;
}

var increment_r0 = function() {
    increment_register(0);
	return next_pc();
}

var increment_r1 = function() {
    increment_register(1);
	return next_pc();
}

var decrement_r0 = function() {
    decrement_register(0);
	return next_pc();
}

var decrement_r1 = function() {
    decrement_register(0);
	return next_pc();
}

var r0_eq_r0_plus_r1 = function() {
  setRegister(0, registerValue(0) + registerValue(1));
  return next_pc();
}

var r0_eq_r0_minus_r1 = function() {
  setRegister(0, registerValue(0) - registerValue(1));
  return next_pc();
}

var input_to_r0 = function() {
	setRegister(0, cellValue(pc + 1));
	next_pc();
	return next_pc();
}

var input_to_r1 = function() {
	setRegister(0, cellValue(next_pc()));
	pc = next_pc();
	return next_pc();
}

var print_r0 = function() {
	document.getElementById('cell_output').innerText = registerValue(0);
	return next_pc();
}

var jump_to_if_r0_is_not_zero = function() {
	return registerValue(0) != 0 ? next_pc() : cellValue(next_pc());
}

var jump_to_if_r0_is_zero = function() {
	return registerValue(0) == 0 ? next_pc() : cellValue(next_pc());
}

// 0 - Halt
// 1 - R0 = R0+1
// 2 - R0 = R0-1 
// 3 - R1 = R1+1 
// 4 - R1 = R1-1 
// 5 - R0=R0+R1 
// 6 - R0=R0-R1 
// 7 - Print R0
// 8 - Jump to <address> if R0 != 0
// 9 - Jump to <address> if R0 == 0
// 10 - <value> -> R0
// 11 - <value> -> R1
// 12 - R0 -> <address>
// 13 - R1 -> <address>
// 14 - R0 <-> <address>
// 15 - R1 <-> <address>

var opcodes = {
    "0":  halt,
    "1":  increment_r0,
    "2":  decrement_r0,
    "3":  increment_r1,
    "4":  decrement_r1,
    "5":  r0_eq_r0_plus_r1,
    "6":  r0_eq_r0_minus_r1,
    "7":  input_to_r0,
    "8":  input_to_r1,
    "9":  print_r0,
    "10": jump_to_if_r0_is_not_zero,
    "11": jump_to_if_r0_is_zero
};


function cellsArray() {
	return Array.from(document.getElementsByClassName('memory_cell_value'));
}

function programArray(cells) {
    return cells.map(function(cell) { return cell.innerText; });
}

function clearCellHighlights(cells) {
    cells.forEach(function(cell) { cell.parentElement.setAttribute('style', '') });
}

function setProgramField(program) {
    var field = document.getElementById('memory_dump_field');
    field.innerText = program;
}

function syncCellsToProgram() {
	var memoryCells = cellsArray();
    var program = programArray(memoryCells)
    setProgramField(program.join());
}

function syncProgramToCells() {
	var programArrayChars = document.getElementById('memory_dump_field').innerText.split(',');
    cellsArray().forEach( function(cell, index) { cell.innerText = programArrayChars[index] });
}

function syncPc() {
	document.getElementById('cell_pc').innerText = pc.toString();
	setCellHighligh(pc)
}

function setCellHighligh(cell_num) {
	clearCellHighlights(cellsArray());
    var cell = cellFromNum(cell_num);
    cell.parentElement.setAttribute('style', 'background: aqua;')
}

function cellFromNum(cell_num) {
	return document.getElementById('cell_' + cell_num.toString());
}

function cellValue(cell_num) {
	return parseInt(cellFromNum(cell_num));
}

function executeStep() {
	opcode = cellFromNum(pc).innerText
    pc = opcodes[opcode](); // call command
    syncPc();
}

function executeReset() {
	pc = 0;
	r0 = 0;
	r1 = 0;
	syncPc();
	setRegister(0, 0);
	setRegister(1, 0);
}

function executeClear() {
	no_update_cells = true
	document.getElementById('memory_dump_field').innerText = initialProgram;
	no_update_cells = false
}

function executeRun() {
	runStepId = setInterval(function() { executeStep(); }, 100);
}

function executeStop() {
	clearInterval(runStepId);
}

function initalize() {
    syncCellsToProgram();
    syncPc();
}

function setBindings() {
	// binding between program and cells
	cellsArray().map(function(cell){
        cell.addEventListener('DOMSubtreeModified', function(){ 
        	if (!no_update_cells && document.activeElement != document.getElementById('memory_dump_field')){
        		syncCellsToProgram();
        	}
        });
	});
	document.getElementById('memory_dump_field').addEventListener('DOMSubtreeModified', function() {
		if (!document.activeElement.classList.contains('cell_value')){
        		syncProgramToCells();
    	}
    });


	// button and respective execution computeStep()
    document.getElementById('step_button').onclick  = function() { executeStep()  };
    document.getElementById('run_button').onclick   = function() { executeRun()   };
    document.getElementById('stop_button').onclick  = function() { executeStop()  };
    document.getElementById('reset_button').onclick = function() { executeReset() };
    document.getElementById('clear_button').onclick = function() { executeClear() };
}

window.onload = function start() {
	console.log('Starting 4004 processor ...');
	initalize();
	setBindings();
}