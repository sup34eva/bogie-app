import Module from 'module';

const originalRequire = Module.prototype.require;

Module.prototype.require = function (fileName) {
    if (fileName === 'react-native') {
        return originalRequire.call(this, 'react-native-web');
    }

    try {
        return originalRequire.call(this, `${fileName}.web`);
    } catch (e) {
        try {
            return originalRequire.call(this, fileName);
        } catch(err) {
            console.error(e.message);
            throw err;
        }
    }
};
