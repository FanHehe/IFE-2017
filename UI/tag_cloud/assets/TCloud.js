function TCloud (options = {}) {
	if (!(this instanceof TCloud)) return new TCloud;
	this.options = options;
	this.data = options.data || example;
	this.style = options.style || 'sphere';

	this.size = { width: options.width, height: options.height };
	this.init();
	this[this.style]();
};

TCloud.prototype.init = function () {
	this.cloud = document.createElement('ul');
	this.cloud.classList.add('tcloud-container');
	this.list = this.data.map((item, index) => `<li data-index = ${index}><a href = "#">${ item.content ? item.content : item }</a></li>`);
	this.cloud.innerHTML = this.list.join('');
};
TCloud.prototype.sphere = function () {
	const r = 150;
	const { width, height }= this.size;
	const i = 0;
	const phi = 0;
	const theta = 0;
	const max = this.list.length + 1;
	while (i++ < max) {
		phi = Math.acos(-1 + (2 * i - 1) / max);
		theta = Math.sqrt(max * Math.PI) * phi;
		tags[i - 1].cx = r * Math.cos(theta) * Math.sin(phi);
		tags[i - 1].cy = r * Math.sin(theta) * Math.sin(phi);
		tags[i - 1].cz = r * Math.cos(phi); 
		// tags[i - 1].h = jQuery(tags[i - 1]).height() / 4;
		// tags[i - 1].w = jQuery(tags[i - 1]).width() / 4;
	}
}
TCloud.prototype.insertInto = function (id) {
	var selector = id && id[0] === '#' ? id : '#' + id;
	this.container = document.querySelector(selector) || document.body;
	this.container.appendChild(this.cloud);
}
var example = [1,2,3,4,5,6,7,8,9,0,10,1,1,23,4,5,6,834,12312,312,312321312,3,123,21312,32,13,12,312,3123];