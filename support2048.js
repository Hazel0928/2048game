documentWidth=window.innerWidth;
gridContainerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellSpace=0.04*documentWidth;

function getPosTop(i,j){
    return cellSpace+i*(cellSpace+cellSideLength);
}

function getPosLeft(i,j){
    return cellSpace+j*(cellSpace+cellSideLength);
}

function getNumberBackgroundColor(number) {
    switch(number){
        case 2: return "#eee4da"; break;
        case 4: return "#ede0c8"; break;
        case 8: return "#f2b179"; break;
        case 16: return "#f59563"; break;
        case 32: return "#f67c5f"; break;
        case 64: return "#f65e3b"; break;
        case 128: return "#edcf72"; break;
        case 256: return "#edcc61"; break;
        case 512: return "#9c0"; break;
        case 1024: return "#33b5eb"; break;
        case 2048: return "#09c"; break;
        case 4096: return "#a6c"; break;
        case 8192: return "#93c"; break;
    }
    return "black";
}
function getNumberColor(number){
    if(number<=4)
        return "#776e65";
    
    return "white";
}
function nospace(board){
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if(board[i][j]==0)
            return false;
        }
    }
    return true;//没空间了
}
function canMoveLeft(board){ //如果左列没有数字或左列数字和自己相等，则可以向左移动
    for( let i=0; i<4;i++)
    {
        for(let j=1;j<4;j++)
        {
            if(board[i][j]!=0){
                if(board[i][j-1]==0||board[i][j-1]==board[i][j])
                return true;
            }

        }
    }
    return false;
} 
function canMoveUp( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ )
            if( board[i][j] != 0 )
                if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] )
                    return true;

    return false;
}
function canMoveRight(board){ //如果左列没有数字或左列数字和自己相等，则可以向左移动
    for( let i=0; i<4;i++)
    {
        for(let j=0;j<3;j++)
        {
            if(board[i][j]!=0){
                if(board[i][j+1]==0||board[i][j+1]==board[i][j])
                return true;
            }

        }
    }
    return false;
} 
function canMoveDown(board){  //返回true表示全局有可以移动的格子，否则就不能移动
    for(let j=0;j<4;j++){
         for(let i=0;i<3;i++){
            if(board[i][j]!=0){
                if(board[i+1][j]==0||board[i+1][j]==board[i][j])
                return true;
            }
        }
    }
    return false;
}

function noBlockHorizontal(row, col1,col2,board){ //水平方向上 从第row行的col1列到col2列是否有障碍物
    for(let i=col1+1;i<col2;i++)
    {
        if(board[row][i]!=0) //存在障碍物
        return false;
    }
    return true;
}

function noBlockVertical(col,row1,row2,board){
    for(let i=row1+1;i<row2;i++)
    {
        if (board[i][col]!=0)
        return false;
    }
    return true;
}

function nomove(board){
    if (
        canMoveLeft(board)||
        canMoveRight(board)||
        canMoveUp(board)||
        canMoveDown(board)
    )
    return false;

    return true;
}