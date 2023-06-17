import { ItemImg } from "./components/item-img.js";
import { RankingLine } from "./components/ranking-line.js";
import { TierslistContainer } from "./tierlist-container.js";


const inp_img_upload    = document.querySelector('#inp-img-upload');


inp_img_upload.onchange = function() {
    ItemImg.createItemImg(this);
    this.value  = null;
};

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


customElements.define('item-img', ItemImg);
customElements.define('ranking-line', RankingLine);
TierslistContainer.TierlistContainerClassAttribute();