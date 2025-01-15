memory = {}

let memoryOptions = {
    startAddress: Storage.getIntValue("startAddress", 0),      // Start address of the memory
    memorySize: Storage.getIntValue("memorySize", 1_048_576),  // The size of the memory in bytes
    maxValue: Storage.getIntValue("maxValue", 128),            // The max value of the memory
    memoryWord: Storage.getIntValue("memoryWord", 32)          // The size of the memory word
}

function __initMemory() {
    let { startAddress, memorySize, maxValue, memoryWord } = memoryOptions;
    let endAddress = startAddress + memorySize;


    let j = 0;
    for (let i = startAddress; i < endAddress; i += memoryWord) {
        let address = "0x" + ("0000" +i.toString(16)).slice(-4);
        let value = Math.floor(Math.random() * maxValue);

        memory[i] = { address, value };
        if(j++ < 75) memoryRender(memory[i]);
    }
}

function readFromMemory(address) {
    return memory[getMemoryIndex(address)].value;
}

function getMemoryIndex(address) {
    return address & ((-1) << 5)
}

function writeToMemory(address, value) {
    let index = getMemoryIndex(address);
    memory[index].value = value;
    return index;
}