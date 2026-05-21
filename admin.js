document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('word');
    const form = document.getElementById('wordForm');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const searchStatus = document.getElementById('searchStatus');

    async function searchWord(query) {
        if (!query) {
            searchStatus.textContent = '請輸入單字後再按搜尋。';
            searchResults.innerHTML = '';
            return;
        }

        searchStatus.textContent = '搜尋中…';
        searchResults.innerHTML = '';

        try {
            const res = await fetch(`/api/items?q=${encodeURIComponent(query)}`);
            if (!res.ok) {
                throw new Error('搜尋失敗');
            }

            const items = await res.json();
            if (!items.length) {
                searchStatus.textContent = '找不到相關內容。';
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
        } catch (error) {
            console.error(error);
            searchStatus.textContent = '搜尋時發生錯誤，請稍後再試。';
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

        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWord)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || '新增失敗');
            }

            form.reset();
            alert('單字已透過 API 新增！');
            window.location.href = 'index.html';
        } catch (err) {
            console.error(err);
            alert('無法新增單字，請稍後再試。');
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
