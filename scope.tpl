var __id = "data-${id}";
var __beforeCreate = __exports.__beforeCreate;

function __override(f){
    return function(...args){
        var attrs;

        if(typeof args[1] == 'object'){
            attrs = args[1].attrs || {};
            attrs[__id] = "";
            args[1].attrs = attrs;
        }else{
            attrs = {};
            attrs[__id] = "";
            var arg2 = {attrs: attrs};
            args.splice(1, 0, arg2);
        }
        
        return f.apply(this, arguments);
    }
}

__exports.beforeCreate = function(){
    __beforeCreate && __beforeCreate.call(this, arguments);
    this._c = __override(this._c);
    this.$createElement = __override(this.$createElement);
};