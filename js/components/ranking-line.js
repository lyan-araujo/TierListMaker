export class RankingLine extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this._id    = this.createID();
        this.inicializado   = false;
    }

    createID() {
        return `line_${Math.floor(Math.random() * Date.now()).toString(36)}`;
    }

    connectedCallback() {
        if(this.inicializado === false) {
            this.inicializado   = true;
            this.buildElement();
        }
    }

    buildElement() {
        this.id = this._id;
        const styles    = this.getStyle();
        const template  = this.getTemplate();

        this.shadowRoot.append(styles, template);
        this.createEvents();
    }

    getTemplate() {
        const container_line    = document.createElement('div');
        container_line.classList.add('container-line');

        container_line.insertAdjacentHTML('beforeend',`
            <div class='box-title' style='background-color: ${this.dataset.color ?? 'transparent'}' lang='pt-br'>
                <i class='icon-dots'>&hellip;</i>
                <p class='p-text'>${this.dataset.title ?? '[title]'}</p>
            </div>
            <div class='box-items'>
                <slot></slot>
            </div>
            <div class='hold'></div>
        `);

        return container_line;
    }

    getStyle() {
        const style = document.createElement('style');
        style.textContent   = `
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .container-line {
            display: grid;
            grid-template-columns: auto 1fr auto;
        }

        .box-title {
            display: grid;
            grid-template-rows: auto 1fr;
            width: 5rem;
            min-height: calc(var(--item-size) + .4rem);
            border: .1rem solid var(--cor-1);
            font-size: large;
            text-shadow: 0 0 .2rem black;
            cursor: pointer;
        }
        
        .box-title > .icon-dots {
            display: flex;
            justify-content: flex-start;
            align-items: flex-end;
            height: .6em;
            overflow: hidden;
        }

        .box-title > .p-text {
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: break-spaces;
            word-wrap: break-word;
            overflow-x: hidden;
            hyphens: auto;
            text-align: center;
            text-overflow: ellipsis;
        }

        .box-items {
            display: grid;
            padding: .1rem;
            justify-content: space-around;
            align-items: center;
            grid-template-columns: repeat(auto-fill, var(--item-size));
            border: .1rem solid var(--cor-1);
            gap: .1rem;
        }

        .hold {
            width: 2rem;
            border: .1rem solid var(--cor-1);
            cursor: grab;
        }
        
        `;

        return style;
    }
    
    createEvents() {
        const box_title = this.shadowRoot.querySelector('.box-title');
        const box_hold  = this.shadowRoot.querySelector('.hold');
        
        box_title.ondblclick  = () => {
            const ranking_editor    = document.querySelector('ranking-editor');
            ranking_editor.currentTarget    = this._id;
        };

        box_hold.onmousedown  = () => this.draggable  = true;
        box_hold.ontouchstart = () => this.draggable  = true;
        this.ondragstart    = this.dragStartEvent;
        this.ondragend  = this.dragEndEvent;
        this.ondragover = (ev) => this.dragOverEvent(ev);
        this.ondrop = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
        }
    }

    dragStartEvent(ev) {
        window.navigator.vibrate(100);

        ev.dataTransfer.clearData();
        ev.dataTransfer.setData('text/plain', this.id);
        this.classList.add('dragging');
    }

    dragEndEvent() {
        this.classList.remove('dragging');
        this.draggable  = false;
    }

    dragOverEvent(ev) {
        const dragging  = document.querySelector('.dragging');
        
        if((ev.dataTransfer.types.includes('Files'))||(!dragging.id.includes('item'))) {
            ev.preventDefault();
            return;
        }
        const color = this.dataset.color;
        dragging.style.setProperty('--dragging-shadow', `${color && color !== 'transparent' ? color : 'white'}`);

        const newPosition   = this.getNewPosition(ev.clientX, ev.clientY);

        if(newPosition) {
            newPosition.insertAdjacentElement('beforebegin', dragging);
        } else {
            this.appendChild(dragging);
        }

    }

    getNewPosition(posX, posY) {
        const itens = this.querySelectorAll('item-img:not(.dragging)');

        for(let item of itens) {
            const item_attr = item.getBoundingClientRect();
    
            const middleX   = item_attr.x + item_attr.width / 2;
            const item_y    = item_attr.y;
            const item_height   = item_attr.y + item_attr.height;
    
            if((posX <= middleX)&&(posY >= item_y)&&(posY <= item_height)) {
                return item;
            }
        }

        return null;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(this.isConnected && name === 'data-title') {
            const p_text    = this.shadowRoot.querySelector('.p-text');
            p_text.textContent  = newValue;
        }

        if(this.isConnected && name === 'data-color') {
            const box_title = this.shadowRoot.querySelector('.box-title');
            box_title.style.backgroundColor = newValue;
        }
    }

    static get observedAttributes() {
        return ['data-title','data-color'];
    }

    set boxTitleValues(new_value) {
        this.dataset.title  = new_value['title'];
        this.dataset.color  = new_value['color'] ?? 'transparent';
    }
}