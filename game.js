// IDEA: show onlyy points that are acessible
// IDEA: Show color of current player             ;)
// BUG: function for victory and draw             ;)
// BUG: check();

// 4: check() bug removed
// 5: dark mode
// 6: new_game works; columns+rows are dynamic; better dark mode;

var row_number = 6;      //--------
var column_number = 8;   //||||||||
var player = 'green';
var current_row = 3;
var current_column = 0;
var selected = false;
var stage = [];
var points = [];
var num = {'top':1,'bottom':2,'left':3,'right':4,'top_right':5,'top_left':6,'bottom_left':7,'bottom_right':8};
var darkmode = false;

$('.background_blend').css('background',player);

function create_points() { //create board for points
  for (let one = 0; one < row_number + 1; one++){
    for (let two = 0; two < column_number + 1; two++){
      $('.middle').append('<div row="'+one+'" column="'+two+'" class="point" onclick="point_clicked(this)" style="top:calc(10px - 6px + 60px * '+one+');left:calc(10px - 6px + 60px * '+two+')"></div>');
  };};
  $('.point[row="'+row_number / 2+'"][column="'+0+'"]').css({'box-shadow':'0 0 10px #f57c00','background':'#f57c00'});
  colour_points();
}

function colour_points() {
  if (darkmode == false) {$('.point').css('background','darkgray')}
  if (darkmode == true) {$('.point').css('background','white')}
  $('.point').css('box-shadow','inherit');
  $('.point[row="'+current_row+'"][column="'+current_column+'"]').css({'box-shadow':'0 0 10px #f57c00','background':'#f57c00'});
  $('.point[row="'+row_number+'"][column="'+column_number/2+'"]').css('background','red');
  $('.point[row="'+0+'"][column="'+column_number/2+'"]').css('background','green');
}

function create_point_array() {  //create points
  for (var row = 0; row < row_number+1; row++) {//+1 because I need points, not cells
      points[row] = [];
      for (var column = 0; column < column_number+1; column++) {
          points[row][column] = 0;//{}
  };};
  points[row_number / 2][0] = 2;
  current_column = 0;
  current_row = row_number / 2;
}

function create_board() { //create stage
  for (var row = 0; row < row_number + 1; row++) {//+2 to create a field around the main field
      stage[row] = [];
      for (var column = 0; column < column_number + 1; column++) {
          stage[row][column] = 0;
};};}

function clear_board() {
  $('.winner_plane').css('display', 'none');
  var c = document.getElementById("board");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  create_point_array();
  create_board();
  colour_points();
}

function won(winner) {
  $('.winner_plane p').text('Winner: '+winner+'! 🥳');
  $('.winner_plane').css({'display': 'block','background':player});
}

function check_localStorage() {
  if (localStorage.getItem('DarkMode') == null) {localStorage.setItem('DarkMode', false);
    } else {darkmode = localStorage.getItem('DarkMode');}
  if (localStorage.getItem('Obstacles') == null) {localStorage.setItem('Obstacles', false);
    } else {obstacles = localStorage.getItem('Obstacles');}
}

function ChangeSize(input, xy) {
  var val = $(input).val();
  val = 2 * Math.round(val / 2);

  if (xy == 'column') {
    if (val > 20) {$(input).val(20);val = 20;}
    if (val < 2) { $(input).val(2); val = 2; }
    var direction = 'width';
    column_number = val;
  } else if (xy == 'row') {
    var direction = 'height';
    row_number = val;
  }
  $('.point').remove();

  $('#board').attr(direction, (val *  60) + 4);
  $('.middle').css(direction, (val *  60) + 20 + 'px')
  create_points();
  clear_board();
}

function dark_mode(checkbox) {
  if (checkbox.checked == true) {
    darkmode = true;
    $('body').css('background', 'black');//darkgray
    $('.background_blend').addClass('background_blend_dark');
    $('#board').css('background','black');
    $('.point').css('background','white');
    // $('.middle').css('background', player);
  };
  if (checkbox.checked == false) {
    darkmode = false;
    $('body').css('background', '#EAEAEA');
    $('.background_blend').removeClass('background_blend_dark');
    $('#board').css('background','white');
    $('.point').css('background','');
    // $('.middle').css('background', '');
  }
  colour_points();
}

function point_clicked(object) {  //when cell on gameboard clicked
  x = $(object).attr('column');
  y = $(object).attr('row');
  x_old = current_column;
  y_old = current_row;
  if (check(x, y, x_old, y_old) == true) {//ckeck if line not already drawed
    board(x, y, x_old, y_old);
    //var to wait until done
    draw(x * 60 + 2, y * 60 + 2, x_old * 60 + 2, y_old * 60 + 2);//not 10px - 6px, because the canvas is smaller!


    var new_point_value = points[y][x];
    points[y_old][x_old] = 1;
    points[y][x] = 2;
    current_column = x;
    current_row = y;
    $('.point[row="'+y_old+'"][column="'+x_old+'"]').css({'box-shadow':'none','background':'darkgray'});
    $('.point[row="'+y+'"][column="'+x+'"]').css({'box-shadow':'0 0 10px #f57c00','background':'#f57c00'});
    //check victory
    if (x == column_number/2 && y == row_number) {won('green');
  } else if (x == column_number/2 && y == 0) {won('red');}
    //change player
    if (new_point_value == 0) {//only if new point
      if (player == 'red') {player = 'green';document.documentElement.style.setProperty = "--player: green";
        } else if (player == 'green') {player = 'red';document.documentElement.style.setProperty = "--player: red";}
      $('.background_blend').css('background',player);
    }
  }//end check
};

function draw(x, y, x_old, y_old) {
  var c = document.getElementById("board");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x_old, y_old);
  ctx.lineTo(x, y);
  ctx.lineWidth = 4;
  ctx.strokeStyle = player;
  ctx.stroke();
}

function board(x, y, x_old, y_old) {
  if  (x == +x_old+1  && y == y_old) {                                                                                              //right
    stage[y][x] = stage[y][x] + num['left'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['right'].toString();
  } else if (x == x_old-1  && y == y_old) {                                                                                         //left
    stage[y][x] = stage[y][x] + num['right'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['left'].toString();
  }else if (y == +y_old+1 && x == x_old) {                                                                                          //bottom
    stage[y][x] = stage[y][x] + num['top'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['bottom'].toString();
  } else if (y == y_old-1  && x == x_old) {                                                                                         //top
    stage[y][x] = stage[y][x] + num['bottom'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['top'].toString();

  } else if (x == +x_old+1 && y == +y_old+1) {
    stage[y][x] = stage[y][x] + num['bottom_right'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['top_left'].toString();  //bottom right
  } else if (x == x_old-1  && y == +y_old+1) {
    stage[y][x] = stage[y][x] + num['bottom_left'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['top_right'].toString();  //bottom left
  } else if (x == x_old-1  && y == y_old-1)  {
    stage[y][x] = stage[y][x] + num['top_left'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['bottom_right'].toString();  //top left
  } else if (x == +x_old+1 && y == y_old-1)  {
    stage[y][x] = stage[y][x] + num['top_right'].toString();stage[y_old][x_old] = stage[y_old][x_old] + num['bottom_left'].toString();} //top right
  }

function board_check(position){
  if (stage[y][x].toString().includes(num[position]) == true) {alert('Already full');return false;} else {return true}
}

function check(x, y, x_old, y_old) {
  if (x > +x_old+1 || x < x_old-1 || y > +y_old+1 || y < y_old-1) {return false;}//check distance between points

  if  (x == +x_old+1  && y == y_old) {return board_check('left')                //right
  } else if (x == x_old-1  && y == y_old) {return board_check('right')          //left
  } else if (y == +y_old+1 && x == x_old) {return board_check('top')            //bottom
  } else if (y == y_old-1  && x == x_old) {return board_check('bottom')         //top
  } else if (x == +x_old+1 && y == +y_old+1) {return board_check('bottom_right')//bottom right
  } else if (x == x_old-1  && y == +y_old+1) {return board_check('bottom_left') //bottom left
  } else if (x == x_old-1  && y == y_old-1) {return board_check('top_left')     //top left
  } else if (x == +x_old+1 && y == y_old-1) {return board_check('top_right')}   //top right
};

// https://stackoverflow.com/questions/34264446/how-to-make-1-1-2-instead-of-1-1-11

window.onload = function() {
    create_points();
    create_point_array();
    create_board();
}
