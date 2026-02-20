document.addEventListener('DOMContentLoaded', function() {
    var slogans = [
        "命に嫌われている",
        "生きることは、痛いことだ",
        "世界を壊している",
        "既然无法改变世界，那就随心所欲地活着吧",
        "あの夏が飽和する",
        "アスノヨゾラ哨戒班",
        "裏表ラバーズ",      
        "炉心融解",
        "污泥啊,血肉啊,石头和大地也是你啊,莫要哭,莫要怕,走过了东路就到家",
        "程艾影"
    ];

    // 1. 从浏览器的本地存储中获取剩余未显示的句子列表
    var remainingSlogans = JSON.parse(localStorage.getItem('fluid_slogans_remaining'));

    // 2. 如果列表不存在，或者已经空了（代表上一轮全展示完了），就重新初始化并洗牌
    if (!remainingSlogans || remainingSlogans.length === 0) {
        remainingSlogans = slogans.slice(); // 复制原数组
        
        // Fisher-Yates 洗牌算法：高效率地随机打乱数组顺序
        for (let i = remainingSlogans.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = remainingSlogans[i];
            remainingSlogans[i] = remainingSlogans[j];
            remainingSlogans[j] = temp;
        }
    }

    // 3. 取出最后一句作为本次要显示的句子，并将它从剩余列表中彻底移除
    var randomText = remainingSlogans.pop();

    // 4. 将剩下的列表存回本地存储，留给你的下一次刷新使用
    localStorage.setItem('fluid_slogans_remaining', JSON.stringify(remainingSlogans));

    // ---------------- 以下为保持不变的打字机替换逻辑 ----------------

    var checkTimer = setInterval(function() {
        var oldSubtitle = document.getElementById('subtitle');
        
        if (oldSubtitle && window.Typed) {
            clearInterval(checkTimer); 
            
            var parent = oldSubtitle.parentNode;
            
            if (window.typed) {
                window.typed.destroy();
            }
            
            parent.removeChild(oldSubtitle);
            var cursors = parent.querySelectorAll('.typed-cursor');
            cursors.forEach(function(cursor) {
                cursor.remove();
            });
            
            var newSubtitle = document.createElement('span');
            newSubtitle.id = 'subtitle';
            parent.appendChild(newSubtitle);
            
            window.typed = new window.Typed('#subtitle', {
                strings: [randomText],
                typeSpeed: 70, 
                cursorChar: "_",
                loop: false
            });
        }
    }, 50);

    setTimeout(function() {
        clearInterval(checkTimer);
    }, 5000);
});