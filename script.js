// 預設單字資料
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

let words = [];
let currentIndex = 0;
let isFlipped = false;

document.addEventListener('DOMContentLoaded', function() {
    loadWords();
    displayWord();
    updateControls();

    document.getElementById('prevBtn').addEventListener('click', prevWord);
    document.getElementById('nextBtn').addEventListener('click', nextWord);
    document.getElementById('flipBtn').addEventListener('click', flipCard);
});

function loadWords() {
    const storedWords = localStorage.getItem('vocabularyWords');
    if (storedWords) {
        words = JSON.parse(storedWords);
    } else {
        words = defaultWords;
        saveWords();
    }
}

function saveWords() {
    localStorage.setItem('vocabularyWords', JSON.stringify(words));
}

function displayWord() {
    const word = words[currentIndex];
    document.getElementById('word').textContent = word.word;
    document.getElementById('translation').textContent = word.translation;
    document.getElementById('partOfSpeech').textContent = word.partOfSpeech;
    document.getElementById('example').textContent = word.example;
    document.getElementById('rootAnalysis').textContent = word.rootAnalysis;
    document.getElementById('currentIndex').textContent = currentIndex + 1;
    document.getElementById('totalWords').textContent = words.length;
}

function updateControls() {
    document.getElementById('prevBtn').disabled = currentIndex === 0;
    document.getElementById('nextBtn').disabled = currentIndex === words.length - 1;
}

function prevWord() {
    if (currentIndex > 0) {
        currentIndex--;
        isFlipped = false;
        document.getElementById('card').classList.remove('flipped');
        displayWord();
        updateControls();
    }
}

function nextWord() {
    if (currentIndex < words.length - 1) {
        currentIndex++;
        isFlipped = false;
        document.getElementById('card').classList.remove('flipped');
        displayWord();
        updateControls();
    }
}

function flipCard() {
    const card = document.getElementById('card');
    isFlipped = !isFlipped;
    if (isFlipped) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
    }
}