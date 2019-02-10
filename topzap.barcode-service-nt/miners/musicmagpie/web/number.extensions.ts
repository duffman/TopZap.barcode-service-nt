interface Number {
	pad(length : number) : string;
}

Number.prototype.pad = function(this: Number, length: number) {
    var s = String(this);
    while (s.length < (length || 2)) {s = "0" + s;}
    return s;
}