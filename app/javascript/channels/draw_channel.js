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
    function draw(x, y, isDrag) {
        if (!isDrag) {
            return;
        } else if (isDrag && Date.now() - lastTime > 20) {

            lastTime = Date.now();
            appRoom.reflect(isDrag, x, y, mouse.x, mouse.y, lastTime);
            mouse.x = x;
            mouse.y = y;
        }
    };
    function dragStart(event) {
      appRoom.path(1)
      ctx.beginPath();
      isDrag = true;
      mouse.x = event.layerX;
      mouse.y = event.layerY;
      // console.log("begin");
    };
    function dragEnd(event) {
      appRoom.path(0);
      ctx.closePath();
      isDrag = false;
      mouse.x = null;
      mouse.y = null;
      // console.log("close");
    };
    // function dragEndLocal(event) {
    //   isDrag = false;
    //   mouse.x = null;
    //   mouse.y = null;
    // };
    // function widthA(){
    //   currentLineWidth = 5;
    // }
    // function widthB(){
    //   currentLineWidth = 30;
    // }
    // function widthC(){
    //   currentLineWidth = 80;
    // }
    // function eraser(){
    //     currentColor = "white"
    // }
    function clear(){
      // ctx.fillStyle = "#ffffff"; //#############################################################################
      ctx.clearRect(0,0,canvas.width, canvas.height);
      appRoom.path(2);
    }
    // function black(){
    //     currentColor = "black"
    // }
    // function yellow(){
    //     currentColor = "yellow"
    // }
    // function blue(){
    //     currentColor = "blue"
    // }
    // function red(){
    //     currentColor = "red"
    // }
    // function green(){
    //     currentColor = "green"
    // }
    function initEventHandler() {
      // const widthAButton = document.querySelector('#widthA');
      // const widthBButton = document.querySelector('#widthB');
      // const widthCButton = document.querySelector('#widthC');
      // const eraserButton = document.querySelector('#eraser');
      const clearButton = document.querySelector('#clear-btn');
      // const blackButton = document.querySelector('#black');
      // const yellowButton = document.querySelector('#yellow');
      // const blueButton = document.querySelector('#blue');
      // const greenButton = document.querySelector('#green');
      // const redButton = document.querySelector('#red');

      // widthAButton.addEventListener('click', widthA);
      // widthBButton.addEventListener('click', widthB);
      // widthCButton.addEventListener('click', widthC);
      // eraserButton.addEventListener('click', eraser);
      clearButton.addEventListener('click', clear);
      // blackButton.addEventListener('click', black);
      // yellowButton.addEventListener('click', yellow);
      // blueButton.addEventListener('click', blue);
      // greenButton.addEventListener('click', green);
      // redButton.addEventListener('click', red);
      canvas.addEventListener('mousedown', dragStart);
      canvas.addEventListener('mouseup', dragEnd);
      canvas.addEventListener('mouseout', dragEnd);
      canvas.addEventListener('mousemove', event => {
          draw(event.layerX, event.layerY, isDrag);
      });
    };
    // function initConfigOfLineWidth() {
    //   const widthNum = document.querySelector('#width-num');
    //   const lineWidth = document.querySelector('#line-width');
    //   currentLineWidth = lineWidth.value;
    //   lineWidth.addEventListener('input', event => {
    //       const width = event.target.value;
    //       currentLineWidth = width;
    //       widthNum.innerText = width;
    //   });
    // };
    function exitEventHandler() {
      // const eraserButton = document.querySelector('#eraser');
      // const blackButton = document.querySelector('#black');
      // const yellowButton = document.querySelector('#yellow');
      // const blueButton = document.querySelector('#blue');
      // const greenButton = document.querySelector('#green');
      // const redButton = document.querySelector('#red');
      // const widthAButton = document.querySelector('#widthA');
      // const widthBButton = document.querySelector('#widthB');
      // const widthCButton = document.querySelector('#widthC');
      const clearButton = document.querySelector('#clear-btn');

      clearButton.addEventListener('click', clear);
      // widthAButton.addEventListener('click', widthA);
      // widthBButton.addEventListener('click', widthB);
      // widthCButton.addEventListener('click', widthC);
      // eraserButton.addEventListener('click', eraser);
      // blackButton.addEventListener('click', black);
      // yellowButton.addEventListener('click', yellow);
      // blueButton.addEventListener('click', blue);
      // greenButton.addEventListener('click', green);
      // redButton.addEventListener('click', red);

      canvas.removeEventListener('mousedown', dragStart);
      canvas.removeEventListener('mouseup', dragEnd);
      canvas.removeEventListener('mouseout', dragEnd);
      canvas.removeEventListener('mousemove', event => {
          draw(event.layerX, event.layerY, currentLineWidth, currentColor, isDrag);
      });
    };
    // function exitConfigOfLineWidth() {
    //   const widthNum = document.querySelector('#width-num');
    //   const lineWidth = document.querySelector('#line-width');
    //   currentLineWidth = lineWidth.value;
    //   lineWidth.removeEventListener('input', event => {
    //       const width = event.target.value;
    //       currentLineWidth = width;
    //       widthNum.innerText = width;
    //   });
    // };

    function authorized(){
      if($("#can_you_draw").attr("class") == "yes"){
        initEventHandler();
      }else{
        exitEventHandler();
        dragEnd();
      };
    }
    const elem = document.getElementById('btn-reload');
    const config = {
        attributes: true,
        childList: true,
        characterData: true
    };
    var observer = new MutationObserver(function(){
      setTimeout(authorized, 200);
      // function startCountDown(){
      let count = 60
      let countDown = setInterval(function(){
        count -= 1
        if(count <= 0) {
          exitEventHandler();
          dragEnd();
          // $("#can_you_draw").removeAttr("class");
          // $("#can_you_draw").attr({class : "no"})
          clearInterval(countDown);
        }
        // else if(count <= 10){
          // $('#count-down').css('color','red');
        // }
      },1000);
      // }
      // function stopCountDown(){
      // }
      // stopCountDown();
      // startCountDown();
    });
    observer.observe(elem, config);

    // setInterval(authorized, 1000);


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
        const canvas = document.querySelector('#draw-area');
        const ctx = canvas.getContext('2d');
        if($("#can_you_draw").attr("class") == "yes"){
        }else{
          if(data['path'] == 1) {
            ctx.beginPath();
          } else if (data['path'] == 0){
            ctx.closePath();
          }else if(data['path'] == 2){
            // ctx.fillStyle = "#ffffff"; //#############################################################################
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.closePath();
          }
          function remoteDraw(x, y, isDrag, lastTime, prex, prey) {
            if (!isDrag) {
                return;
            } else if (isDrag && Date.now() - lastTime > 20) {
                ctx.lineCap = 'round';
                ctx.lineJoin = ' round';
                ctx.lineWidth = 5;
                ctx.strokeStyle = "black";
                ctx.moveTo(prex, prey);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
          };
          remoteDraw(
            data['currentX'],
            data['currentY'],
            data['isDrag'],
            data['lastTime'],
            data['prex'],
            data['prey']
          );
        }
        // };
      },

      reflect: function(isDrag, currentX, currentY, prex, prey, lastTime) {
        return this.perform('reflect',  {
          // color: color,
          // width: width,
          isDrag: isDrag,
          currentX: currentX,
          currentY: currentY,
          prex: prex,
          prey: prey,
          lastTime: lastTime
        });
      },

      path: function(path) {
        return this.perform('path',  {
          path: path
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