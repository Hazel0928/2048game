//游戏数据 4*4的格子 和一个分数
let board=new Array();
let score=0;
let hasConflicted=new Array();

let startx=0;
let starty=0;
let endx=0;
let endy=0;


//当整个程序加载完毕后运行的主函数。对于这个游戏，主函数只做一件事情就是开始新的游戏
$(document).ready(function(){
    prepareForMobile()
    newgame();
});

function prepareForMobile(){

    if(documentWidth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }
    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
    
}

function init() {
    for( let i=0;i<4;i++){
      for(let j=0;j<4;j++){

        let gridCell=$("#grid-cell-"+i+"-"+j);
        gridCell.css('top',getPosTop(i,j)); //设置每一个小格的绝对坐标
        gridCell.css('left',getPosLeft(i,j));
      }
    }

    for(let i=0;i<4;i++){
        board[i]=new Array(); //把board变成一个二维数组
        hasConflicted[i]=new Array()
        for(let j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        } 
    }
    updateBoardView();
    score=0;
    $("#score").text(0);
}



function updateBoardView(){
    $(".number-cell").remove();
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            //对每个board元素都应该生成一个number-cell
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            let theNumberCell= $('#number-cell-'+i+'-'+j);

            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2); //getPosTop()与getPosLeft()计算的是每一个小格子的左上角，各加上50就是格子的中心
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }
            else {
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));  //number-cell就把grid-cell覆盖着了
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j])); //背景色与board[i][j]的值有关，值不同背景色不同
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j]=false; //每次碰撞完，对hasConflicted进行一次归位
        }
    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
    
}

function generateOneNumber(){
    if(nospace(board))
    return false; //此时格子都满了 没有空间再生成一个数字了
    
    //随机一个位置
    let randx=parseInt(Math.floor(Math.random()*4)); //即使Math.floor()之后，这个数字是一个浮点数，因此需要parseInt()变成一个整型
    let randy=parseInt(Math.floor(Math.random()*4));

    let times=0;
    while (times<50){ //将死循环优化为给计算机50次机会，猜空白格的位置
        if(board[randx][randy]==0)
        break;
        randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));

        times++;
    }
    //如果50次计算机都没有猜出来，就人工地生成一个位置
    if(times===50){
        for(let i=0;i<4;i++){
            for(let j=0;j<4;j++){
                if(board[i][j]===0){
                    randx=i;
                    randy=j;
                }
            }
        }
    }
    
    //随机一个数字
    let randNumber=Math.random()<0.5?2:4; //以0.5：0.5的概率生成2或4
    //在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber); //显示数字是有动画效果的
    return true;
}

$(document).keydown(function(event) {
    event.preventDefault();//阻挡文本的默认效果，防止有滚动条时，按“下”也会拖拽滚动条
    switch(event.keyCode){
        case 37: //left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210); //为了让gameover时，动画能显现出来
                setTimeout("isgameover()",300);
            }
            break;
        case 38: //up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);}
            break;
        case 39: //right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);}
            break;
        case 40: //down
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);}
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart',function(event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    let deltax=endx-startx;
    let deltay=endy-starty;

    if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth){
        return;
    }
    //x
    if((Math.abs(deltax))>=(Math.abs(deltay))){
        if (deltax>0){
            //move right
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
        else {
            //move left;
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
    }

    //y
    else{
        if (deltay>0){
            //move down
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
        else {
            //move up
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
    }
});



function isgameover(){
    if(nospace(board)&&nomove(board)){
        gameover();
    }
}

function gameover(){
    alert("game over!");
}

function moveLeft(){ //落脚位置是否为空？落脚位置数字与待判定元素数字相等？移动路径中是否有障碍物？
    if(!canMoveLeft(board)){
        return false;
    }

    //moveLeft
    for(let i=0;i<4;i++){
        for(let j=1;j<4;j++){
            if(board[i][j]!=0){
                for(let k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] &&noBlockHorizontal(i,k,j,board)&& !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score); //通知前台，更新score
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200); //对整体数据进行一次刷新.用setTimeout函数是为了等待200ms再运行updateBoardView(),来保证showMoveAnimate()的动画效果出来
    return true;
}

function moveUp() {
        if(!canMoveUp(board)){
            return false;
        }
    
        //moveUp
        for(let j=0;j<4;j++){
            for(let i=1;i<4;i++){
                if(board[i][j]!=0){
                    for(let k=0;k<i;k++){
                        if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
                            //move
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[k][j]==board[i][j] &&noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                            //move
                            showMoveAnimation(i,j,k,j);
                            //add
                            board[k][j]+=board[i][j];
                            board[i][j]=0;
                            score+=board[k][j];
                            hasConflicted[k][j]=true;
                            updateScore(score);
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
}

function moveRight(){ //落脚位置是否为空？落脚位置数字与待判定元素数字相等？移动路径中是否有障碍物？
    if(!canMoveRight(board)){
        return false;
    }

    //moveRight
    for(let i=0;i<4;i++){
        for(let j=3;j>=0;j--){
            if(board[i][j]!=0){
                for(let k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] &&noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        hasConflicted[i][k]=true;
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200); //对整体数据进行一次刷新.用setTimeout函数是为了等待200ms再运行updateBoardView(),来保证showMoveAnimate()的动画效果出来
    return true;
}
function moveDown() {
    if(!canMoveDown(board)){
        return false;
    }

    //moveDown
    for(let i=3;i>=0;i--){
        for(let j=0;j<4;j++){
            if(board[i][j]!=0){
                for(let k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] &&noBlockVertical(j,i,k,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                    }
                }
            }
        }
    }
        setTimeout("updateBoardView()",200);
        return true;
}

    