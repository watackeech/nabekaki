import consumer from "./consumer"

// $(document).on('turbolinks:load', function() {
  document.addEventListener("DOMContentLoaded", function(){

    const canvas = document.querySelector('#draw-area');
    const ctx = canvas.getContext('2d');
    const mouse = {x: null, y: null};
    let isDrag = false;
    let currentColor = 'black';
    let currentLineWidth = 5 ;
    let lastTime = Date.now();
    function draw(x, y, currentLineWidth, currentColor, isDrag) {
        if (!isDrag) {
            return;
        } else if (isDrag && Date.now() - lastTime > 20) {

            lastTime = Date.now();
            appRoom.reflect(currentColor, currentLineWidth, isDrag, x, y, mouse.x, mouse.y, lastTime);
            mouse.x = x;
            mouse.y = y;
        }
    };
    function dragStart(event) {
      appRoom.path(true, false)
      ctx.beginPath();
      isDrag = true;
      mouse.x = event.layerX;
      mouse.y = event.layerY;
    };
    function dragEnd(event) {
      appRoom.path(false, true);
      ctx.closePath();
      isDrag = false;
      mouse.x = null;
      mouse.y = null;
    };
    function dragEndLocal(event) {
      isDrag = false;
      mouse.x = null;
      mouse.y = null;
    };
    function eraser(){
      currentColor = "white"
    };
    function black(){
        currentColor = "black"
    };
    function yellow(){
        currentColor = "#f8df77"
    };
    function initEventHandler() {
      const eraserButton = document.querySelector('#eraser');
      const blackButton = document.querySelector('#black');
      const yellowButton = document.querySelector('#yellow');

      eraserButton.addEventListener('click', eraser);
      blackButton.addEventListener('click', black);
      yellowButton.addEventListener('click', yellow);
      canvas.addEventListener('mousedown', dragStart);
      canvas.addEventListener('mouseup', dragEnd);
      canvas.addEventListener('mouseout', dragEnd);
      canvas.addEventListener('mousemove', event => {
          draw(event.layerX, event.layerY, currentLineWidth, currentColor, isDrag);
      });
    };
    function initConfigOfLineWidth() {
      const widthNum = document.querySelector('#width-num');
      const lineWidth = document.querySelector('#line-width');
      currentLineWidth = lineWidth.value;
      lineWidth.addEventListener('input', event => {
          const width = event.target.value;
          currentLineWidth = width;
          widthNum.innerText = width;
      });
    };
    function exitEventHandler() {
      canvas.removeEventListener('mousedown', dragStart);
      canvas.removeEventListener('mouseup', dragEnd);
      canvas.removeEventListener('mouseout', dragEnd);
      canvas.removeEventListener('mousemove', event => {
          draw(event.layerX, event.layerY, currentLineWidth, currentColor, isDrag);
      });
    };
    function exitConfigOfLineWidth() {
      const widthNum = document.querySelector('#width-num');
      const lineWidth = document.querySelector('#line-width');
      currentLineWidth = lineWidth.value;
      lineWidth.removeEventListener('input', event => {
          const width = event.target.value;
          currentLineWidth = width;
          widthNum.innerText = width;
      });
    };

    function authorized(){
      // console.log('checking!');
      // console.log($("#current_drawer").attr("class"));
      // console.log($('#user_info').data('user_id'));
      // if(String($('#user_info').data('randorder')) === $("#current_draw_number").attr("class")){
      if($("#can_you_draw").attr("class") == "yes"){
        // console.log('god');
        initEventHandler();
        initConfigOfLineWidth();
      }else{

        exitEventHandler();
        exitConfigOfLineWidth();
        dragEndLocal();
      };
    }

    setInterval(authorized, 1000);


    const appRoom = consumer.subscriptions.create({channel: 'DrawChannel', room: $('#user_info').data('room_name') }, {
      connected() {
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        // console.log("received!");
        // if(data['flag'] === 0){
        //   $("#current_drawer").removeAttr("class");
        //   $("#current_drawer").attr({class : String(data['userid'])});
        // }else{
          if(data['begin']) {
            ctx.beginPath();
          } else if (data['close']){
            ctx.closePath();
          };
          function remoteDraw(x, y, currentLineWidth, currentColor, isDrag, lastTime, prex, prey) {
            if (!isDrag) {
                return;
            } else if (isDrag && Date.now() - lastTime > 20) {
                ctx.lineCap = 'round';
                ctx.lineJoin = ' round';
                ctx.lineWidth = currentLineWidth;
                ctx.strokeStyle = currentColor;
                ctx.moveTo(prex, prey);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
          };
          remoteDraw(
            data['currentX'],
            data['currentY'],
            data['width'],
            data['color'],
            data['isDrag'],
            data['lastTime'],
            data['prex'],
            data['prey']
          );
        // };
      },


      path: function(begin, close) {
        return this.perform('path',  {
          begin: begin,
          close: close
        });
      },

      reflect: function(color, width, isDrag, currentX, currentY, prex, prey, lastTime) {
        return this.perform('reflect',  {
          color: color,
          width: width,
          isDrag: isDrag,
          currentX: currentX,
          currentY: currentY,
          prex: prex,
          prey: prey,
          lastTime: lastTime
        });
      },

      path: function(begin, close) {
        return this.perform('path',  {
          begin: begin,
          close: close
        });
      },

      // turn: function(userid, flag) {
      //   return this.perform('turn',  {
      //     userid: userid,
      //     flag: flag
      //   });
      // },
    });
  });
// });