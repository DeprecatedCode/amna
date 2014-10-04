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

var toc = function (baseURL) {
    return sections.map(function (section) {
        return '- [' + section.title + '](' + baseURL + docpath + ')';
    }).join('\n');
};

var process = function (path) {
    if (!exists(path)) {
        write(path, '<toc></toc>');
        return process(path);
    }

    var content = read(path).toString();
    content = content.replace(/<toc>.*<\/toc>/g, '<toc>a</toc>');
    write(path, content);
    console.info('Wrote ' + path);
};

/**
 * Process documentation
 */
process('README.md');

sections.map(function (section) {
    process(section.docpath)
});

console.log('Done!');
