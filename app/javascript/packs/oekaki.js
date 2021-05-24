window.addEventListener('load', () => {
    const canvas = document.querySelector('#draw-area');
    const ctx = canvas.getContext('2d');
    const mouse = {x: null, y: null};
    let isDrag = false;
    let currentColor = 'black';
    let currentLineWidth = 5;
    let lastTime = Date.now();
    const elem = document.getElementById('btn-reload');
    const config = {
        attributes: true,
        childList: true,
        characterData: true
    };

        function draw(x, y, currentLineWidth, currentColor, isDrag) {
            if (!isDrag) {
                return;
            } else if (isDrag && Date.now() - lastTime > 20) {
                ctx.lineCap = 'round';
                ctx.lineJoin = ' round';
                ctx.lineWidth = currentLineWidth;
                ctx.strokeStyle = currentColor;
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(x, y);

                ctx.stroke();
                lastTime = Date.now();
                mouse.x = x;
                mouse.y = y;
            }
        };
        function dragStart(event) {
            isDrag = true;
            ctx.arc(event.layerX, event.layerY, currentLineWidth / 2, 0, Math.PI * 2);
            ctx.fillStyle = currentColor;
            ctx.fill();
            ctx.beginPath()
            ctx.moveTo(event.layerX, event.layerY);
            mouse.x = event.layerX;
            mouse.y = event.layerY;
        };
        function dragEnd(event) {
            ctx.closePath();
            isDrag = false;
            mouse.x = null;
            mouse.y = null;
        }

        function clear(){
            ctx.clearRect(0,0,canvas.width, canvas.height);
        }
        function initEventHandler() {
            // const eraserButton = document.querySelector('#eraser');
            const clearButton = document.querySelector('#clear-btn');

            clearButton.addEventListener('click', clear);
            // eraserButton.addEventListener('click', eraser);
            canvas.addEventListener('mousedown', dragStart);
            canvas.addEventListener('mouseup', dragEnd);
            canvas.addEventListener('mouseout', dragEnd);
            canvas.addEventListener('mousemove', event => {
                draw(event.layerX, event.layerY, currentLineWidth, currentColor, isDrag);
            });
        }
        function exitEventHandler() {
            // const eraserButton = document.querySelector('#eraser');
            const clearButton = document.querySelector('#clear-btn');

            clearButton.addEventListener('click', clear);
            // eraserButton.addEventListener('click', eraser);

            canvas.removeEventListener('mousedown', dragStart);
            canvas.removeEventListener('mouseup', dragEnd);
            canvas.removeEventListener('mouseout', dragEnd);
            canvas.removeEventListener('mousemove', event => {
                draw(event.layerX, event.layerY, currentLineWidth, currentColor, isDrag);
            });
        };
    var observer = new MutationObserver(function(){
        function authorized(){
        //     // if(String($('#user_info').data('randorder')) === $("#current_draw_number").attr("class")){
            if($("#can_you_draw").attr("class") == "yes"){
                initEventHandler();
            }else{
                exitEventHandler(); //#############################################################3
                dragEnd();
            };
        };
        setTimeout(authorized, 100);
        let count = 60
        let countDown = setInterval(function(){
            count -= 1
            if(count <= 0) {
            // console.log("描き終わり！！");
            exitEventHandler(); //#####################################################################
            dragEnd();
            // console.log("強制終了");
            $("#can_you_draw").removeAttr("class");
            $("#can_you_draw").attr({class : "no"})
            clearInterval(countDown);
            }
        },1000);
    });
    observer.observe(elem, config);
});
