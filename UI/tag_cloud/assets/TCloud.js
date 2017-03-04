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
	const { width, height }= this.size;

}
TCloud.prototype.insertInto = function (id) {
	var selector = id && id[0] === '#' ? id : '#' + id;
	this.container = document.querySelector(selector) || document.body;
	this.container.appendChild(this.cloud);
}
var example = [1,2,3,4,5,6,7,8,9,0,10,1,1,23,4,5,6,834,12312,312,312321312,3,123,21312,32,13,12,312,3123];