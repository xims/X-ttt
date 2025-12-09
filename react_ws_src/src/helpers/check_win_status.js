const check_win_status = (cell_vals, board_size) => {
   
   const winning_cells = []; 

   for (let i=1; i<=board_size*board_size; i++) {
      const row = Math.ceil(i/board_size);
      const col = (i%board_size) > 0 ? (i%board_size) : board_size;
      const cell_value = cell_vals[`c${(i)}`]
     // console.log("checking cell (", row, ", ", col, ") for value: ", cell_value, "cell vals: ", cell_vals);
      if(cell_value) {
          const row_result = checkRow(cell_vals, row, col, board_size);
          if(row_result.length > 0) { 
            //winning_cells.push(row_result);
            return row_result;
          }

          const col_result = checkCol(cell_vals, row, col, board_size);
          if(col_result.length > 0) { 
            //winning_cells.push(col_result);
            return col_result;
          }

          const diagonal_result = checkDiagonal(cell_vals, row, col, board_size);

          if(diagonal_result.length > 0) { 
            //winning_cells.push(diagonal_result);
            return diagonal_result;
          }
     } 
   }

   return winning_cells;

}

 const get_cell_id = (row, col, board_size) => `c${(row-1)*board_size+col}`;

 const check_sequence = (sequence) => {
    const check_value = sequence[0];
    if(!check_value) return false;
    for(let i=0; i<sequence.length; i++){
      if(!sequence[i] || check_value !== sequence[i]) {
        return false;
      }
    }
    return true;
 }

 // check if the cell has all the same values in the same row
 const checkRow = (cell_vals, row, col, board_size) => {
  // if current cell is not in the first column, there is no need to check further
  if(col > 1) return false;
  
  const sequence = [];
  const cell_ids = [];
  for(let i=1; i<=board_size; i++){
    const cell_id = get_cell_id(row, i, board_size);
    const cell_value = cell_vals[`${cell_id}`];
    sequence.push(cell_value);
    cell_ids.push(cell_id);
  }
 
  const result = check_sequence(sequence);

  return result ? cell_ids : [];

 }

 // check if the cell has all the same values in the same column
 const checkCol = (cell_vals, row, col, board_size) => {
  // if current cell is not in the first row, there is no need to check further
  if(row > 1) return false;
  
  const sequence = [];
  const cell_ids = [];
  
  for(let i=1; i<=board_size; i++){
    const cell_id = get_cell_id(i, col, board_size);
    const cell_value = cell_vals[`${cell_id}`];
    sequence.push(cell_value);
    cell_ids.push(cell_id);
  }
  const result = check_sequence(sequence);

  return result ? cell_ids : [];

 }

 // check if the cell has all the same values diagonally
 const checkDiagonal = (cell_vals, row, col, board_size) => {
   // only need to check the cells at (1,1) and (1, board_size)
   if(row > 1) return false;
   if(col !== 1 && col !== board_size) return false;

   let sequence = [];
   let cell_ids = [];
   // from left to right
   for(let i=1; i<=board_size; i++){
    const cell_id = get_cell_id(i, i, board_size);
    const cell_value = cell_vals[`${cell_id}`];
    sequence.push(cell_value);
    cell_ids.push(cell_id);
   }
   const left_to_right = check_sequence(sequence);

   if(left_to_right) {
    return cell_ids;
   }

   // from right to left
   sequence = [];
   cell_ids = [];
   for(let i=1; i<=board_size; i++){
     const cell_id = get_cell_id(i, board_size-i+1, board_size);
     const cell_value = cell_vals[`${cell_id}`];
     sequence.push(cell_value);
     cell_ids.push(cell_id);
   }
   const right_to_left = check_sequence(sequence);
   if(right_to_left) {
    return cell_ids;
   }
  
   return [];
 }

export default check_win_status;