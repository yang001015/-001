document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('word');
    const form = document.getElementById('wordForm');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const searchStatus = document.getElementById('searchStatus');
    const apiOrigin = window.location.protocol === 'file:' ? 'http://localhost:3000' : window.location.origin;

    function renderResults(items, query) {
        if (!items.length) {
            searchStatus.textContent = '找不到相關內容。';
            searchResults.innerHTML = '';
            return;
        }

        searchStatus.textContent = `找到 ${items.length} 筆相關內容。`;
        searchResults.innerHTML = items.map(item => {
            return `
                <div class="word-card">
                    <strong>${item.word}</strong> (${item.partOfSpeech || '未填'})<br>
                    翻譯：${item.translation || '無'}<br>
                    例句：${item.example || '無'}<br>
                    字根分析：${item.rootAnalysis || '無'}
                </div>
            `;
        }).join('');

        const exactMatch = items.find(item => item.word.toLowerCase() === query.toLowerCase());
        if (exactMatch) {
            document.getElementById('translation').value = exactMatch.translation || '';
            document.getElementById('partOfSpeech').value = exactMatch.partOfSpeech || '';
            document.getElementById('example').value = exactMatch.example || '';
            document.getElementById('rootAnalysis').value = exactMatch.rootAnalysis || '';
        }
    }

    async function searchWord(query) {
        if (!query) {
            searchStatus.textContent = '請輸入單字後再按搜尋。';
            searchResults.innerHTML = '';
            return;
        }

        searchStatus.textContent = 'API 連線中…';
        searchResults.innerHTML = '';

        try {
            const res = await fetch(`${apiOrigin}/api/items?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`API 回傳失敗：${res.status}`);
            }

            const items = await res.json();
            renderResults(items, query);
        } catch (error) {
            console.error('API 查詢失敗：', error);
            searchStatus.textContent = 'API 無法連線，請確認伺服器已啟動，並於同一頁直接查詢。';
            searchResults.innerHTML = '';
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const newWord = {
            word: wordInput.value.trim(),
            translation: document.getElementById('translation').value.trim(),
            partOfSpeech: document.getElementById('partOfSpeech').value.trim(),
            example: document.getElementById('example').value.trim(),
            rootAnalysis: document.getElementById('rootAnalysis').value.trim()
        };

        if (!newWord.word) {
            alert('請輸入單字。');
            return;
        }

        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWord)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'API 新增失敗');
            }

            form.reset();
            alert('單字已透過 API 新增！');
            window.location.href = 'index.html';
        } catch (err) {
            console.error('API 新增失敗：', err);
            alert('API 無法連線，請先啟動伺服器再重新送出。');
        }
    });

    searchButton.addEventListener('click', function() {
        searchWord(wordInput.value.trim());
    });

    wordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchWord(wordInput.value.trim());
        }
    });
});
