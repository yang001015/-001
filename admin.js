const defaultWords = [
    {
        word: "Abundant",
        translation: "大量的",
        partOfSpeech: "adj.",
        example: "The garden has abundant flowers.",
        rootAnalysis: "\"Abund\" means plenty."
    },
    {
        word: "Benevolent",
        translation: "仁慈的",
        partOfSpeech: "adj.",
        example: "The benevolent king helped the poor.",
        rootAnalysis: "\"Bene\" means good, \"vol\" means will."
    },
    {
        word: "Courageous",
        translation: "勇敢的",
        partOfSpeech: "adj.",
        example: "The courageous firefighter saved the child.",
        rootAnalysis: "\"Cour\" means heart."
    },
    {
        word: "Diligent",
        translation: "勤奮的",
        partOfSpeech: "adj.",
        example: "She is diligent in her studies.",
        rootAnalysis: "\"Dilig\" means careful."
    },
    {
        word: "Eloquent",
        translation: "雄辯的",
        partOfSpeech: "adj.",
        example: "The eloquent speaker captivated the audience.",
        rootAnalysis: "\"Eloqu\" means speak."
    },
    {
        word: "Fortunate",
        translation: "幸運的",
        partOfSpeech: "adj.",
        example: "I am fortunate to have such friends.",
        rootAnalysis: "\"Fortun\" means luck."
    },
    {
        word: "Generous",
        translation: "慷慨的",
        partOfSpeech: "adj.",
        example: "He is generous with his time.",
        rootAnalysis: "\"Gener\" means kind."
    },
    {
        word: "Harmonious",
        translation: "和諧的",
        partOfSpeech: "adj.",
        example: "The harmonious music soothed everyone.",
        rootAnalysis: "\"Harm\" means join."
    },
    {
        word: "Industrious",
        translation: "勤勞的",
        partOfSpeech: "adj.",
        example: "The industrious bee collected nectar.",
        rootAnalysis: "\"Industr\" means skill."
    },
    {
        word: "Jubilant",
        translation: "歡樂的",
        partOfSpeech: "adj.",
        example: "The jubilant crowd cheered loudly.",
        rootAnalysis: "\"Jubil\" means shout."
    }
];

function getLocalWords() {
    try {
        const stored = localStorage.getItem('vocabularyWords');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        console.error('localStorage 讀取失敗', err);
    }
    return defaultWords;
}

function saveLocalWord(item) {
    const words = getLocalWords();
    words.push(item);
    localStorage.setItem('vocabularyWords', JSON.stringify(words));
}

function filterWords(words, query) {
    const lowerQuery = query.toLowerCase();
    return words.filter(item => {
        return [item.word, item.translation, item.partOfSpeech, item.example, item.rootAnalysis]
            .some(value => typeof value === 'string' && value.toLowerCase().includes(lowerQuery));
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('word');
    const form = document.getElementById('wordForm');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const searchStatus = document.getElementById('searchStatus');
    const apiOrigin = window.location.origin === 'null' ? 'http://localhost:3000' : window.location.origin;

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
            searchStatus.textContent = 'API 無法連線，請確認伺服器已啟動，並以 http://localhost:3000/admin.html 開啟本頁。';
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
            const res = await fetch(`${apiOrigin}/api/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWord)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'API 新增失敗');
            }

            saveLocalWord(newWord);
            form.reset();
            alert('單字已透過 API 新增！');
            window.location.href = 'index.html';
        } catch (err) {
            console.warn('API 新增失敗，改以本機儲存：', err);
            saveLocalWord(newWord);
            form.reset();
            alert('API 無法連線，單字已暫存於本機。');
            window.location.href = 'index.html';
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
