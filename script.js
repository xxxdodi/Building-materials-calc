const MATERIALS_CONFIG = {
    tile: {
        name: 'Керамическая плитка',
        icon: 'fa-th',
        fields: [
            { id: 'tileLength', label: 'Длина плитки (см)', type: 'number', value: 30, step: 1 },
            { id: 'tileWidth', label: 'Ширина плитки (см)', type: 'number', value: 30, step: 1 },
            { id: 'tileGap', label: 'Шов (мм)', type: 'number', value: 3, step: 0.5 },
            { id: 'reservePercent', label: 'Запас (%)', type: 'number', value: 10, step: 1, min: 0, max: 30 }
        ],
        calculate: (area, params) => {
            const tileL = params.tileLength / 100; // в метры
            const tileW = params.tileWidth / 100;
            const gap = params.tileGap / 1000; // в метры

            const tileArea = (tileL + gap) * (tileW + gap);
            const tilesNeeded = Math.ceil(area / tileArea);
            const withReserve = Math.ceil(tilesNeeded * (1 + params.reservePercent / 100));

            return {
                quantity: withReserve,
                unit: 'шт',
                details: [
                    `Площадь 1 плитки: ${(tileL * tileW).toFixed(4)} м²`,
                    `С учетом шва: ${tileArea.toFixed(4)} м²`,
                    `Чистое количество: ${tilesNeeded} шт`,
                    `С запасом ${params.reservePercent}%: ${withReserve} шт`
                ]
            };
        }
    },

    laminate: {
        name: 'Ламинат',
        icon: 'fa-layer-group',
        fields: [
            { id: 'packArea', label: 'Площадь в упаковке (м²)', type: 'number', value: 2.5, step: 0.1 },
            { id: 'reservePercent', label: 'Запас (%)', type: 'number', value: 7, step: 1, min: 0, max: 20 }
        ],
        calculate: (area, params) => {
            const packsNeeded = Math.ceil(area / params.packArea);
            const withReserve = Math.ceil(packsNeeded * (1 + params.reservePercent / 100));
            const totalArea = withReserve * params.packArea;

            return {
                quantity: withReserve,
                unit: 'упак',
                details: [
                    `Базовое количество упаковок: ${packsNeeded}`,
                    `С запасом ${params.reservePercent}%: ${withReserve} упак`,
                    `Общая площадь материала: ${totalArea.toFixed(2)} м²`,
                    `Излишки: ${(totalArea - area).toFixed(2)} м²`
                ]
            };
        }
    },

    wallpaper: {
        name: 'Обои',
        icon: 'fa-scroll',
        fields: [
            { id: 'rollLength', label: 'Длина рулона (м)', type: 'number', value: 10, step: 0.5 },
            { id: 'rollWidth', label: 'Ширина рулона (м)', type: 'number', value: 1.06, step: 0.01 },
            { id: 'patternRepeat', label: 'Раппорт (м)', type: 'number', value: 0, step: 0.01, hint: '0 если без рисунка' },
            { id: 'wallHeight', label: 'Высота стен (м)', type: 'number', value: 2.7, step: 0.01 }
        ],
        calculate: (area, params) => {
            const roomPerimeter = 2 * (parseFloat(document.getElementById('length').value) + parseFloat(document.getElementById('width').value));
            const stripsNeeded = Math.ceil(roomPerimeter / params.rollWidth);

            let effectiveStripLength = params.wallHeight;
            if (params.patternRepeat > 0) {
                effectiveStripLength = Math.ceil(params.wallHeight / params.patternRepeat) * params.patternRepeat;
            }

            const stripsPerRoll = Math.floor(params.rollLength / effectiveStripLength);
            const rollsNeeded = Math.ceil(stripsNeeded / stripsPerRoll);

            return {
                quantity: rollsNeeded,
                unit: 'рул',
                details: [
                    `Периметр комнаты: ${roomPerimeter.toFixed(2)} м`,
                    `Полос needed: ${stripsNeeded}`,
                    `Длина полосы с раппортом: ${effectiveStripLength.toFixed(2)} м`,
                    `Полос из 1 рулона: ${stripsPerRoll}`,
                    `Всего рулонов: ${rollsNeeded}`
                ]
            };
        }
    },

    paint: {
        name: 'Краска',
        icon: 'fa-fill-drip',
        fields: [
            { id: 'consumption', label: 'Расход (л/м²)', type: 'number', value: 0.15, step: 0.01, hint: 'на 1 слой' },
            { id: 'coats', label: 'Количество слоев', type: 'number', value: 2, step: 1, min: 1, max: 5 },
            { id: 'packageVolume', label: 'Объем банки (л)', type: 'number', value: 2.5, step: 0.1 }
        ],
        calculate: (area, params) => {
            const totalLiters = area * params.consumption * params.coats;
            const cansNeeded = Math.ceil(totalLiters / params.packageVolume);
            const actualLiters = cansNeeded * params.packageVolume;

            return {
                quantity: cansNeeded,
                unit: 'бан',
                details: [
                    `Расход на 1 слой: ${(area * params.consumption).toFixed(2)} л`,
                    `Всего слоев: ${params.coats}`,
                    `Общий объем: ${totalLiters.toFixed(2)} л`,
                    `Банок по ${params.packageVolume}л: ${cansNeeded}`,
                    `Излишки: ${(actualLiters - totalLiters).toFixed(2)} л`
                ]
            };
        }
    },

    plaster: {
        name: 'Штукатурка',
        icon: 'fa-trowel',
        fields: [
            { id: 'layerThickness', label: 'Толщина слоя (мм)', type: 'number', value: 10, step: 1, min: 5, max: 50 },
            { id: 'consumptionPer10mm', label: 'Расход на 10мм (кг/м²)', type: 'number', value: 8.5, step: 0.1 },
            { id: 'bagWeight', label: 'Вес мешка (кг)', type: 'number', value: 25, step: 5 }
        ],
        calculate: (area, params) => {
            const consumption = (params.consumptionPer10mm * params.layerThickness) / 10;
            const totalKg = area * consumption;
            const bagsNeeded = Math.ceil(totalKg / params.bagWeight);

            return {
                quantity: bagsNeeded,
                unit: 'меш',
                details: [
                    `Расход на ${params.layerThickness}мм: ${consumption.toFixed(2)} кг/м²`,
                    `Общая масса: ${totalKg.toFixed(2)} кг`,
                    `Мешков по ${params.bagWeight}кг: ${bagsNeeded}`,
                    `Излишки: ${(bagsNeeded * params.bagWeight - totalKg).toFixed(2)} кг`
                ]
            };
        }
    }
};

let currentMaterial = 'tile';
let calculationHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initMaterialSwitcher();
    initOpenings();
    renderHistory();
    updateDynamicFields();

    document.getElementById('calcBtn').addEventListener('click', calculate);

    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', validateInput);
    });
});

function initMaterialSwitcher() {
    document.querySelectorAll('.material').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.material').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentMaterial = card.dataset.type;

            const title = document.getElementById('calcTitle');
            title.style.opacity = '0';
            setTimeout(() => {
                title.textContent = `Расчет ${MATERIALS_CONFIG[currentMaterial].name.toLowerCase()}`;
                title.style.opacity = '1';
            }, 200);

            updateDynamicFields();
            hideResult();
        });
    });
}

function updateDynamicFields() {
    const container = document.getElementById('dynamicFields');
    const config = MATERIALS_CONFIG[currentMaterial];

    container.innerHTML = '';
    config.fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';
        group.innerHTML = `
            <label>${field.label} ${field.hint ? `<small>(${field.hint})</small>` : ''}</label>
            <input type="${field.type}" 
                   id="${field.id}" 
                   value="${field.value}" 
                   step="${field.step || 1}"
                   ${field.min ? `min="${field.min}"` : ''}
                   ${field.max ? `max="${field.max}"` : ''}>
        `;
        container.appendChild(group);
    });
}

function initOpenings() {
    document.getElementById('openingsList').addEventListener('change', (e) => {
        if (e.target.classList.contains('opening-type')) {
            const input = e.target.nextElementSibling;
            const areas = { door: 1.8, window: 1.8, custom: '' };
            input.value = areas[e.target.value];
            if (e.target.value === 'custom') {
                input.readOnly = false;
                input.focus();
            } else {
                input.readOnly = true;
            }
        }
    });
}

function addOpening() {
    const list = document.getElementById('openingsList');
    const id = Date.now();
    const item = document.createElement('div');
    item.className = 'opening-item';
    item.dataset.id = id;
    item.innerHTML = `
        <select class="opening-type">
            <option value="door">Дверь (2×0.9м)</option>
            <option value="window">Окно (1.5×1.2м)</option>
            <option value="custom">Произвольный</option>
        </select>
        <input type="number" class="opening-area" placeholder="м²" step="0.01" value="1.8" readonly>
        <button class="btn-remove" onclick="removeOpening(this)"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(item);
}

function removeOpening(btn) {
    const items = document.querySelectorAll('.opening-item');
    if (items.length > 1) {
        btn.closest('.opening-item').remove();
    } else {
        showNotification('Должен остаться хотя бы один проем', 'warning');
    }
}

function calculate() {
    try {
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        const price = parseFloat(document.getElementById('price').value);

        if (!length || !width || length <= 0 || width <= 0) {
            throw new Error('Введите корректные размеры помещения');
        }
        if (!price || price <= 0) {
            throw new Error('Введите цену материала');
        }

        const grossArea = length * width;

        let openingsArea = 0;
        document.querySelectorAll('.opening-item').forEach(item => {
            const area = parseFloat(item.querySelector('.opening-area').value) || 0;
            openingsArea += area;
        });

        const netArea = Math.max(0, grossArea - openingsArea);

        const params = {};
        MATERIALS_CONFIG[currentMaterial].fields.forEach(field => {
            const val = parseFloat(document.getElementById(field.id).value);
            if (isNaN(val) || val <= 0) {
                throw new Error(`Некорректное значение: ${field.label}`);
            }
            params[field.id] = val;
        });

        const result = MATERIALS_CONFIG[currentMaterial].calculate(netArea, params);
        const totalCost = result.quantity * price;

        displayResult({
            grossArea,
            netArea,
            openingsArea,
            quantity: result.quantity,
            unit: result.unit,
            totalCost,
            details: result.details,
            price,
            materialName: MATERIALS_CONFIG[currentMaterial].name
        });

    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function displayResult(data) {
    document.getElementById('totalCost').textContent = formatMoney(data.totalCost);
    document.getElementById('totalArea').textContent = `${data.netArea.toFixed(2)} м²`;
    document.getElementById('totalQty').textContent = `${data.quantity} ${data.unit}`;
    document.getElementById('timestamp').textContent = new Date().toLocaleString('ru-RU');

    const detailsHtml = `
        <strong>Исходные данные:</strong><br>
        Размеры помещения: ${document.getElementById('length').value} × ${document.getElementById('width').value} м<br>
        Общая площадь: ${data.grossArea.toFixed(2)} м²<br>
        Площадь проемов: ${data.openingsArea.toFixed(2)} м²<br>
        Чистая площадь: ${data.netArea.toFixed(2)} м²<br><br>
        <strong>Расчет материала (${data.materialName}):</strong><br>
        ${data.details.join('<br>')}<br><br>
        <strong>Финансовый расчет:</strong><br>
        ${data.quantity} ${data.unit} × ${formatMoney(data.price)} = ${formatMoney(data.totalCost)}
    `;
    document.getElementById('details').innerHTML = detailsHtml;

    const container = document.getElementById('resultContainer');
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
    document.getElementById('resultContainer').classList.add('hidden');
}

function saveCalculation() {
    const resultData = {
        id: Date.now(),
        material: currentMaterial,
        materialName: MATERIALS_CONFIG[currentMaterial].name,
        area: document.getElementById('totalArea').textContent,
        quantity: document.getElementById('totalQty').textContent,
        cost: document.getElementById('totalCost').textContent,
        date: new Date().toISOString()
    };

    calculationHistory.unshift(resultData);
    if (calculationHistory.length > 10) calculationHistory.pop();

    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
    renderHistory();
    showNotification('Расчет сохранен в историю', 'success');
}

function renderHistory() {
    const container = document.getElementById('historyList');
    const clearBtn = document.getElementById('clearHistoryBtn');

    if (calculationHistory.length === 0) {
        container.innerHTML = '<div class="empty-state">История пуста</div>';
        clearBtn.style.display = 'none';
        return;
    }

    clearBtn.style.display = 'block';
    container.innerHTML = calculationHistory.map(item => `
        <div class="history-item" onclick="restoreCalculation('${item.id}')">
            <div class="hist-type">${item.materialName}</div>
            <div class="hist-sum">${item.cost}</div>
            <div class="hist-date">${new Date(item.date).toLocaleString('ru-RU')}</div>
        </div>
    `).join('');
}

function restoreCalculation(id) {
    const item = calculationHistory.find(h => h.id == id);
    if (item) {
        showNotification(`Загружен расчет: ${item.materialName} на ${item.cost}`, 'info');
    }
}

function clearHistory() {
    if (confirm('Очистить всю историю расчетов?')) {
        calculationHistory = [];
        localStorage.removeItem('calcHistory');
        renderHistory();
        showNotification('История очищена', 'success');
    }
}

function resetForm() {
    document.getElementById('length').value = '';
    document.getElementById('width').value = '';
    document.getElementById('price').value = '';
    hideResult();
    document.getElementById('openingsList').innerHTML = `
        <div class="opening-item" data-id="1">
            <select class="opening-type">
                <option value="door">Дверь (2×0.9м)</option>
                <option value="window">Окно (1.5×1.2м)</option>
                <option value="custom">Произвольный</option>
            </select>
            <input type="number" class="opening-area" placeholder="м²" step="0.01" value="1.8" readonly>
            <button class="btn-remove" onclick="removeOpening(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    showNotification('Форма сброшена', 'info');
}

function validateInput(e) {
    const input = e.target;
    if (input.value < 0) input.value = 0;
}

function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(amount);
}

function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#4f7cff'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
