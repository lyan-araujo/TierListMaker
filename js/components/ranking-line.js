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

        this.ondragstart    = this.dragStartEvent;
        this.ondragend  = this.dragEndEvent;
        this.ondragover = (ev) => this.dragOverEvent(ev);
        this.ondrop = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
        }
    }

    async lineUpdate(r_title) {

        const ranking_editor    = document.querySelector('ranking-editor');
        const title = r_title.querySelector('.title_text');


        ranking_editor.updateValue(title.textContent).then((result) => {
            title.textContent  = result;
        });
    }

    getTemplate() {
        const r_line    = document.createElement('div');
        r_line.classList.add('ranking-line');

        const r_title   = document.createElement('div');
        r_title.lang    = 'pt-br';
        r_title.classList.add('ranking-title');
        r_title.ondblclick  = () => this.lineUpdate(r_title);
        
        const menu_dots = document.createElement('i');
        menu_dots.classList.add('menu_dots');
        // menu_dots.style.color   = '#bdbfc1';
        menu_dots.innerHTML = '&hellip;';   

        const title_text    = document.createElement('p');
        title_text.classList.add('title_text');
        title_text.textContent  = this.dataset.title ?? '[title]';
        
        r_title.append(menu_dots, title_text);

        const r_container   = document.createElement('div');
        r_container.classList.add('ranking-container');
        
        const slot  = document.createElement('slot');

        r_container.appendChild(slot);

        const r_hold    = document.createElement('div');
        r_hold.classList.add('hold');

        r_hold.onmousedown  = () => this.draggable  = true;
        r_hold.ontouchstart = () => this.draggable  = true;

        r_line.append(r_title, r_container, r_hold);

        return r_line;
    }

    getStyle() {
        const style = document.createElement('style');
        style.textContent   = `
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .ranking-line {
            display: grid;
            grid-template-columns: auto 1fr auto;
        }

        .ranking-title {
            display: grid;
            grid-template-rows: auto 1fr;
            width: 5rem;
            min-height: var(--item-size);
            border: .1rem solid var(--cor-1);
            font-size: large;
        }
        
        .ranking-title > .menu_dots {
            display: flex;
            justify-content: flex-start;
            align-items: flex-end;
            height: .6em;
            overflow: hidden;
        }

        .ranking-title > .title_text {
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

        .ranking-container {
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
        }
        
        `;

        return style;
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
}