'use strict';

var REG = /<(script|style|template)>([\s\S]*?)<\/\1>/gi;

module.exports = function(content, file){
    var script = '', tpl = '';

    content.replace(REG, function(all, tag, cont){
        var ext;

        if(tag == 'script'){
            script = cont;
        }else if(tag == 'template'){
            tpl = cont;
        }else{
            //生成同名css，并编译一次，默认less，可通过match修改
            var css = feather.file.wrap(feather.project.getProjectPath() + file.subpathNoExt + '.css');
            css.setContent(cont);
            feather.compile(css);
            //添加至依赖中
            file.addRequire(css.id);
        }
    });

    //exports.default 支持后续es6编译
    return 'var _vueTpl = ' + JSON.stringify(tpl) + ';\r\n' + script + '\r\nmodule.exports[\'default\'] ? (module.exports[\'default\'].template = _vueTpl)'
        + ' : (module.exports.template = _vueTpl)';
};