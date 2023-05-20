import * as items from "./itens.js";
import * as ranking_container from "./ranking_container.js";


const inp_img_upload    = document.querySelector('#inp-img-upload');


inp_img_upload.onchange = () => items.create(inp_img_upload);

window.ondragover   = (ev) => {
    if(ev.target === inp_img_upload) {
        return;
    }
    ev.preventDefault();
}
window.ondrop   = (ev) => {
    if(ev.target === inp_img_upload) {
        return;
    }
        ev.preventDefault();
}

ranking_container.addDragDrop();