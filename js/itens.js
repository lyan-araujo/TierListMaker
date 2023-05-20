function create(inpt) {
    const files = inpt.files;
    const neutral_zone  = document.querySelector('#neutral-zone');

    for(let file of files) {
        const url   = URL.createObjectURL(file);
        const div   = document.createElement('div');
        
        div.style.backgroundImage   = `url(${url})`;
        div.classList.add('item');
        div.setAttribute('draggable', true);
        div.oncontextmenu   = (ev) => ev.preventDefault();

        neutral_zone.insertAdjacentElement('beforeend', div);
    }
    
    inpt.value  = null;
    addDragDrop();
}

function dragStart(ev) {
    const _target   = ev.target;
    if(!_target.classList.contains('item')) {
        ev.preventDefault();
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

function getNewPosition(dropzone, posX, posY) {
    const itens = [...dropzone.children].filter(item => !item.classList.contains('-dragging'));

    for(const item of itens) {
        const item_attr = item.getBoundingClientRect();

        const middleX   = item_attr.x + item_attr.width / 2;
        const item_y    = item_attr.y;
        const item_height   = item_attr.y + item_attr.height;

        if((posX <= middleX)&&(posY >= item_y)&&(posY <= item_height)) {
            // result  = item;
            return item;
        }
    }

    return null;
}

function dropzone(dropzone, ev) {
    const dragging  = document.querySelector('.-dragging');

    if((!dragging)||(!dragging.classList.contains('item'))) {
        ev.preventDefault();
        return;
    }

    const newPosition   = getNewPosition(dropzone, ev.clientX, ev.clientY);

    if(newPosition) {
        newPosition.insertAdjacentElement('beforebegin', dragging);

    } else {
        dropzone.appendChild(dragging);

    }
}

function addDragDrop() {
    const itens = document.querySelectorAll('.item');
    const box_items  = document.querySelectorAll('.box-item');

    itens.forEach((item) => {
        item.ondragstart    = (ev) => dragStart(ev);
        item.ondragend  = (ev) => dragEnd(ev);
    });

    box_items.forEach((box_item) => {
        box_item.ondragover = (ev) => dropzone(box_item, ev);
        box_item.ondrop = (ev) => ev.preventDefault();
    });
}

export {create};