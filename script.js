

const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');

const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');

const wordSpacing = document.querySelector('#word-spacing');
const wordSpacingValue = document.querySelector('#word-spacing-value');
const textAlign = document.querySelector('#text-align');
const textAlignValue = document.querySelector('#text-align-value');

const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');

const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');

const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');

const scrollTopButton = document.querySelector('#scroll-top');
const eventLog = document.querySelector('#event-log');

const radiusInputs = [topLeft, topRight, bottomRight, bottomLeft];


function describe(value) {
    if (value instanceof Element) {
        const id = value.id ? `#${value.id}` : '';
        const cls = value.classList.length ? `.${[...value.classList].join('.')}` : '';
        return `<${value.tagName.toLowerCase()}${id}${cls}>`;
    }
    return String(value);
}

function log(...args) {
    console.log(...args);

    const line = args.map(describe).join(' ');
    const lines = (line + '\n' + eventLog.textContent).split('\n');
    eventLog.textContent = lines.slice(0, 60).join('\n');
}

function hideTabs() {
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });

    tabContents.forEach(function (content) {
        content.classList.remove('active');
    });
}

function showTab(tabName) {
    const tab = document.querySelector(`[data-tab="${tabName}"]`);
    const content = document.querySelector(`[data-content="${tabName}"]`);

    if (tab) {
        tab.classList.add('active');
    }

    if (content) {
        content.classList.add('active');
    }
}

tabsContainer.addEventListener('click', function (event) {
    log('type:', event.type);
    log('target:', event.target);
    log('currentTarget:', event.currentTarget);

    if (!event.target.classList.contains('tab')) {
        return;
    }

    const tabName = event.target.dataset.tab;

    hideTabs();
    showTab(tabName);
});

let currentRadius = '0px 0px 0px 0px';

function updateCssCode() {
    cssCode.value =
        `border-radius: ${currentRadius};\n` +
        `word-spacing: ${wordSpacing.value}px;\n` +
        `text-align: ${textAlign.value};`;
}

function generateBorderRadius() {
    const topLeftRadius = topLeft.value;
    const topRightRadius = topRight.value;
    const bottomRightRadius = bottomRight.value;
    const bottomLeftRadius = bottomLeft.value;

    const radius = `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;

    preview.style.borderRadius = radius;
    currentRadius = radius;

    topLeftValue.textContent = `${topLeft.value} px`;
    topRightValue.textContent = `${topRight.value} px`;
    bottomRightValue.textContent = `${bottomRight.value} px`;
    bottomLeftValue.textContent = `${bottomLeft.value} px`;

    updateCssCode();
}

topLeft.addEventListener('input', generateBorderRadius);
topRight.addEventListener('input', generateBorderRadius);
bottomRight.addEventListener('input', generateBorderRadius);
bottomLeft.addEventListener('input', generateBorderRadius);

wordSpacing.addEventListener('input', function () {
    preview.style.wordSpacing = `${wordSpacing.value}px`;
    wordSpacingValue.textContent = `${wordSpacing.value} px`;
    updateCssCode();
});

textAlign.addEventListener('change', function () {
    preview.style.textAlign = textAlign.value;
    textAlignValue.textContent = textAlign.value;
    updateCssCode();
});

function copyCSS() {
    function onSuccess() {
        copyMessage.textContent = 'CSS-код скопійовано';
    }

    function fallbackCopy() {
        cssCode.select();

        try {
            document.execCommand('copy');
            onSuccess();
        } catch (error) {
            copyMessage.textContent = 'Не вдалося скопіювати';
        }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cssCode.value)
            .then(onSuccess)
            .catch(fallbackCopy);
    } else {
        fallbackCopy();
    }
}

copyButton.addEventListener('click', copyCSS);

function validatePresetName() {
    if (presetName.value.trim() === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
        return false;
    }

    presetName.classList.remove('error');
    presetError.textContent = '';
    return true;
}

presetName.addEventListener('focus', function () {
    presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
    presetName.classList.remove('focused');
    validatePresetName();
});

function handlePresetSubmit(event) {
    event.preventDefault();

    if (!validatePresetName()) {
        return;
    }

    log(`Пресет: ${presetName.value.trim()}`);
    log(cssCode.value.replace(/\n/g, ' '));
}

presetForm.addEventListener('submit', handlePresetSubmit);

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        radiusInputs.forEach(function (input) {
            input.value = 0;
        });

        generateBorderRadius();
        log('Escape: border-radius скинуто');
    }
}

document.addEventListener('keydown', handleKeyDown);

preview.addEventListener('click', function () {
    log('Preview click');
});

previewButton.addEventListener('click', function (event) {
    event.stopPropagation();
    log('Button click');
});

preview.addEventListener('mouseover', function () {
    preview.classList.add('hovered');
});

preview.addEventListener('mouseout', function () {
    preview.classList.remove('hovered');
});

preview.addEventListener('mousemove', function (event) {
    coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
    console.log('pageX:', event.pageX, 'pageY:', event.pageY);
});

function handleScroll() {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

scrollTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.addEventListener('DOMContentLoaded', function () {
    log('DOM готовий');
});

window.addEventListener('load', function () {
    log('Сторінка завантажена');
});

preview.style.wordSpacing = `${wordSpacing.value}px`;
preview.style.textAlign = textAlign.value;
generateBorderRadius();
handleScroll();
