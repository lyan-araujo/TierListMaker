export class ItemImg extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._url;
        this._id    = this.createID();
        this.inicializado   = false;
    }

    async defineUrl(file) {
        let promisse    = new Promise((resolve) => resolve(URL.createObjectURL(file)));
        this._url   = await promisse;

        let item_img    = this.shadowRoot.querySelector('.item-img');
        item_img.style.backgroundImage  = `url(${this._url})`;
    }

    createID() {
        return  `item_${Math.floor(Math.random() * Date.now()).toString(36)}`;
    }

    connectedCallback() {
        if(this.inicializado === false) {
            this.inicializado   = true;
            this.buildElement();
        }
    }
    
    buildElement() {
        this.id = this._id;
        const styles    = this.getStyles();
        const template  = this.getTemplate();

        this.shadowRoot.append(styles, template);
        this.createEvents();

    }

    getTemplate() {
        const div   = document.createElement('div');
        div.classList.add('item-img');

        return div;
    }

    getStyles() {
        this.style.width    = 'max-content';
        this.style.height   = 'max-content';
        this.style.borderRadius = '.3rem';
        
        const style = document.createElement('style');
        style.textContent   = `
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .item-img {
            display:block;
            width: var(--item-size);
            height: var(--item-size);
            border-radius: .3rem;
            background-position: center;
            background-size: cover;
            object-fit: cover;
            object-position: center;
            overflow: hidden;
        }
        `;
        
        return style;
    }

    createEvents() {
        const item_img  = this.shadowRoot.querySelector('.item-img');        
        
        item_img.oncontextmenu  = (ev) => ev.preventDefault();
        this.draggable  = true;
        this.ondragstart    = this.dragStartEvent;
        this.ondragend  = this.dragEndEvent;
    }

    dragStartEvent(ev) {
        ev.stopPropagation();
        window.navigator.vibrate(100);
        
        ev.dataTransfer.clearData();
        ev.dataTransfer.setData('text/plain', this.id);
        this.classList.add('dragging');
    }

    dragEndEvent() {
        this.classList.remove('dragging');
    }

    static async createItemImg(inpt) {
        const files = inpt.files;
        const neutral_zone  = document.querySelector('#neutral-zone');

        for(let file of files) {
            const item_img  = document.createElement('item-img');
            item_img.defineUrl(file);

            neutral_zone.insertAdjacentElement('beforeend', item_img);
        }
    }
}