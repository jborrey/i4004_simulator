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
    decrement_register(1);
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
	return next_next_pc();
}

var input_to_r1 = function() {
	setRegister(1, cellValue(next_pc()));
	return next_next_pc();
}

var print_r0 = function() {
	document.getElementById('cell_output').innerText = registerValue(0);
	return next_pc();
}

var jump_to_if_r0_is_not_zero = function() {
	return registerValue(0) != 0 ?  cellValue(next_pc()) : next_next_pc();
}

var jump_to_if_r0_is_zero = function() {
	return registerValue(0) == 0 ?  cellValue(next_pc()) : next_next_pc();
}

var swap_r0_r1 = function() {
	var r0 = registerValue(0);
	var r1 = registerValue(1);
    setRegister(0, r1);
    setRegister(1, r0);
	return next_pc();
}

var beep = function() {
	// thanks https://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
    var sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    sound.play();
    return next_pc();
}

function next_next_pc() {
	pc = next_pc();
	return next_pc();
}

// 0 - Halt
// 1 - R0 = R0+1
// 2 - R0 = R0-1
// 3 - R1 = R1+1
// 4 - R1 = R1-1
// 5 - Swap R0 <-> R1
// 6 - Beep
// 7 - Print R0
// 8 - Jump to <address> if R0 != 0
// 9 - Jump to <address> if R0 == 0

var opcodes = {
    "0":  halt,
    "1":  increment_r0,
    "2":  decrement_r0,
    "3":  increment_r1,
    "4":  decrement_r1,
    "5":  swap_r0_r1,
    "6":  beep,
    "7":  print_r0
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
	return parseInt(cellFromNum(cell_num).innerText);
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
