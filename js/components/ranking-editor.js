export class RankingEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        const style = this.getStyle();
        const template  = this.getTemplate();

        this.shadowRoot.append(style, template);
    }
    
    updateValue(_value) {
        this.classList.add('open');

        const overlay   = this.shadowRoot.querySelector('#menu-overlay');
        const modal = this.shadowRoot.querySelector('#menu-modal');
        const textarea  = this.shadowRoot.querySelector('#menu-editor-txtarea');
        const cancelar_btn  = this.shadowRoot.querySelector('#menu-cancelar-editor');
        const salvar_btn    = this.shadowRoot.querySelector('#menu-salvar-editor');

        modal.onclick   = (ev) => ev.stopPropagation();
        textarea.value  = _value;
        textarea.focus();

        let promisse    = new Promise((resolve, reject) => {
            salvar_btn.onclick  = () => {
                this.classList.remove('open');
                resolve(textarea.value)
            };
            
            cancelar_btn.onclick    = () => {
                this.classList.remove('open');                
                reject(null)
            };
            overlay.onclick = () => {
                this.classList.remove('open');                
                reject(null)
            };
        });

        return promisse;
    }

    getTemplate() {
        const overlay   = document.createElement('div');
        overlay.id  = 'menu-overlay';

        const modal = `
            <div id='menu-modal'>
                <textarea id='menu-editor-txtarea'></textarea>
                <button id='menu-cancelar-editor'>cancelar</button>
                <button id='menu-salvar-editor'>salvar</button>
            </div>
        `
        overlay.insertAdjacentHTML('beforeend', modal);

        return overlay;
    }

    getStyle() {
        const style = document.createElement('style');
        style.textContent   = `
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        #menu-overlay {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;    
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: all;
            background-color: #0003;
            z-index: 99;
            overflow-y: auto;
        }

        #menu-modal {
            width: min(100%, 50rem);
            height: min(max-content, 100%);
            background-color: white;
            padding: .5rem;
        }

        #menu-editor-txtarea {
            width: 100%;
            height: 6em;
            resize: none;
            font-size: x-large;
        }
        `;

        return style;
    }
}