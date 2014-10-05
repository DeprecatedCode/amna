var fs = require('fs');
var exists = fs.existsSync;
var dir = fs.readdirSync;
var read = fs.readFileSync;
var write = fs.writeFileSync;

if (!exists('./lib/$express.js')) {
    throw new Error('Must be run from amna root directory: node dev/docs');
}

var sections = dir('./lib').filter(function (name) {
    return name.indexOf('.js', name.length - 3) !== -1;
}).sort().map(function (name) {
    var title = name.replace('.js', '');
    return {
        path: 'lib/' + name,
        docpath: 'docs/lib/' + title + '.md',
        title: title
    };
});

var renderTOC = function (currentSection) {

    var prefix = '### Table of Contents\n\n- [Documentation Home](../../' + (currentSection ? '../../' : '') +'#documentation)';

    return prefix + '\n- `lib`\n' + sections.map(function (section) {
        var link = (currentSection ? '../../' : '') + section.docpath +
                   '#amna' + section.title.toLowerCase().replace(/[^a-z0-9-_]/g, '');
        return ('    - *[' + section.title + '](' + link + ')*').replace(
            /\*/g, currentSection && currentSection.title === section.title ? '**' : '');
    }).join('\n');
};

var spanContent = function (content, name, value) {
    return content.replace(new RegExp('<!--:' + name + ':-->[^]*?<!--:end:-->', 'g'),
                           '<!--:' + name + ':-->\n' + value + '\n<!--:end:-->');
}

var process = function (path, section) {
    if (!exists(path)) {
        write(path, '<!--:toc:--><!--:end:-->\n\n<!--:title:--><!--:end:-->\n');
        return process(path, section);
    }

    var content = read(path).toString();
    
    // Render Title
    content = spanContent(content, 'title', section ? '# `amna.' + section.title + '`' : '# AMNA Documentation');

    // Render Table of Contents
    content = spanContent(content, 'toc', renderTOC(section));

    write(path, content);
    console.info('Wrote ' + path);
};

/**
 * Process documentation
 */
process('README.md');

sections.map(function (section) {
    process(section.docpath, section)
});

console.log('Done!');
