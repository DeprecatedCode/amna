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

var renderTOC = function (baseURL, currentSection) {

    var prefix = '### Table of Contents';

    return prefix + '\n\n' + sections.map(function (section) {
        return ('- *[' + section.title + '](' + baseURL + section.docpath + ')*').replace(
            /\*/g, currentSection && currentSection.title === section.title ? '*' : '');
    }).join('\n');
};

var spanContent = function (content, name, value) {
    return content.replace(new RegExp('<span class\=\"' + name + '\">[^]*?<\/span>', 'g'),
                           '<span class="' + name + '">\n' + value + '\n</span>');
}

var process = function (path, section) {
    if (!exists(path)) {
        write(path, '<span class="title"></span>\n\n<span class="toc"></span>\n');
        return process(path);
    }

    var content = read(path).toString();
    
    content = spanContent(content, 'toc', renderTOC('', section));
    content = spanContent(content, 'title', section ? '# `amna.' + section.title + '`' : '# AMNA Documentation');

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
