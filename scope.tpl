var __id = "data-${id}";
var __beforeCreate = __exports.beforeCreate;

function __override(f){
    return function(){
        var attrs = arguments[1].attrs || {};
        attrs[__id] = "";
        arguments[1].attrs = attrs;
        return f.apply(this, arguments);
    }
}

__exports.beforeCreate = function(){
    __beforeCreate && __beforeCreate.call(this, arguments);
    this._c = __override(this._c);
    this.$createElement = __override(this.$createElement);
};