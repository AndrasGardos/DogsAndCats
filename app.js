$(function(){
    const A = "🐶";
    const B = "🐱";
    const size = 15;
    function initBoard(){
        //Create a hundred boxes
        let html = new Array(size*size).fill("<div class='box'></div>").join("");
        $("#game").html(html);
    }

    function updateBoard(){
        
        const symbols = [B,"",A]
        $(".box").each((index,elem) => {
           
            elem.innerText = symbols[boardState[index]+1];
            elem.style.cursor = (boardState[index]!=0)?"not-allowed":"pointer";
        })
    }

    function checkWin(){
        //Check for every pos if it's a middle of a 5
        // TODO : check only smaller area
        function get(x){return boardState[x]||0};
        const winPositions = [[-2,-1,0,1,2],//Horizontal,
        [-2*size,-size,0,size,2*size],//Vertical
        [-2*size-2,-size-1,0,size+1,size*2+2],//Diag \,
        [2*size-2,size-1,0,-size+1,-2*size+2]]//Diag /;
        console.log(winPositions);
        let won = 0;
        for(let i=0;i<boardState.length;i++){
            
            winPositions.forEach(wp=>{
                if(get(i)){ //If i is X or O
                    if(wp.every(p => get(p+i)==get(i))){ //If all equals
                        won = get(i);
                    }
                }
            })
        }
        if(won!=0){
            alert("Game over! Congratulations, " + (won==1?A:B) + " has won this round.")
            boardState.fill(0);
            updateBoard();
        }
    }

    //Main
    initBoard();
    let nextIsX = true;
    let boardState = new Array(size*size).fill(0);
    $(".box").click(function(){
        let index = $(this).index();
        if(boardState[index]==0){
            boardState[index] = nextIsX?1:-1;
            nextIsX = !nextIsX;
            updateBoard();
            checkWin();
        }
    })

    //Popups
    
    function hidePopups(){
        $("#overlay").hide();
        $(".popup").hide();
    }
    
    function showPopup(which){
        $("#overlay").show();
        $(".popup."+which).show();
    }

    $("#footer a").click(function(){
        showPopup($(this).data("popup"))
    });
    $("#overlay").click(hidePopups);
})