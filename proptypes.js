
export var mappable = (props, propName, componentName) => {
    // console.log('Here', propName, props[propName], props[propName].map);
    if (props[propName] && 'map' in props[propName]) {
        return null;
    }
    return new Error('Failed propType: `' + propName + '` in `' + componentName + '` needs to be mappable (have method `map`).');
};

export var symbol = (props, propName, componentName) => {
    // console.log('Here', propName, props[propName], props[propName].map);
    try {
        if (props[propName].toString().substr(0, 7) === 'Symbol(') {
            return null;
        }
    } catch (err) {};
    return new Error('Failed propType: `' + propName + '` in `' + componentName + '` needs to be a Symbol.');
};
