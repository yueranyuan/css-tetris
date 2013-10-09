define(function() {
    function Vec(x, y) {
        this.x = x;
        this.y = y;
    }

    Vec.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    Vec.prototype.mult = function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    Vec.prototype.clone = function() {
        return new Vec(this.x, this.y);
    }

    return Vec;
});
