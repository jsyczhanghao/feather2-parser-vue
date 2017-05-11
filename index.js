'use strict';

var REG = /<(script|style|template)>([\s\S]*)<\/\1>/gi;

module.exports = function(content, file){
    var script = '', tpl = '', style = '';

    content.toString().replace(REG, function(all, tag, cont){
        if(cont.trim() == '') return;

        if(tag == 'script'){
            script = cont;
        }else if(tag == 'template'){
            tpl = cont;
        }else{
            //生成一个临时文件进行css编译
            var css = feather.file.wrap(feather.project.getProjectPath() + file.subpathNoExt + '_.css');
            css.cache = file.cache;
            css.setContent(cont);
            feather.compile(css);
            css.links.forEach(function(f){
                file.addLink(f);
            });
            file.derived.push(css);
            file.addRequire(css.id);
        }
    });

    if(!script && !tpl){
        return content;
    }

    if(tpl){
        //exports.default 支持后续es6编译
        script += ';var _vueTpl = ' + JSON.stringify(tpl) + ';module.exports[\'default\'] ? (module.exports[\'default\'].template = _vueTpl)'
        + ' : (module.exports.template = _vueTpl);';
    }

    return script;
};