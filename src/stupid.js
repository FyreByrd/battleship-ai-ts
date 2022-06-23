export const stupidAI = function(){
    let valid = Array(100).map((_, i) => i)

    /**
     * resets the AI
     */
    const reset = function() { guesses = Array(100).map((_, i) => i) }

    /**
     * makes a random guess, returns guess index
     * @param {number[]} board 100 int array representing the board
     * @param {{hit:number, miss:number, sunk:number}} flags int representation of flag values
     */
    const guess = function(board, flags) {
        
    }

    return {reset, guess}
}