import * as Blockly from 'blockly';

export const CATEGORY_ICONS = {
    'DIGITAL': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" y1="9" x2="7" y2="9" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="19" x2="7" y2="19" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
        <path d="M 7 4 L 14 4 C 19.5 4 22 8.5 22 14 C 22 19.5 19.5 24 14 24 L 7 24 Z" fill="#E0F2FE" stroke="#0284C7" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="23" cy="14" r="1.8" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.8"/>
        <line x1="25" y1="14" x2="27" y2="14" stroke="#0284C7" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    'ANALOG': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="14" y1="3" x2="14" y2="25" stroke="#0D9488" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M 2 14 C 5 3, 9 3, 14 14 C 19 25, 23 25, 26 14" stroke="#06B6D4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    'I2C': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="9" y1="6" x2="9" y2="2" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="12.3" y1="6" x2="12.3" y2="2" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="15.7" y1="6" x2="15.7" y2="2" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="19" y1="6" x2="19" y2="2" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        
        <line x1="9" y1="22" x2="9" y2="26" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="12.3" y1="22" x2="12.3" y2="26" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="15.7" y1="22" x2="15.7" y2="26" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="19" y1="22" x2="19" y2="26" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>

        <line x1="6" y1="9" x2="2" y2="9" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="6" y1="12.3" x2="2" y2="12.3" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="6" y1="15.7" x2="2" y2="15.7" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="6" y1="19" x2="2" y2="19" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>

        <line x1="22" y1="9" x2="26" y2="9" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="22" y1="12.3" x2="26" y2="12.3" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="22" y1="15.7" x2="26" y2="15.7" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="22" y1="19" x2="26" y2="19" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>

        <rect x="6" y="6" width="16" height="16" rx="2.5" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
        <rect x="9.5" y="9.5" width="9" height="9" rx="1.5" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5"/>
    </svg>`,

    'SERIAL': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 4 7 L 24 7 C 25.5 7 26 8 25.5 10 L 23 18 C 22.5 19.5 21 20.5 19.5 20.5 L 8.5 20.5 C 7 20.5 5.5 19.5 5 18 L 2.5 10 C 2 8 2.5 7 4 7 Z" fill="#DDD6FE" stroke="#6D28D9" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="5" cy="13.5" r="1.3" fill="#6D28D9"/>
        <circle cx="23" cy="13.5" r="1.3" fill="#6D28D9"/>
        <circle cx="8.5" cy="11" r="0.9" fill="#6D28D9"/>
        <circle cx="11" cy="11" r="0.9" fill="#6D28D9"/>
        <circle cx="13.5" cy="11" r="0.9" fill="#6D28D9"/>
        <circle cx="16" cy="11" r="0.9" fill="#6D28D9"/>
        <circle cx="18.5" cy="11" r="0.9" fill="#6D28D9"/>
        <circle cx="9.5" cy="15.5" r="0.9" fill="#6D28D9"/>
        <circle cx="12" cy="15.5" r="0.9" fill="#6D28D9"/>
        <circle cx="14.5" cy="15.5" r="0.9" fill="#6D28D9"/>
        <circle cx="17" cy="15.5" r="0.9" fill="#6D28D9"/>
    </svg>`,

    'MOTION': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="14" y1="2" x2="14" y2="26" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse cx="14" cy="14" rx="12" ry="4.5" fill="#E0F2FE" fill-opacity="0.6" stroke="#38BDF8" stroke-width="2"/>
        <ellipse cx="14" cy="14" rx="4.5" ry="12" fill="none" stroke="#0284C7" stroke-width="1.8"/>
        <circle cx="14" cy="14" r="8" fill="none" stroke="#0369A1" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="2.2" fill="#0284C7"/>
    </svg>`,

    'SENSORS': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6.5" y="2.5" width="15" height="18.5" rx="2.5" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.8"/>
        <rect x="9.5" y="5.5" width="9" height="7" rx="1.5" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.2"/>
        <circle cx="12" cy="7.5" r="0.8" fill="#0284C7"/>
        <circle cx="16" cy="7.5" r="0.8" fill="#0284C7"/>
        <circle cx="12" cy="10.5" r="0.8" fill="#0284C7"/>
        <circle cx="16" cy="10.5" r="0.8" fill="#0284C7"/>
        <path d="M 14 14 v 3.5 M 12 17.5 h 4" stroke="#0284C7" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="9.5" y1="21" x2="9.5" y2="25.5" stroke="#0284C7" stroke-width="2" stroke-linecap="round"/>
        <line x1="14" y1="21" x2="14" y2="25.5" stroke="#0284C7" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.5" y1="21" x2="18.5" y2="25.5" stroke="#0284C7" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    'DISPLAY': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3.5" width="22" height="15" rx="2" fill="#1E293B" stroke="#0F172A" stroke-width="1.8"/>
        <rect x="5.5" y="5.5" width="17" height="11" rx="1" fill="#0F172A"/>
        <path d="M 6.5 6.5 L 12 6.5 L 7.5 13 L 6.5 13 Z" fill="rgba(255,255,255,0.18)"/>
        <rect x="12" y="18.5" width="4" height="4" fill="#334155"/>
        <rect x="8" y="22.5" width="12" height="2.5" rx="1.2" fill="#0F172A"/>
    </svg>`,

    'EYES & EMOJI': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="14" y1="5.5" x2="14" y2="2" stroke="#DB2777" stroke-width="2" stroke-linecap="round"/>
        <circle cx="14" cy="2" r="1.8" fill="#DB2777"/>
        <circle cx="3.5" cy="14.5" r="1.8" fill="#F472B6" stroke="#DB2777" stroke-width="1.5"/>
        <circle cx="24.5" cy="14.5" r="1.8" fill="#F472B6" stroke="#DB2777" stroke-width="1.5"/>
        <circle cx="14" cy="14.5" r="9.5" fill="#FBCFE8" stroke="#DB2777" stroke-width="2"/>
        <path d="M 8.5 14 Q 10.5 11.5, 12.5 14" fill="none" stroke="#9D174D" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="17.5" cy="13.5" r="2.8" fill="#FFFFFF" stroke="#9D174D" stroke-width="1.8"/>
        <circle cx="17.5" cy="13.5" r="1.1" fill="#9D174D"/>
        <path d="M 10 18.5 Q 14 21.5, 18 18.5" fill="none" stroke="#9D174D" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    'TIME': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="11" y="2.5" width="3" height="3" rx="0.5" fill="#F59E0B" stroke="#D97706" stroke-width="1.2"/>
        <path d="M 9.5 3.5 C 9.5 1.5, 15.5 1.5, 15.5 3.5" fill="none" stroke="#D97706" stroke-width="1.5"/>
        <circle cx="12.5" cy="14.5" r="9.5" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
        <line x1="12.5" y1="14.5" x2="12.5" y2="9" stroke="#92400E" stroke-width="2" stroke-linecap="round"/>
        <line x1="12.5" y1="14.5" x2="16.5" y2="12" stroke="#92400E" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="12.5" cy="14.5" r="1.5" fill="#92400E"/>
        <g transform="translate(19.5, 19.5)">
            <circle cx="0" cy="0" r="3.2" fill="#F59E0B" stroke="#B45309" stroke-width="1.4"/>
            <circle cx="0" cy="0" r="1.2" fill="#FEF3C7"/>
            <line x1="0" y1="-4.2" x2="0" y2="4.2" stroke="#B45309" stroke-width="1.4"/>
            <line x1="-4.2" y1="0" x2="4.2" y2="0" stroke="#B45309" stroke-width="1.4"/>
            <line x1="-3" y1="-3" x2="3" y2="3" stroke="#B45309" stroke-width="1.4"/>
            <line x1="-3" y1="3" x2="3" y2="-3" stroke="#B45309" stroke-width="1.4"/>
        </g>
    </svg>`,

    'LOOPS': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 7 13.5 A 7.5 7.5 0 1 1 16 21" fill="none" stroke="#22C55E" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M 3.5 10 L 7.5 14 L 11.5 10" fill="none" stroke="#22C55E" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    'CONTROL': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 4 8 C 7 7, 21 7, 24 8 C 26.5 9, 27 14, 25 18 C 23.5 21.5, 19 18.5, 16.5 16 C 15 15, 13 15, 11.5 16 C 9 18.5, 4.5 21.5, 3 18 C 1 14, 1.5 9, 4 8 Z" fill="#BAE6FD" stroke="#0284C7" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 7 12.5 h 3.5 M 8.75 10.75 v 3.5" stroke="#0284C7" stroke-width="2" stroke-linecap="round"/>
        <circle cx="19" cy="11.5" r="1.1" fill="#0284C7"/>
        <circle cx="21" cy="13.5" r="1.1" fill="#0284C7"/>
        <circle cx="19" cy="15.5" r="1.1" fill="#0284C7"/>
        <circle cx="17" cy="13.5" r="1.1" fill="#0284C7"/>
    </svg>`,

    'MATH': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 21 6 L 8 6 L 15 14 L 8 22 L 21 22" fill="#DCFCE7" stroke="#16A34A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    'TEXT': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 4 22 L 11 4 L 18 22 M 7 16 L 15 16" fill="#DDD6FE" stroke="#7C3AED" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="22" y1="9" x2="22" y2="17" stroke="#7C3AED" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="22" cy="21.5" r="1.3" fill="#7C3AED"/>
    </svg>`,

    'VARIABLES': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 6 4 L 2 4 L 2 24 L 6 24" fill="none" stroke="#EF4444" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 22 4 L 26 4 L 26 24 L 22 24" fill="none" stroke="#EF4444" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 7 9 L 12 15 M 12 9 L 7 15" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
        <path d="M 15 13 L 17.5 17 L 20 13 M 17.5 17 L 16 21" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    'LISTS': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="4" width="21" height="5.5" rx="2" fill="#FFEDD5" stroke="#EA580C" stroke-width="1.8"/>
        <rect x="3.5" y="11.25" width="21" height="5.5" rx="2" fill="#FFEDD5" stroke="#EA580C" stroke-width="1.8"/>
        <rect x="3.5" y="18.5" width="21" height="5.5" rx="2" fill="#FFEDD5" stroke="#EA580C" stroke-width="1.8"/>
        <circle cx="7" cy="6.75" r="1.3" fill="#EA580C"/>
        <circle cx="7" cy="14" r="1.3" fill="#EA580C"/>
        <circle cx="7" cy="21.25" r="1.3" fill="#EA580C"/>
        <line x1="11.5" y1="6.75" x2="20.5" y2="6.75" stroke="#EA580C" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="11.5" y1="14" x2="18.5" y2="14" stroke="#EA580C" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="11.5" y1="21.25" x2="16.5" y2="21.25" stroke="#EA580C" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`,

    'FUNCTIONS': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="10" fill="#F3E8FF" stroke="#9333EA" stroke-width="2"/>
        <path d="M 11.5 8 C 10 8, 9 9, 9 11 L 9 13 C 9 13.8, 8 14.5, 7 14.5 C 8 14.5, 9 15.2, 9 16 L 9 18 C 9 20, 10 21, 11.5 21" stroke="#7E22CE" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M 16.5 8 C 18 8, 19 9, 19 11 L 19 13 C 19 13.8, 20 14.5, 21 14.5 C 20 14.5, 19 15.2, 19 16 L 19 18 C 19 20, 18 21, 16.5 21" stroke="#7E22CE" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M 12 11.5 L 16 16.5 M 16 11.5 L 12 16.5" stroke="#9333EA" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`
};

export const CALCULATOR_ICON_SVG = `<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1" width="17" height="22" rx="2.5" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.8"/>
    <rect x="4" y="3.5" width="12" height="4.5" rx="1" fill="#BBF7D0" stroke="#16A34A" stroke-width="1.2"/>
    <circle cx="5.5" cy="11" r="0.9" fill="#16A34A"/>
    <circle cx="10" cy="11" r="0.9" fill="#16A34A"/>
    <circle cx="14.5" cy="11" r="0.9" fill="#16A34A"/>
    <circle cx="5.5" cy="15" r="0.9" fill="#16A34A"/>
    <circle cx="10" cy="15" r="0.9" fill="#16A34A"/>
    <circle cx="14.5" cy="15" r="0.9" fill="#16A34A"/>
    <circle cx="5.5" cy="19" r="0.9" fill="#16A34A"/>
    <circle cx="10" cy="19" r="0.9" fill="#16A34A"/>
    <circle cx="14.5" cy="19" r="0.9" fill="#16A34A"/>
</svg>`;

class CustomCategory extends Blockly.ToolboxCategory {
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent);
    }

    createRowContainer_() {
        const row = super.createRowContainer_();
        row.classList.add('custom-category-row', 'blocklyTreeRow');
        
        row.style.setProperty('display', 'flex', 'important');
        row.style.setProperty('flex-direction', 'row', 'important');
        row.style.setProperty('align-items', 'center', 'important');
        row.style.setProperty('justify-content', 'flex-start', 'important');
        row.style.setProperty('height', '36px', 'important');
        row.style.setProperty('min-height', '36px', 'important');
        row.style.setProperty('max-height', '36px', 'important');
        row.style.setProperty('padding', '0 10px', 'important');
        row.style.setProperty('margin', '2px 6px', 'important');
        row.style.setProperty('border-radius', '8px', 'important');
        row.style.setProperty('cursor', 'pointer', 'important');
        row.style.setProperty('box-sizing', 'border-box', 'important');
        row.style.setProperty('transition', 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)', 'important');

        row.addEventListener('mouseenter', () => {
            row.classList.add('category-hover');
        });
        row.addEventListener('mouseleave', () => {
            row.classList.remove('category-hover');
        });

        return row;
    }

    createRowContentsContainer_() {
        const rowContents = super.createRowContentsContainer_();
        rowContents.classList.add('custom-category-row-contents');
        return rowContents;
    }

    createIconDom_() {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'custom-category-icon';
        
        const svg = CATEGORY_ICONS[this.name_];
        if (svg) {
            iconSpan.innerHTML = svg;
        }
        return iconSpan;
    }

    createLabelDom_(initialLabel) {
        const labelSpan = super.createLabelDom_(initialLabel);
        labelSpan.classList.add('custom-category-label');

        if (this.name_ === 'MATH') {
            const mathWrapper = document.createElement('span');
            mathWrapper.className = 'custom-category-math-container';
            mathWrapper.style.setProperty('display', 'inline-flex', 'important');
            mathWrapper.style.setProperty('align-items', 'center', 'important');
            mathWrapper.style.setProperty('gap', '8px', 'important');
            mathWrapper.style.setProperty('white-space', 'nowrap', 'important');
            mathWrapper.appendChild(labelSpan);

            const calcSpan = document.createElement('span');
            calcSpan.className = 'custom-category-calc-icon';
            calcSpan.style.setProperty('display', 'inline-flex', 'important');
            calcSpan.style.setProperty('align-items', 'center', 'important');
            calcSpan.style.setProperty('justify-content', 'center', 'important');
            calcSpan.innerHTML = CALCULATOR_ICON_SVG;
            mathWrapper.appendChild(calcSpan);
            return mathWrapper;
        }

        return labelSpan;
    }

    setSelected(isSelected) {
        if (this.rowDiv_) {
            if (isSelected) {
                this.rowDiv_.classList.add('blocklyTreeSelected', 'category-selected', 'blocklyToolboxSelected');
            } else {
                this.rowDiv_.classList.remove('blocklyTreeSelected', 'category-selected', 'blocklyToolboxSelected');
            }
            if (this.htmlDiv_) {
                Blockly.utils.aria.setState(
                    this.htmlDiv_,
                    Blockly.utils.aria.State.SELECTED,
                    isSelected
                );
            }
        }
    }

    addColourBorder_() {
        // Allow CSS hover and selected border-left to control the styling
    }
}

export const registerCustomCategory = () => {
    try {
        Blockly.Toolbox.prototype.getWidth = function() {
            return (this.HtmlDiv && this.HtmlDiv.offsetWidth) ? this.HtmlDiv.offsetWidth : (this.width_ || 215);
        };

        Blockly.registry.register(
            Blockly.registry.Type.TOOLBOX_ITEM,
            Blockly.ToolboxCategory.registrationName,
            CustomCategory,
            true
        );
    } catch (e) {
        console.warn('Blockly CustomCategory registration note:', e);
    }
};
