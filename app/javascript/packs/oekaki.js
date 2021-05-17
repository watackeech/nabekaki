window.addEventListener('load', () => {
    const canvas = document.querySelector('#draw-area');
    const ctx = canvas.getContext('2d');
    const mouse = {x: null, y: null};
    let isDrag = false;
    let currentColor = 'black';
    let currentLineWidth = 1;
    let lastTime = Date.now();
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
    function initEventHandler() {
        canvas.addEventListener('mousedown', dragStart);
        canvas.addEventListener('mouseup', dragEnd);
        canvas.addEventListener('mouseout', dragEnd);
        canvas.addEventListener('mousemove', event => {
            draw(event.layerX, event.layerY, currentLineWidth, currentColor, isDrag);
        });
    }
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

    // function setBgColor(){
    //     // canvasの背景色を設定(指定がない場合にjpeg保存すると背景が黒になる)
    //     ctx.fillStyle = "#ffffff";
    //     ctx.fillRect(0,0,canvas.width, canvas.height);
    // }

    function authorized(){
        if(String($('#user_info').data('randorder')) === $("#current_draw_number").attr("class")){
            initEventHandler();
            initConfigOfLineWidth();
            // console.log("I can draw!");
        }else{
            exitEventHandler();
            exitConfigOfLineWidth();
        };
    };
    // ここがうまくいかないです
    setInterval(authorized, 1000);
});
