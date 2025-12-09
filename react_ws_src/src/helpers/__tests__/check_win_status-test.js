jest.unmock('../check_win_status');
import check_win_status from '../check_win_status'


describe('check win status on a 3x3 board', () => {
   //  empty board
  
  it('should return empty array for an empty board', () => {
    const cell_vals = new Array(9).fill(null);
    expect(check_win_status(cell_vals, 3)).toEqual([]);
  });
  
  it('should return the winning cells in first row', () => {
    const cell_vals = {c1:'x', c2:'x', c3:'x'};
    expect(check_win_status(cell_vals, 3)).toEqual(['c1', 'c2', 'c3']);
  });

   // Column win (vertical) - first column all 'o'
  it('should return winning cells in first column', () => {
    const cell_vals = {
      'c1': 'o',
      'c4': 'o',
      'c7': 'o'
    };
    const result = check_win_status(cell_vals, 3);
    expect(result).toEqual(['c1', 'c4', 'c7']);
  });

  // diagonal win
  it('should return winning cells diagonally from top left to bottom right', () => {
    const cell_vals = {
      'c1': 'o',
      'c5': 'o',
      'c9': 'o'
    };
    const result = check_win_status(cell_vals, 3);
    expect(result).toEqual(['c1', 'c5', 'c9']);
  });

  // draw
  it('should detect draw', () => {
    const cell_vals = { 
      'c1': 'x',
      'c2': 'x',
      'c3': 'o',
      'c4': 'o',
      'c5': 'x',
      'c6': 'x',
      'c7': 'x',
      'c8': 'o',
      'c9': 'o'
    };
    const result = check_win_status(cell_vals, 3);
    expect(result).toEqual([]);
  });
});


describe('check win status on a 4x4 board', () => {
 
  it('should return empty array for an empty board', () => {
    const cell_vals = new Array(16).fill(null);
    expect(check_win_status(cell_vals, 4)).toEqual([]);
  });

  it('should return the winning cells in first row', () => {
    const cell_vals = {
      'c1': 'x',
      'c2': 'x',
      'c3': 'x',
      'c4': 'x'
    };
    expect(check_win_status(cell_vals, 4)).toEqual(['c1', 'c2', 'c3', 'c4']);
  });

  it('should return the winning cells in first column', () => {
    const cell_vals = {
      'c1': 'x',
      'c5': 'x',
      'c9': 'x',
      'c13': 'x'
    };
    expect(check_win_status(cell_vals, 4)).toEqual(['c1', 'c5', 'c9', 'c13']);
  });

  it('should return winning cells diagonally from top right to bottom left', () => {
    const cell_vals = {
      'c4': 'x',
      'c7': 'x',
      'c10': 'x',
      'c13': 'x'
    };
    expect(check_win_status(cell_vals, 4)).toEqual(['c4', 'c7', 'c10', 'c13']);
  });

  it('should detect draw', () => {
    const cell_vals = {
      'c1': 'o','c2': 'x','c3': 'o','c4': 'o',
      'c5': 'x','c6': 'x','c7': 'x','c8': 'o',
      'c9': 'o','c10': 'o','c11': 'x','c12': 'o',
      'c13': 'o','c14': 'x','c15': 'x','c16': 'x'
    };
    expect(check_win_status(cell_vals, 4)).toEqual([]);
  });

});


describe('check win status on a 4x4 board', () => {
  
  it('should return empty array for an empty board', () => {
    const cell_vals = new Array(25).fill(null);
    expect(check_win_status(cell_vals, 5)).toEqual([]);
  });

  it('should return the winning cells in second  row', () => {
    const cell_vals = {
      'c6': 'x',
      'c7': 'x',
      'c8': 'x',
      'c9': 'x',
      'c10': 'x'
    };
    expect(check_win_status(cell_vals, 5)).toEqual(['c6', 'c7', 'c8', 'c9', 'c10']);
  });

  it('should return the winning cells in third column', () => {
    const cell_vals = {
      'c3': 'x',
      'c8': 'x',
      'c13': 'x',
      'c18': 'x',
      'c23': 'x'
    };
    expect(check_win_status(cell_vals, 5)).toEqual(['c3', 'c8', 'c13', 'c18', 'c23']);
  });

  it('should return the winning cells diagonally from top left to bottom right', () => {
    const cell_vals = {
      'c1': 'x',
      'c7': 'x',
      'c13': 'x',
      'c19': 'x',
      'c25': 'x'
    };
    expect(check_win_status(cell_vals, 5)).toEqual(['c1', 'c7', 'c13', 'c19', 'c25']);
  });

  it('should detect draw', () => {
    const cell_vals = {
      'c1': 'o','c2': 'x','c3': 'o','c4': 'o','c5': 'x',
      'c6': 'x','c7': 'o','c8': 'x','c9': 'x','c10': 'o',
      'c11': 'x','c12': 'x','c13': 'o','c14': 'x','c15': 'x',
      'c16': 'o','c17': 'x','c18': 'x','c19': 'x','c20': 'x',
      'c21': 'x','c22': 'o','c23': 'x','c24': 'x','c25': 'o'
    };
    expect(check_win_status(cell_vals, 5)).toEqual([]);
  });
});
