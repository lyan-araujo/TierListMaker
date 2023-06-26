export class TierslistContainer {
    constructor(element) {
        this.element    = element;
        this.element.ondragover = this.dragOverEvent.bind(this);
        this.element.ondrop = (ev) => ev.preventDefault();
    }

    dragOverEvent(ev) {
        const dragging  = document.querySelector('.dragging');

        if((ev.dataTransfer.types.includes('Files'))||(!dragging.id.includes('line'))) {
            ev.preventDefault();
            return;
        }
        const color = dragging.dataset.color;

        dragging.style.setProperty('--dragging-shadow', `${color && color !== 'transparet' ? color : 'white'}`);

        let newPosition =   this.getNewPosition(ev.clientY);

        if(newPosition) {
            newPosition.insertAdjacentElement('beforebegin', dragging);
        } else {
            this.element.appendChild(dragging);
        }
    }

    getNewPosition(posY) {
        const lines = [...this.element.children].filter((line) => !line.classList.contains('dragging'));

        for(let line of lines) {
            let line_attr   = line.getBoundingClientRect();
            let middleY = line_attr.y + line_attr.height / 2;

            if(posY <= middleY) {
                return line;
            }
        }

        return null;
    }
    
    static TierlistContainerClassAttribute() {
        new TierslistContainer(document.querySelector('#tierlist-container'));
    }
}