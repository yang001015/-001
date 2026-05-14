document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('wordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newWord = {
            word: document.getElementById('word').value,
            translation: document.getElementById('translation').value,
            partOfSpeech: document.getElementById('partOfSpeech').value,
            example: document.getElementById('example').value,
            rootAnalysis: document.getElementById('rootAnalysis').value
        };
        
        // 載入現有單字
        let words = JSON.parse(localStorage.getItem('vocabularyWords')) || [];
        
        // 新增新單字
        words.push(newWord);
        
        // 儲存回localStorage
        localStorage.setItem('vocabularyWords', JSON.stringify(words));
        
        // 清空表單
        document.getElementById('wordForm').reset();
        
        // 顯示成功訊息
        alert('單字已新增！');
        
        // 重定向回主頁面
        window.location.href = 'index.html';
    });
});