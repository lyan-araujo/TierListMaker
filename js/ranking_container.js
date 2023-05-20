function validateDragStart(posX, posY) {
    const elements  = document.elementsFromPoint(posX, posY);
    for (const element of elements) {
        if((element.classList.contains('hold'))) {
            return true;
        }
    }

    return false;
}

function dragStart(ev) {
    const _target   = ev.target;
    const validate  = validateDragStart(ev.clientX, ev.clientY);

    if((!_target.classList.contains('ranking-container'))||(!validate)){
        if(!_target.classList.contains('item')) {
            ev.preventDefault();
        }
        return;
    }
    window.navigator.vibrate(100);

    ev.dataTransfer.setData('text/plain', _target);
    _target.classList.add('-dragging');
}

function dragEnd(ev) {
    ev.target.classList.remove('-dragging');
    ev.dataTransfer.clearData();
}

function getNewPosition(dropzone, posY) {
    const itens = [...dropzone.children].filter(item => !item.classList.contains('-dragging'));

    for(const item of itens) {
        const item_attr = item.getBoundingClientRect();
        const middleY   = item_attr.y + item_attr.height / 2;

        if(posY <= middleY) {
            return item;
        }
    }

    return null;
}

function dropzone(dropzone, ev) {
    const dragging  = document.querySelector('.-dragging');

    if((!dragging)||(!dragging.classList.contains('ranking-container'))) {
        return;
    }

    const newPosition   = getNewPosition(dropzone, ev.clientY);

    if(newPosition) {
        newPosition.insertAdjacentElement('beforebegin', dragging);

    } else {
        dropzone.appendChild(dragging);
    }
}

function addDragDrop() {
    const ranking_container = document.querySelectorAll('.ranking-container');
    const container = document.querySelector('#container');

    ranking_container.forEach((refer_container) => {
        refer_container.ondragstart = (ev) => dragStart(ev);
        refer_container.ondragend   = (ev) => dragEnd(ev);
    });

    container.ondragover    = (ev) => dropzone(container, ev);
    container.ondrop    = (ev) => ev.preventDefault();
}

export { addDragDrop };