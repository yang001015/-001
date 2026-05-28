document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('word');
    const form = document.getElementById('wordForm');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const searchStatus = document.getElementById('searchStatus');

    const rootMap = {
        abundant: 'abund = plenty (大量)',
        benevolent: 'bene = good, vol = will (仁慈)',
        courageous: 'cour = heart (勇敢)',
        diligent: 'dili / dilig = careful (勤奮)',
        eloquent: 'eloqu = speak (雄辯)',
        fortunate: 'fortun = luck (幸運)',
        generous: 'gener = kind (慷慨)',
        harmonious: 'harm = join (和諧)',
        industrious: 'industr = work/skill (勤勞)',
        jubilant: 'jubil = shout (歡樂)'
    };

    function renderResult(result) {
        if (!result || !result.word) {
            searchStatus.textContent = '查無相關結果，請確認單字拼字是否正確。';
            searchResults.innerHTML = '';
            return;
        }

        searchStatus.textContent = '已取得外部字典結果。';
        searchResults.innerHTML = `
            <div class="word-card">
                <strong>${result.word}</strong> (${result.partOfSpeech || '未填'})<br>
                翻譯：${result.translation || '無'}<br>
                例句：${result.example || '無'}<br>
                字根分析：${result.rootAnalysis || '無'}
            </div>
        `;

        document.getElementById('translation').value = result.translation || '';
        document.getElementById('partOfSpeech').value = result.partOfSpeech || '';
        document.getElementById('example').value = result.example || '';
        document.getElementById('rootAnalysis').value = result.rootAnalysis || '';
    }

    async function fetchTranslation(word) {
        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-TW`);
            if (!res.ok) return '';
            const data = await res.json();
            return data.responseData?.translatedText || '';
        } catch (err) {
            console.warn('翻譯 API 失敗：', err);
            return '';
        }
    }

    async function fetchDictionary(word) {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!res.ok) {
            throw new Error('外部字典查詢失敗');
        }
        const data = await res.json();
        const entry = Array.isArray(data) ? data[0] : null;
        const meaning = entry?.meanings?.find(m => m.definitions?.length);
        const definition = meaning?.definitions?.find(d => d.example) || meaning?.definitions?.[0] || {};
        return {
            word: entry?.word || word,
            partOfSpeech: meaning?.partOfSpeech || '',
            example: definition.example || definition.definition || '',
            rootAnalysis: rootMap[word.toLowerCase()] || '此單字目前無字根分析。'
        };
    }

    async function searchWord(query) {
        if (!query) {
            searchStatus.textContent = '請輸入單字後再按搜尋。';
            searchResults.innerHTML = '';
            return;
        }

        searchStatus.textContent = '正在連線到外部字典 API…';
        searchResults.innerHTML = '';

        try {
            const dictResult = await fetchDictionary(query);
            const translation = await fetchTranslation(query);
            renderResult({ ...dictResult, translation });
        } catch (error) {
            console.error('外部字典查詢失敗：', error);
            searchStatus.textContent = '外部字典查詢失敗，請確認網路是否連線或單字拼寫是否正確。';
            searchResults.innerHTML = '';
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        searchWord(wordInput.value.trim());
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
