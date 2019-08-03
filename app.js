$(function(){

    function sendToGa(){
        try {
                ga(...arguments);
            } 
         catch (error) {
            console.log("There is a problem with Google Analytics")
        }
    }

    let A = localStorage.playerA || "🐶";
    let B = localStorage.playerB || "🐱";
    const size = 12;
    function initBoard(){
        //Create size*size boxes
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
            $("#winner").text(won==1?A:B);
            showPopup("win");
            boardState.fill(0);
            updateBoard();
            console.log("Does this run?")
            //Google Analytics
            sendToGa('send', 'event', 'sendToGame', 'finished');
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
        sendToGa('send', 'event', 'popup',which);
    }

    $("#footer a").click(function(){
        showPopup($(this).data("popup"))
    });
    
    $(".popup").click(function(event){
        event.stopImmediatePropagation();
    })
    $("#overlay,.close").click(hidePopups);
    
    
    //Settings
    //Load settings at the startup
    $("#playerA").val(A);
    $("#playerB").val(B);

    $("input").change(function(){
        A = $("#playerA").val();
        B = $("#playerB").val();
        localStorage.playerA = A;
        localStorage.playerB = B;
        updateBoard();
    })

    $(".settings a").click(function(){
        var AB = $(this).text().split("&");
        A = AB[0];
        B = AB[1];
        $("#playerA").val(A);
        $("#playerB").val(B);
        localStorage.playerA = A;
        localStorage.playerB = B;  
        updateBoard();
    })
})