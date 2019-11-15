class Lion {

    constructor(name, hairColor) {
    this.name = name;
    this.hairColor = hairColor;
    };

    logName() {
        console.log('ROAR, I AM ', this.name);
    };

} ;

goldenLion = new Lion('Herbert', 'golden');
redLion = new Lion('Nixon', 'red' );

console.log(goldenLion);
console.log(redLion);

goldenLion.logName();
redLion.logName();